import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Star, Target } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

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

const AnimatedCircle = Animated.createAnimatedComponent(View);

export default function InsightsDriving() {
  const score = 88; // Updated to match home page
  const progress = score / 100;

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${progress * 360}deg`) }],
  }));

  const stats = [
    { label: 'Total Trips', value: '18' },
    { label: 'Total Distance', value: '128.3 km' },
    { label: 'Average Duration', value: '14m' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreMetric}>
            <Star size={20} color={COLORS.primary} />
            <Text style={styles.scoreMetricText}>3</Text>
          </View>
          <View style={styles.scoreMetric}>
            <Target size={20} color={COLORS.primary} />
            <Text style={styles.scoreMetricText}>0</Text>
          </View>
        </View>

        <View style={styles.scoreCircle}>
          <AnimatedCircle style={[styles.progressCircle, circleStyle]} />
          <View style={styles.scoreValue}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>Excellent</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>In the last 7 days</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity onPress={() => router.push('/insights/trips')}>
              <Text style={styles.seeAllButton}>See all</Text>
            </TouchableOpacity>
          </View>
          {/* Add your trips list here */}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Streaks</Text>
            <TouchableOpacity onPress={() => router.push('/insights/streaks')}>
              <Text style={styles.seeAllButton}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.streaksContainer}>
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>4 Trips</Text>
              <Text style={styles.streakLabel}>Current streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>6 Trips</Text>
              <Text style={styles.streakLabel}>Best streak all time</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scoreContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreMetricText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.primary,
  },
  scoreCircle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 10,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  scoreValue: {
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary,
  },
  streaksContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakDivider: {
    width: 1,
    backgroundColor: COLORS.text.light,
    marginHorizontal: 16,
  },
  streakValue: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
});