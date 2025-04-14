import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import HealthCheckResults from '@/components/health-check/HealthCheckResults';
import { supabase } from '@/lib/supabase';

export default function HealthCheckResultsScreen() {
  const { sessionId } = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        setIsLoading(true);
        setError(null);

        if (!sessionId) {
          setError('No session ID provided');
          return;
        }

        const { data, error: queryError } = await supabase
          .from('alula_health_check_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (queryError) {
          console.error('Error fetching session:', queryError);
          setError('Failed to fetch session data');
          return;
        }

        if (!data) {
          setError('Session not found. The health check session may have expired or been deleted.');
          return;
        }

        setSessionData(data);
      } catch (err) {
        console.error('Error in fetchSession:', err);
        setError('An unexpected error occurred while fetching your health check results');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerBackVisible: false,
          title: 'Health Check Results',
          headerStyle: {
            backgroundColor: '#F7FAFC',
          },
          headerShadowVisible: false,
        }} 
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading results...</Text>
        </View>
      ) : (
        <HealthCheckResults sessionData={sessionData} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});