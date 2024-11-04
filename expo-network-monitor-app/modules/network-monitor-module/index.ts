import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NetworkMonitorModule.web.ts
// and on native platforms to NetworkMonitorModule.ts
import NetworkMonitorModule from './src/NetworkMonitorModule';
import NetworkMonitorModuleView from './src/NetworkMonitorModuleView';
import { ChangeEventPayload, NetworkMonitorModuleViewProps } from './src/NetworkMonitorModule.types';

// Get the native constant value.
export const PI = NetworkMonitorModule.PI;

export function hello(): string {
  return NetworkMonitorModule.hello();
}

export async function setValueAsync(value: string) {
  return await NetworkMonitorModule.setValueAsync(value);
}

const emitter = new EventEmitter(NetworkMonitorModule ?? NativeModulesProxy.NetworkMonitorModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { NetworkMonitorModuleView, NetworkMonitorModuleViewProps, ChangeEventPayload };
