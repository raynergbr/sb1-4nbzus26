import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Heart, Activity, Droplet, Settings as Lungs, ArrowUp, ArrowDown, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
  },
  status: {
    good: '#22C55E',
    goodBg: '#DCFCE7',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    danger: '#EF4444',
    dangerBg: '#FEE2E2'
  }
};

interface Measurement {
  signalName: string;
  signalDescription: string;
  category: string;
  value: number;
  unit: string;
  acceptableRangeLow?: number;
  acceptableRangeHigh?: number;
  previousValue?: number;
}

interface HealthScore {
  score: number;
  previousScore?: number;
  change?: number;
}

interface HealthCheckResult {
  scanDate: string;
  healthScore?: HealthScore;
  measurements?: Measurement[];
  hasError?: boolean;
  errorMessage?: string;
}

export default function HealthCheckResults() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sessionId = params.sessionId as string;
        
        if (!sessionId) {
          throw new Error('No session ID provided');
        }
        
        console.log('Fetching health check session data from Supabase for sessionId:', sessionId);
        
        // First, check if the session exists and is valid
        const { data: sessionCheck, error: sessionCheckError } = await supabase
          .from('alula_health_check_sessions')
          .select('id, status, session_id, created_at')
          .eq('session_id', sessionId)
          .maybeSingle();
        
        if (sessionCheckError) {
          console.error('Error checking session:', sessionCheckError);
          throw new Error('Failed to verify session status');
        }
        
        if (!sessionCheck) {
          throw new Error('Session not found. Please start a new health check.');
        }
        
        if (sessionCheck.status === 'error') {
          throw new Error('This health check session encountered an error. Please start a new session.');
        }
        
        // Now fetch the full session data
        const { data, error: fetchError } = await supabase
          .from('alula_health_check_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();
        
        if (fetchError) {
          console.error('Supabase fetch error:', fetchError);
          throw fetchError;
        }
        
        if (!data) {
          throw new Error('No health check data found for this session. Please ensure you have completed the health check process.');
        }
        
        console.log('Session data retrieved:', {
          id: data.id,
          status: data.status,
          hasResult: !!data.scan_result,
          createdAt: data.created_at
        });
        
        setSessionData(data);
        
        if (!data.scan_result) {
          // If no result yet and we haven't exceeded retries, schedule another attempt
          if (retryCount < MAX_RETRIES) {
            console.log(`No results yet, retrying in 5 seconds (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 5000);
            return;
          }
          throw new Error('Health check results are not available yet. Please try again in a few moments.');
        }
        
        setResult(data.scan_result);
        setRetryCount(0); // Reset retry count on successful fetch
      } catch (error) {
        console.error('Error fetching health check results:', error);
        setError((error as Error).message || 'Failed to load health check results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [params, retryCount]); // Added retryCount to dependencies
  
  const getIconForCategory = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'heart':
      case 'cardiac':
        return <Heart size={24} color={COLORS.primary} />;
      case 'respiratory':
        return <Lungs size={24} color={COLORS.primary} />;
      case 'blood':
        return <Droplet size={24} color={COLORS.primary} />;
      default:
        return <Activity size={24} color={COLORS.primary} />;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusInfo = (value: number, low?: number, high?: number) => {
    if (low === undefined || high === undefined) {
      return { 
        color: COLORS.status.good, 
        bgColor: COLORS.status.goodBg,
        status: 'Normal',
        icon: CheckCircle
      };
    }
    
    if (value < low) {
      return { 
        color: COLORS.status.danger, 
        bgColor: COLORS.status.dangerBg,
        status: 'Low',
        icon: ArrowDown
      };
    } else if (value > high) {
      return { 
        color: COLORS.status.danger, 
        bgColor: COLORS.status.dangerBg,
        status: 'High',
        icon: ArrowUp
      };
    } else if (value < low * 1.1 || value > high * 0.9) {
      return { 
        color: COLORS.status.warning, 
        bgColor: COLORS.status.warningBg,
        status: 'Borderline',
        icon: AlertTriangle
      };
    } else {
      return { 
        color: COLORS.status.good, 
        bgColor: COLORS.status.goodBg,
        status: 'Normal',
        icon: CheckCircle
      };
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.status.good;
    if (score >= 60) return COLORS.status.warning;
    return COLORS.status.danger;
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Poor';
  };
  
  if (loading && retryCount < MAX_RETRIES) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {retryCount > 0 
            ? `Loading your health check results... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
            : 'Loading your health check results...'}
        </Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color={COLORS.status.danger} style={styles.errorIcon} />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/health-check')}
        >
          <Text style={styles.buttonText}>Start a New Health Check</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <LinearGradient
          colors={[COLORS.dark, COLORS.secondary]}
          style={styles.headerCard}
        >
          <Text style={styles.cardTitle}>Health Score</Text>
          <Text style={styles.date}>Scan date: {formatDate(result?.scanDate || sessionData?.created_at)}</Text>
          
          {result?.healthScore ? (
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircleContainer}>
                <View style={[styles.scoreCircle, { borderColor: getScoreColor(result.healthScore.score) }]}>
                  <Text style={[styles.scoreValue, { color: getScoreColor(result.healthScore.score) }]}>
                    {result.healthScore.score}
                  </Text>
                  <Text style={[styles.scoreLabel, { color: getScoreColor(result.healthScore.score) }]}>
                    {getScoreLabel(result.healthScore.score)}
                  </Text>
                </View>
                
                {result.healthScore.previousScore && (
                  <View style={styles.changeContainer}>
                    <Text style={styles.changeLabel}>Previous</Text>
                    <View style={styles.changeValueContainer}>
                      <Text style={styles.previousScoreValue}>{result.healthScore.previousScore}</Text>
                      {result.healthScore.score > result.healthScore.previousScore ? (
                        <ArrowUp size={16} color={COLORS.status.good} style={styles.changeIcon} />
                      ) : result.healthScore.score < result.healthScore.previousScore ? (
                        <ArrowDown size={16} color={COLORS.status.danger} style={styles.changeIcon} />
                      ) : (
                        <Text style={styles.changeIcon}>–</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.noScoreText}>No health score available</Text>
          )}
        </LinearGradient>
        
        <Text style={styles.sectionTitle}>Measurements</Text>
        
        {result?.measurements?.length ? (
          result.measurements.map((measurement, index) => {
            const statusInfo = getStatusInfo(
              measurement.value, 
              measurement.acceptableRangeLow, 
              measurement.acceptableRangeHigh
            );
            const StatusIcon = statusInfo.icon;
            
            return (
              <View key={index} style={styles.measurementCard}>
                <View style={styles.measurementHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: statusInfo.bgColor }]}>
                    {getIconForCategory(measurement.category)}
                  </View>
                  <View style={styles.measurementInfo}>
                    <Text style={styles.measurementName}>{measurement.signalName}</Text>
                    <Text style={styles.measurementDescription}>{measurement.signalDescription}</Text>
                  </View>
                  <TouchableOpacity style={styles.infoButton}>
                    <Info size={16} color={COLORS.text.light} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.measurementValue}>
                  <View style={styles.valueRow}>
                    <Text style={[styles.valueText, { color: statusInfo.color }]}>
                      {measurement.value} {measurement.unit}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                      <StatusIcon size={14} color={statusInfo.color} style={styles.statusIcon} />
                      <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        {statusInfo.status}
                      </Text>
                    </View>
                  </View>
                  
                  {measurement.acceptableRangeLow !== undefined && measurement.acceptableRangeHigh !== undefined && (
                    <View style={styles.rangeContainer}>
                      <Text style={styles.rangeText}>
                        Normal range: {measurement.acceptableRangeLow} - {measurement.acceptableRangeHigh} {measurement.unit}
                      </Text>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                backgroundColor: statusInfo.color,
                                width: `${Math.min(100, Math.max(0, ((measurement.value - measurement.acceptableRangeLow) / 
                                  (measurement.acceptableRangeHigh - measurement.acceptableRangeLow)) * 100))}%` 
                              }
                            ]} 
                          />
                        </View>
                        <View style={styles.rangeMarkers}>
                          <Text style={styles.rangeMarker}>{measurement.acceptableRangeLow}</Text>
                          <Text style={styles.rangeMarker}>{measurement.acceptableRangeHigh}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  
                  {measurement.previousValue !== undefined && (
                    <View style={styles.previousValue}>
                      <Text style={styles.previousValueLabel}>Previous:</Text>
                      <Text style={styles.previousValueText}>
                        {measurement.previousValue} {measurement.unit}
                        {measurement.value > measurement.previousValue ? (
                          <Text style={{ color: COLORS.status.good }}> ▲</Text>
                        ) : measurement.value < measurement.previousValue ? (
                          <Text style={{ color: COLORS.status.danger }}> ▼</Text>
                        ) : (
                          <Text> –</Text>
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noDataCard}>
            <Text style={styles.noDataText}>No measurement data available</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/health-check')}
        >
          <Text style={styles.buttonText}>Start a New Health Check</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.status.danger,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 42,
    fontFamily: 'WorkSans-SemiBold',
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  changeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  changeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  changeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousScoreValue: {
    fontSize: 28,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
  },
  changeIcon: {
    marginLeft: 8,
  },
  noScoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  measurementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  measurementInfo: {
    flex: 1,
  },
  measurementName: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  measurementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  infoButton: {
    padding: 4,
  },
  measurementValue: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueText: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  rangeContainer: {
    marginBottom: 16,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  rangeMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeMarker: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.light,
  },
  previousValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previousValueLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.light,
    marginRight: 8,
  },
  previousValueText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.secondary,
  },
  noDataCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
});