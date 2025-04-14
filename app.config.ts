import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "INFINITY",
  slug: "infinity",
  version: "1.0.0",
  orientation: "portrait",
  icon: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=256&auto=format&fit=crop&crop=center",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029&auto=format&fit=crop",
    resizeMode: "contain",
    backgroundColor: "#001F3F"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=1024&auto=format&fit=crop&crop=center",
      backgroundColor: "#001F3F"
    }
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=256&auto=format&fit=crop&crop=center"
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  }
});