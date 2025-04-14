import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

interface HealthProfile {
  identifier: string;
  ageInYears: number;
  heightInCm: number;
  weightInKg: number;
  smoking: boolean;
  bloodPressureMedication: boolean;
  gender: 'male' | 'female';
  diabetes: 'no' | 'type1' | 'type2';
}

interface SessionResponse {
  sessionId: string;
  redirectUrl: string;
  scanAllowed: boolean;
  errorMessage?: string;
  lastScan?: string;
  nextScanAllowed?: string;
}

export async function createHealthCheckSession(profile: HealthProfile): Promise<SessionResponse> {
  try {
    // Get the current URL for the callback
    let baseUrl;
    if (Platform.OS === 'web') {
      // For deployed environment, use window.location.origin
      baseUrl = window.location.origin;
      
      // Log the base URL for debugging
      console.log('Base URL:', baseUrl);
    } else {
      // For mobile, use the API URL from env
      baseUrl = process.env.EXPO_PUBLIC_API_URL;
    }
    
    // Ensure the callback URL is properly formatted
    const callbackUrl = `${baseUrl}/health-check/callback`;
    
    // Log the callback URL for debugging
    console.log('Using callback URL:', callbackUrl);
    
    // Get current session for auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No active session found');
    }
    
    console.log('Creating health check session with profile:', {
      identifier: profile.identifier,
      ageInYears: profile.ageInYears,
      gender: profile.gender,
      callbackUrl
    });
    
    // Call the Edge Function using fetch
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/alula-health-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        action: 'request-session',
        callbackUrl,
        profile
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data) {
      throw new Error('No response received from health check service');
    }
    
    if (!data.scanAllowed && !data.errorMessage) {
      data.errorMessage = 'Health check is not allowed at this time';
    }
    
    console.log('Health check session created:', { 
      sessionId: data.sessionId,
      scanAllowed: data.scanAllowed,
      hasRedirectUrl: !!data.redirectUrl,
      redirectUrl: data.redirectUrl
    });
    
    return data;
  } catch (error) {
    console.error('Error creating health check session:', error);
    throw error;
  }
}

export async function getSessionResult(sessionId: string) {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    console.log('Fetching session result for sessionId:', sessionId);
    
    // Get current session for auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No active session found');
    }
    
    // Call the Edge Function using fetch
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/alula-health-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        action: 'session-result',
        sessionId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Session result fetched successfully');
    
    return result;
  } catch (error) {
    console.error('Error getting session result:', error);
    throw error;
  }
}

export async function getHealthCheckHistory() {
  try {
    // Get current session for auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No active session found');
    }
    
    // Call the Edge Function using fetch
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/alula-health-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        action: 'history'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting health check history:', error);
    throw error;
  }
}

export async function getLatestHealthCheck() {
  try {
    const { data, error } = await supabase
      .from('alula_health_check_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Failed to get latest health check: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No health check data found');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting latest health check:', error);
    throw error;
  }
}

export async function getHealthTrend() {
  try {
    const { data, error } = await supabase
      .from('alula_health_check_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting health trend:', error);
    throw error;
  }
}