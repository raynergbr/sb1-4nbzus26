import { Stack } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Chrome as Home, Activity, History } from 'lucide-react-native';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#4B0082',
  dark: '#001F3F',
  white: '#FFFFFF',
};

export default function HealthCheckLayout() {
  return (
    <View style={styles.container}>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTintColor: COLORS.dark,
          headerTitleStyle: {
            fontFamily: 'WorkSans-SemiBold',
          },
          headerRight: () => (
            <View style={styles.headerNav}>
              <Link href="/" asChild>
                <TouchableOpacity style={styles.navButton}>
                  <Home size={24} color={COLORS.dark} />
                </TouchableOpacity>
              </Link>
              <Link href="/health-check" asChild>
                <TouchableOpacity style={styles.navButton}>
                  <Activity size={24} color={COLORS.dark} />
                </TouchableOpacity>
              </Link>
              <Link href="/health-check/history" asChild>
                <TouchableOpacity style={styles.navButton}>
                  <History size={24} color={COLORS.dark} />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Health Check',
          }}
        />
        <Stack.Screen 
          name="callback" 
          options={{
            title: 'Processing',
          }}
        />
        <Stack.Screen 
          name="results" 
          options={{
            title: 'Results',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen 
          name="history" 
          options={{
            title: 'Health History',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  navButton: {
    marginLeft: 16,
    padding: 4,
  },
});