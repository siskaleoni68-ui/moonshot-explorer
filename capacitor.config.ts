import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.rocketscience',
  appName: 'Rocket Science',
  webDir: 'dist',
  android: {
    backgroundColor: '#0a0f1a',
    buildOptions: {
      releaseType: 'APK'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      launchAutoHide: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0f1a'
    }
  }
};

export default config;
