import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.centre.pk',
  appName: 'Centre.com.pk',
  webDir: 'www',
  server: {
    url: 'https://www.centre.com.pk',
    cleartext: false,
  },
};

export default config;