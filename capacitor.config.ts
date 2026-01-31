import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'noteapp',
  webDir: 'public',
  server: {
    // Point to your local Next.js dev server for development
    // Use your computer's local IP address (not localhost)
    // Find your IP: ifconfig | grep "inet " | grep -v 127.0.0.1
    url: 'http://192.168.0.112:3000',
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
