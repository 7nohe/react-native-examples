import * as React from 'react';

import { NetworkMonitorModuleViewProps } from './NetworkMonitorModule.types';

export default function NetworkMonitorModuleView(props: NetworkMonitorModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
