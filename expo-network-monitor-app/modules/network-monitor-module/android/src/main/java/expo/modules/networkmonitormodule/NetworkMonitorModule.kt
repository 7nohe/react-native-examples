package expo.modules.networkmonitormodule

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NetworkMonitorModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
  private val connectivityManager: ConnectivityManager
    get() = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

  override fun definition() = ModuleDefinition {
    Name("NetworkMonitorModule")

    Function("isOnline") {
      val network = connectivityManager.activeNetwork
      val isOnline = network != null
      return@Function isOnline
    }

    Function("isWifi") {
      val network = connectivityManager.activeNetwork
      val networkCapabilities = connectivityManager.getNetworkCapabilities(network)
      return@Function networkCapabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ?: false
    }
  }
}
