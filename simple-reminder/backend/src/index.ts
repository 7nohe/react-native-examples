import { Hono } from "hono";
import prismaClients from "../lib/prisma";
import { Expo } from "expo-server-sdk";

type Bindings = {
  MY_KV: KVNamespace;
  DB: D1Database;
  EXPO_ACCESS_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/ping", async (c) => {
  return c.text("pong");
});

app.get("/me", async (c) => {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.status(401);
  }
  const prisma = await prismaClients.fetch(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { token },
  });
  return c.json(user);
});

app.post("/users", async (c) => {
  const { token } = await c.req.json();
  if (!token) {
    return c.status(400);
  }
  const prisma = await prismaClients.fetch(c.env.DB);
  const user = await prisma.user.create({
    data: { token },
  });
  return c.json(user);
});

app.get("/reminders", async (c) => {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.status(401);
  }
  const prisma = await prismaClients.fetch(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { token },
    include: { reminders: true },
  });
  return c.json(user?.reminders);
});

app.post("/reminders", async (c) => {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.status(401);
  }
  const { title, date } = await c.req.json();
  if (!title || !date) {
    return c.status(400);
  }
  const prisma = await prismaClients.fetch(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { token },
  });
  if (!user) {
    return c.status(401);
  }
  const reminder = await prisma.reminder.create({
    data: {
      title,
      date: new Date(date),
      user: { connect: { id: user.id } },
    },
  });
  return c.json(reminder);
});

app.delete("/reminders/:id", async (c) => {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.status(401);
  }
  const { id } = c.req.param();
  if (!id) {
    return c.status(400);
  }
  const prisma = await prismaClients.fetch(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { token },
  });
  if (!user) {
    return c.status(401);
  }
  const reminder = await prisma.reminder.findFirst({
    where: { id, userId: user.id },
  });
  if (!reminder) {
    return c.status(404);
  }
  await prisma.reminder.delete({ where: { id } });
  return c.status(204);
});

async function sendReminders(env: Bindings) {
  const date = new Date();
  let expo = new Expo({
    accessToken: env.EXPO_ACCESS_TOKEN,
  });
  let messages = [];
  // Get all reminders that are scheduled to be sent
  const prisma = await prismaClients.fetch(env.DB);
  const reminders = await prisma.reminder.findMany({
    where: { date: { lte: date } },
    include: { user: true },
  });
  for (const reminder of reminders) {
    if (reminder.user.token) {
      messages.push({
        to: reminder.user.token,
        sound: "default" as const,
        title: "Reminder",
        body: reminder.title,
      });
    }
  }
  // Delete all reminders that are sent
  await prisma.reminder.deleteMany({
    where: { date: { lte: date } },
  });
  let chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      let tickets = await expo.sendPushNotificationsAsync(chunk);
      console.log(tickets);
    } catch (error) {
      console.error(error);
    }
  }
}

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (
  event,
  env,
  ctx
) => {
  ctx.waitUntil(sendReminders(env));
};

export default {
  fetch: app.fetch,
  scheduled,
};
