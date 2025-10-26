import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jamilahhijab.voal',
  appName: 'Admin Voal Jamilah',
  webDir: 'www',
  bundledWebRuntime: true,
  server: {
    allowNavigation: [
      'script.google.com',
      'jamilahhijab.com',
      '*.googleusercontent.com'
    ]
  }
};

export default config;
