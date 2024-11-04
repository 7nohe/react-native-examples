import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { NetworkMonitorModuleViewProps } from './NetworkMonitorModule.types';

const NativeView: React.ComponentType<NetworkMonitorModuleViewProps> =
  requireNativeViewManager('NetworkMonitorModule');

export default function NetworkMonitorModuleView(props: NetworkMonitorModuleViewProps) {
  return <NativeView {...props} />;
}
