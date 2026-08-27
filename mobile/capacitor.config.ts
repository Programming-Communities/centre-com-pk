import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.centre.pk',
  appName: 'Centre',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    url: 'https://www.centre.com.pk',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#3B82F6',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
    },
  },
};

export default config;
