import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useSegments, useRouter } from 'expo-router';
import { Menu, Mic } from 'lucide-react-native';
import BurgerMenu from '@/components/BurgerMenu';
import VoiceAssistant from '@/components/VoiceAssistant';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#001F3F',
  white: '#FFFFFF',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    light: '#718096'
  }
};

export default function RootLayout() {
  useFrameworkReady();
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoiceAssistantVisible, setIsVoiceAssistantVisible] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return null;
  }

  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTintColor: COLORS.primary,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => setIsMenuOpen(true)}
              style={styles.menuButton}
            >
              <Menu size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsVoiceAssistantVisible(!isVoiceAssistantVisible)}
              style={styles.voiceButton}
            >
              <Mic size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>INFINITY</Text>
            ),
          }}
        />
        <Stack.Screen 
          name="profile" 
          options={{
            headerTitle: "Profile",
          }}
        />
      </Stack>

      <BurgerMenu 
        isVisible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      
      {isVoiceAssistantVisible && (
        <VoiceAssistant onClose={() => setIsVoiceAssistantVisible(false)} />
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 8,
  },
  voiceButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
    fontSize: 20,
    letterSpacing: 1,
  },
});