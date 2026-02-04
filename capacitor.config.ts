import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noteapp.app',
  appName: 'NoteApp',
  webDir: 'out',
  server: {
    // Point to your deployed Vercel URL
    url: 'https://note-share-app-one.vercel.app', // Replace with your actual Vercel URL
    cleartext: false,
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