// @deno-types="npm:@types/node"
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Use HTTPS for the API URL without trailing slash
const ALULA_API_URL = 'https://api.alula.health/health/digitalhealthcheck'
const CLIENT_ID = 'bc5741cc-da45-47d9-ac45-b803cc2b8e23'
const CLIENT_SECRET = '5Hz8Q~maLY2u7XW6-uv8uNrT7tLrBi72UaS12dwG'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

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

interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface SessionResponse {
  sessionId: string;
  redirectUrl: string;
  scanAllowed: boolean;
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get auth token from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get user from auth token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError) {
      console.error('Authentication error:', userError)
      return new Response(JSON.stringify({ error: `Authentication error: ${userError.message}` }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (!user) {
      console.error('No user found')
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Processing request for user:', user.id)

    // Parse request body
    const requestData = await req.json()
    const { action } = requestData

    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Processing action:', action)

    // Handle different actions
    switch (action) {
      case 'request-session':
        // Request a new health check session
        const { callbackUrl, profile } = requestData
        
        if (!callbackUrl) {
          return new Response(JSON.stringify({ error: 'Callback URL is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        if (!profile) {
          return new Response(JSON.stringify({ error: 'Profile data is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        // Validate profile data
        if (!profile.identifier || !profile.ageInYears || !profile.heightInCm || 
            !profile.weightInKg || profile.gender === undefined || profile.diabetes === undefined) {
          return new Response(JSON.stringify({ error: 'Incomplete profile data' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        try {
          console.log('Getting Alula token...')
          
          // Get Alula token
          const tokenResponse = await getAlulaToken()
          console.log('Token response:', {
            tokenType: tokenResponse.tokenType,
            expiresIn: tokenResponse.expiresIn,
            tokenPreview: tokenResponse.accessToken ? `${tokenResponse.accessToken.substring(0, 10)}...` : 'undefined'
          })
          
          // Ensure callback URL uses the correct domain for production
          let finalCallbackUrl = callbackUrl
          if (callbackUrl.includes('netlify.app')) {
            const urlParts = new URL(callbackUrl)
            const siteName = urlParts.hostname.split('.')[0]
            finalCallbackUrl = `https://${siteName}.netlify.app/health-check/callback`
          }
          
          console.log('Creating health check session with callback URL:', finalCallbackUrl)
          console.log('Profile data:', {
            identifier: profile.identifier,
            ageInYears: profile.ageInYears,
            gender: profile.gender,
          })
          
          // Create session
          const sessionResponse = await createHealthCheckSession(tokenResponse.accessToken, finalCallbackUrl, profile)
          
          // Store session in database
          if (sessionResponse.sessionId) {
            console.log('Storing session in database...')
            const { error: insertError } = await supabase
              .from('alula_health_check_sessions')
              .insert({
                user_id: user.id,
                session_id: sessionResponse.sessionId,
                status: 'pending',
                scan_data: profile
              })
              
            if (insertError) {
              console.error('Error storing session:', insertError)
            }
          }
          
          return new Response(JSON.stringify(sessionResponse), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Session creation error:', error)
          return new Response(JSON.stringify({ 
            error: `Failed to create health check session: ${error.message}`,
            scanAllowed: false,
            errorMessage: `Failed to create health check session: ${error.message}`
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'session-result':
        // Get session result
        const { sessionId } = requestData
        
        if (!sessionId) {
          return new Response(JSON.stringify({ error: 'Session ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        try {
          console.log('Getting Alula token for session result...')
          // Get Alula token
          const resultToken = await getAlulaToken()
          
          console.log('Getting session result...')
          // Get session result
          const result = await getSessionResult(resultToken.accessToken, sessionId)
          
          // Update session in database
          if (result) {
            console.log('Updating session in database...')
            const { error: updateError } = await supabase
              .from('alula_health_check_sessions')
              .update({
                status: result.hasError ? 'error' : 'completed',
                scan_result: result,
                updated_at: new Date().toISOString()
              })
              .eq('session_id', sessionId)
              .eq('user_id', user.id)
              
            if (updateError) {
              console.error('Error updating session:', updateError)
            }
          }
          
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Session result error:', error)
          return new Response(JSON.stringify({ 
            error: `Failed to get session result: ${error.message}`,
            hasError: true,
            errorMessage: `Failed to get session result: ${error.message}`
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'history':
        // Get user's health check history
        try {
          console.log('Fetching health check history...')
          const { data: sessions, error: sessionsError } = await supabase
            .from('alula_health_check_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (sessionsError) {
            throw new Error(sessionsError.message)
          }
          
          return new Response(JSON.stringify(sessions), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('History fetch error:', error)
          return new Response(JSON.stringify({ error: `Failed to get health check history: ${error.message}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      default:
        return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: `Server error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getAlulaToken(): Promise<TokenResponse> {
  try {
    console.log('Requesting Alula token...')
    console.log('Token request URL:', `${ALULA_API_URL}/Token/AccessToken`)
    console.log('Token request body:', {
      clientId: CLIENT_ID,
      secret: CLIENT_SECRET.substring(0, 3) + '...'
    })
    
    const response = await fetch(`${ALULA_API_URL}/Token/AccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        secret: CLIENT_SECRET
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Token fetch error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      })
      throw new Error(`Failed to get token (${response.status}): ${errorText}`)
    }

    const tokenData = await response.json()
    console.log('Token response received:', {
      status: response.status,
      tokenType: tokenData.tokenType,
      expiresIn: tokenData.expiresIn,
      tokenPreview: tokenData.accessToken ? `${tokenData.accessToken.substring(0, 10)}...` : 'undefined',
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!tokenData.accessToken) {
      throw new Error('No access token received in response')
    }
    
    return tokenData
  } catch (error) {
    console.error('Error getting Alula token:', error)
    throw new Error(`Failed to authenticate with Alula: ${error.message}`)
  }
}

async function createHealthCheckSession(token: string, callbackURL: string, profile: HealthProfile): Promise<SessionResponse> {
  try {
    console.log('Creating health check session...')
    console.log('Session request URL:', `${ALULA_API_URL}/Scan/RequestSession`)
    console.log('Session request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.substring(0, 10)}...`
    })
    
    const requestBody = {
      callbackURL,
      platform: 'web',
      browserUserAgent: 'Chrome',
      profile
    }
    
    console.log('Session request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(`${ALULA_API_URL}/Scan/RequestSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Session creation error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      })
      throw new Error(`Failed to create session (${response.status}): ${errorText}`)
    }

    const sessionData = await response.json()
    console.log('Session response received:', {
      status: response.status,
      sessionId: sessionData.sessionId,
      scanAllowed: sessionData.scanAllowed,
      hasRedirectUrl: !!sessionData.redirectUrl,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    return sessionData
  } catch (error) {
    console.error('Error creating health check session:', error)
    throw new Error(`Failed to create health check session: ${error.message}`)
  }
}

async function getSessionResult(token: string, sessionId: string) {
  try {
    console.log('Fetching session result...')
    console.log('Result request URL:', `${ALULA_API_URL}/Scan/SessionResult/${sessionId}`)
    console.log('Result request headers:', {
      'Authorization': `Bearer ${token.substring(0, 10)}...`
    })
    
    const response = await fetch(`${ALULA_API_URL}/Scan/SessionResult/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Session result error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      })
      throw new Error(`Failed to get session result (${response.status}): ${errorText}`)
    }

    const resultData = await response.json()
    console.log('Result response received:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    return resultData
  } catch (error) {
    console.error('Error getting session result:', error)
    throw new Error(`Failed to get health check results: ${error.message}`)
  }
}