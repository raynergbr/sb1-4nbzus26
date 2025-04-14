import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!validateForm()) {
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Invalid email or password');
        } else {
          setError(signInError.message);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.secondary, '#000B18']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/infinity-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                validationErrors.email && styles.inputError
              ]}
              placeholder="Email"
              placeholderTextColor={COLORS.text.light}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationErrors(prev => ({ ...prev, email: '' }));
                setError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            {validationErrors.email ? (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                validationErrors.password && styles.inputError
              ]}
              placeholder="Password"
              placeholderTextColor={COLORS.text.light}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setValidationErrors(prev => ({ ...prev, password: '' }));
                setError(null);
              }}
              secureTextEntry
              autoComplete="current-password"
            />
            {validationErrors.password ? (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 300,
    height: 100,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    color: COLORS.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  link: {
    alignSelf: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
});