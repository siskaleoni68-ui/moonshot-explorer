import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1ab8852cecbf44b2b5e74f74cb3211f4',
  appName: 'Rocket Science',
  webDir: 'dist',
  server: {
    url: 'https://1ab8852c-ecbf-44b2-b5e7-4f74cb3211f4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: '#0a0f1a',
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0f1a'
    }
  }
};

export default config;
