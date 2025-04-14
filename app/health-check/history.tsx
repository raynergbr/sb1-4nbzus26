import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Activity, TrendingUp, TrendingDown } from 'lucide-react-native';
import { getHealthCheckHistory } from '@/lib/healthCheck';
import { LinearGradient } from 'expo-linear-gradient';

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

interface HealthCheck {
  id: string;
  session_id: string;
  created_at: string;
  scan_result: {
    healthScore?: {
      score: number;
      previousScore?: number;
    };
    measurements?: any[];
  };
}

export default function HealthHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HealthCheck[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHealthCheckHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load health check history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Poor';
  };

  const handleCheckSelect = (check: HealthCheck) => {
    if (!check.session_id) {
      console.error('No session ID available for this health check');
      return;
    }

    router.push({
      pathname: '/health-check/results',
      params: { sessionId: check.session_id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your health history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Activity size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyTitle}>No Health Checks Yet</Text>
            <Text style={styles.emptyText}>
              Complete your first health check to start tracking your health journey.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/health-check')}
            >
              <Text style={styles.startButtonText}>Start Health Check</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Your Health Journey</Text>
            {history.map((check) => (
              <TouchableOpacity
                key={check.id}
                style={styles.checkCard}
                onPress={() => handleCheckSelect(check)}
              >
                <LinearGradient
                  colors={[COLORS.dark, COLORS.secondary]}
                  style={styles.cardContent}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.date}>{formatDate(check.created_at)}</Text>
                    <ChevronRight size={20} color={COLORS.white} />
                  </View>

                  {check.scan_result?.healthScore && (
                    <View style={styles.scoreSection}>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Health Score</Text>
                        <View style={[
                          styles.scoreBadge,
                          { backgroundColor: `${getScoreColor(check.scan_result.healthScore.score)}20` }
                        ]}>
                          <Text style={[
                            styles.scoreValue,
                            { color: getScoreColor(check.scan_result.healthScore.score) }
                          ]}>
                            {check.scan_result.healthScore.score}
                          </Text>
                          <Text style={[
                            styles.scoreStatus,
                            { color: getScoreColor(check.scan_result.healthScore.score) }
                          ]}>
                            {getScoreLabel(check.scan_result.healthScore.score)}
                          </Text>
                        </View>
                      </View>

                      {check.scan_result.healthScore.previousScore && (
                        <View style={styles.trend}>
                          <Text style={styles.trendLabel}>vs Previous</Text>
                          <View style={styles.trendValue}>
                            <Text style={styles.previousScore}>
                              {check.scan_result.healthScore.previousScore}
                            </Text>
                            {check.scan_result.healthScore.score > check.scan_result.healthScore.previousScore ? (
                              <TrendingUp size={16} color="#22C55E" style={styles.trendIcon} />
                            ) : (
                              <TrendingDown size={16} color="#EF4444" style={styles.trendIcon} />
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.measurementsSummary}>
                    <Text style={styles.measurementsLabel}>
                      {check.scan_result?.measurements?.length || 0} measurements recorded
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </>
        )}
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.light,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
  title: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  checkCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.white,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 8,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  scoreValue: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    marginRight: 8,
  },
  scoreStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  trend: {
    alignItems: 'flex-end',
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousScore: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
    marginRight: 4,
  },
  trendIcon: {
    marginLeft: 4,
  },
  measurementsSummary: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  measurementsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.white,
    opacity: 0.8,
  },
});