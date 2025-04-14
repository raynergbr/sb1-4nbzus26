import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { createHealthCheckSession } from '@/lib/healthCheck';

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

export default function HealthCheckForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSandbox, setIsSandbox] = useState(false);
  
  useEffect(() => {
    // Check if we're running in sandbox mode
    const checkEnvironment = () => {
      const hostname = window.location.hostname;
      setIsSandbox(hostname.includes('stackblitz.io') || hostname.includes('webcontainer.io'));
    };
    
    checkEnvironment();
  }, []);
  
  const [profile, setProfile] = useState<{
    identifier: string;
    ageInYears: number;
    heightInCm: number;
    weightInKg: number;
    smoking: boolean;
    bloodPressureMedication: boolean;
    gender: 'male' | 'female';
    diabetes: 'no' | 'type1' | 'type2';
  }>({
    identifier: user?.id || 'user-' + Math.random().toString(36).substring(2, 9),
    ageInYears: 35,
    heightInCm: 170,
    weightInKg: 70,
    smoking: false,
    bloodPressureMedication: false,
    gender: 'male',
    diabetes: 'no'
  });

  const handleChange = (field: keyof typeof profile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!profile.ageInYears || !profile.heightInCm || !profile.weightInKg) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Create a health check session with Alula
      const response = await createHealthCheckSession(profile);
      
      if (!response.scanAllowed) {
        setError(response.errorMessage || 'Health check not allowed at this time');
        return;
      }
      
      if (response.redirectUrl) {
        // For web, handle sandbox environment differently
        if (Platform.OS === 'web') {
          if (isSandbox) {
            // In sandbox, show a message explaining the limitation
            router.push({
              pathname: '/health-check/results',
              params: { 
                sessionId: response.sessionId,
                sandbox: 'true'
              }
            });
          } else {
            // In preview/production, redirect to Alula's scan interface
            console.log('Redirecting to Alula scan URL:', response.redirectUrl);
            window.location.href = response.redirectUrl;
          }
        } else {
          // For mobile, navigate to results
          router.push({
            pathname: '/health-check/results',
            params: { sessionId: response.sessionId }
          });
        }
      } else {
        setError('No redirect URL provided');
      }
      
    } catch (error) {
      console.error('Health check error:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Please provide your information for an accurate health assessment</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Age (years)*</Text>
            <TextInput
              style={styles.input}
              value={profile.ageInYears.toString()}
              onChangeText={(value) => handleChange('ageInYears', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Enter your age"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Height (cm)*</Text>
            <TextInput
              style={styles.input}
              value={profile.heightInCm.toString()}
              onChangeText={(value) => handleChange('heightInCm', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Enter your height"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Weight (kg)*</Text>
            <TextInput
              style={styles.input}
              value={profile.weightInKg.toString()}
              onChangeText={(value) => handleChange('weightInKg', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Enter your weight"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, profile.gender === 'male' && styles.radioButtonActive]}
                onPress={() => handleChange('gender', 'male')}
              >
                <Text style={[styles.radioText, profile.gender === 'male' && styles.radioTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, profile.gender === 'female' && styles.radioButtonActive]}
                onPress={() => handleChange('gender', 'female')}
              >
                <Text style={[styles.radioText, profile.gender === 'female' && styles.radioTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Do you smoke?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, profile.smoking === true && styles.radioButtonActive]}
                onPress={() => handleChange('smoking', true)}
              >
                <Text style={[styles.radioText, profile.smoking === true && styles.radioTextActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, profile.smoking === false && styles.radioButtonActive]}
                onPress={() => handleChange('smoking', false)}
              >
                <Text style={[styles.radioText, profile.smoking === false && styles.radioTextActive]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Are you on blood pressure medication?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, profile.bloodPressureMedication === true && styles.radioButtonActive]}
                onPress={() => handleChange('bloodPressureMedication', true)}
              >
                <Text style={[styles.radioText, profile.bloodPressureMedication === true && styles.radioTextActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, profile.bloodPressureMedication === false && styles.radioButtonActive]}
                onPress={() => handleChange('bloodPressureMedication', false)}
              >
                <Text style={[styles.radioText, profile.bloodPressureMedication === false && styles.radioTextActive]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Diabetes</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, profile.diabetes === 'no' && styles.radioButtonActive]}
                onPress={() => handleChange('diabetes', 'no')}
              >
                <Text style={[styles.radioText, profile.diabetes === 'no' && styles.radioTextActive]}>None</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, profile.diabetes === 'type1' && styles.radioButtonActive]}
                onPress={() => handleChange('diabetes', 'type1')}
              >
                <Text style={[styles.radioText, profile.diabetes === 'type1' && styles.radioTextActive]}>Type 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, profile.diabetes === 'type2' && styles.radioButtonActive]}
                onPress={() => handleChange('diabetes', 'type2')}
              >
                <Text style={[styles.radioText, profile.diabetes === 'type2' && styles.radioTextActive]}>Type 2</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Start Health Check</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 20,
  },
  form: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    fontFamily: 'Inter-Regular',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  radioTextActive: {
    color: COLORS.dark,
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
  },
});