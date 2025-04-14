import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TriangleAlert as AlertTriangle, Smartphone, Activity } from 'lucide-react-native';
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

interface StreakType {
  icon: any;
  title: string;
  currentStreak: number;
  bestStreak: number;
}

const streakTypes: StreakType[] = [
  {
    icon: AlertTriangle,
    title: 'Legal',
    currentStreak: 13,
    bestStreak: 13,
  },
  {
    icon: Smartphone,
    title: 'Phone Handling',
    currentStreak: 16,
    bestStreak: 16,
  },
  {
    icon: Activity,
    title: 'Smooth',
    currentStreak: 0,
    bestStreak: 2,
  },
];

export default function StreaksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Streaks</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.currentStreak}>
          <Text style={styles.streakNumber}>4</Text>
          <Text style={styles.streakLabel}>Excellent trips in a row</Text>
          <View style={styles.streakDots}>
            {[...Array(10)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < 4 ? styles.dotActive : styles.dotInactive,
                  i === 3 && styles.dotCurrent
                ]}
              />
            ))}
          </View>
          <View style={styles.bestStreak}>
            <Text style={styles.bestStreakNumber}>6</Text>
            <Text style={styles.bestStreakLabel}>Best streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Driving behaviour streaks</Text>
        
        {streakTypes.map((streak, index) => (
          <View key={index} style={styles.streakCard}>
            <View style={styles.streakIcon}>
              <streak.icon size={24} color={COLORS.text.primary} />
            </View>
            <Text style={styles.streakTitle}>{streak.title}</Text>
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streak.currentStreak} Trips</Text>
                <Text style={styles.streakStatLabel}>Current streak</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streak.bestStreak} Trips</Text>
                <Text style={styles.streakStatLabel}>Best streak all time</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentStreak: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  streakNumber: {
    fontSize: 48,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#22C55E',
    marginBottom: 24,
  },
  streakDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#22C55E',
  },
  dotInactive: {
    backgroundColor: COLORS.light,
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#22C55E',
    backgroundColor: COLORS.white,
  },
  bestStreak: {
    alignItems: 'center',
  },
  bestStreakNumber: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.secondary,
  },
  bestStreakLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakStat: {
    flex: 1,
  },
  streakStatValue: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  streakStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
});