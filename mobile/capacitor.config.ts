import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.centre.pk',
  appName: 'Centre.com.pk',
  webDir: '../frontend/out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
