import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'noteapp',
  webDir: 'public',
  server: {
    // iOS Simulator can access localhost directly (bypasses firewall)
    // For physical device testing, you'll need to use your network IP and configure firewall
    url: 'http://192.168.0.104:3000',
    cleartext: true,
    androidScheme: 'http'
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
      overlaysWebView: true
    }
  }
};
export default config;