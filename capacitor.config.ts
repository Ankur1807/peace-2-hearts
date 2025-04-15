
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8dc52f24133b45c6b1528fda33a10903',
  appName: 'peace-2-hearts',
  webDir: 'dist',
  server: {
    url: 'https://8dc52f24-133b-45c6-b152-8fda33a10903.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
