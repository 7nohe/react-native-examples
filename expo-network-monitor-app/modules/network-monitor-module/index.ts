import NetworkMonitorModule from "./src/NetworkMonitorModule";

export function isOnline(): boolean {
  return NetworkMonitorModule.isOnline();
}

export function isWifi(): boolean {
  return NetworkMonitorModule.isWifi();
}
