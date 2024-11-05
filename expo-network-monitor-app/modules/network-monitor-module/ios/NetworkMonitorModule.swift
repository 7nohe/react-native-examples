import ExpoModulesCore
import Network

public class NetworkMonitorModule: Module {
  private let monitor = NWPathMonitor()
  private let monitorQueue = DispatchQueue.global(qos: .default)

  public func definition() -> ModuleDefinition {
    Name("NetworkMonitorModule")

    OnCreate {
        monitor.start(queue: monitorQueue)
    }
      
    OnDestroy {
        monitor.cancel()
    }
    
    Function("isOnline") {
        let currentPath = monitor.currentPath
        let isOnline = currentPath.status == .satisfied
        print(currentPath.status)
        return isOnline
    }
      
    Function("isWifi") {
        let currentPath = monitor.currentPath
        let isWifi = currentPath.usesInterfaceType(.wifi)
        return isWifi
    }
  }
}
