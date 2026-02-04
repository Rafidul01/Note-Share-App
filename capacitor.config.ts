import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noteapp.app',
  appName: 'NoteApp',
  webDir: 'out',
  server: {
    // For production, remove the url and use the deployed web app
    // url: 'http://192.168.0.110:3000',
    // cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff'
  }
};
export default config;