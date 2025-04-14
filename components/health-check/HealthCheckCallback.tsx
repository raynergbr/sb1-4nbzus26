import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getSessionResult } from '@/lib/healthCheck';
import { supabase } from '@/lib/supabase';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#4B0082',
  dark: '#001F3F',
  light: '#F7FAFC',
  white: '#FFFFFF',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    light: '#718096'
  }
};

export default function HealthCheckCallback() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [retries, setRetries] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get session ID from URL parameters
        const sessionId = params.sessionId as string;
        
        if (!sessionId) {
          setError('No session ID provided');
          return;
        }
        
        console.log('Processing callback with session ID:', sessionId);
        
        // Add a small delay before processing in production
        if (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Get the session result from Alula
        const result = await getSessionResult(sessionId);
        
        if (!result) {
          if (retries < maxRetries) {
            // If no result yet and we haven't exceeded max retries, try again
            setRetries(prev => prev + 1);
            setTimeout(() => processCallback(), 2000); // Retry after 2 seconds
            return;
          } else {
            throw new Error('Failed to retrieve health check results after multiple attempts');
          }
        }
        
        if (result.hasError) {
          setError(result.errorMessage || 'An error occurred during the health check');
          return;
        }
        
        setSuccess(true);
        
        // Wait a moment before redirecting to results
        setTimeout(() => {
          router.replace({
            pathname: '/health-check/results',
            params: { sessionId }
          });
        }, 2000);
        
      } catch (error) {
        console.error('Callback error:', error);
        setError(error.message || 'An error occurred');
      } finally {
        if (retries >= maxRetries || success || error) {
          setLoading(false);
        }
      }
    };
    
    processCallback();
  }, [params, retries]);
  
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {retries > 0 
              ? `Processing your health check data... (Attempt ${retries}/${maxRetries})` 
              : 'Processing your health check data...'}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/health-check')}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Success!</Text>
          <Text style={styles.successText}>Your health check has been completed successfully.</Text>
          <Text style={styles.redirectText}>Redirecting to your results...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: '#DC2626',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  successContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: '#22C55E',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.light,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
});