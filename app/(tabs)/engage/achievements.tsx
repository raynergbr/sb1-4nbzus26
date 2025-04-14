import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Navigation, Shield, Activity } from 'lucide-react-native';
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

interface Achievement {
  id: string;
  title: string;
  icon: any;
  progress: number;
  total: number;
  completed: boolean;
}

const achievements: { [key: string]: Achievement[] } = {
  'Profile': [
    {
      id: '1',
      title: 'Yes to permissions',
      icon: Navigation,
      progress: 1,
      total: 1,
      completed: true
    }
  ],
  'No speeding': [
    {
      id: '2',
      title: 'Not making tracks',
      icon: Shield,
      progress: 1,
      total: 1,
      completed: true
    },
    {
      id: '3',
      title: 'Speedy no-no',
      icon: Shield,
      progress: 66,
      total: 100,
      completed: false
    },
    {
      id: '4',
      title: 'No need for speed',
      icon: Activity,
      progress: 0,
      total: 100,
      completed: false
    }
  ]
};

export default function AchievementsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(achievements).map(([category, items]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {category} ({items.filter(item => item.completed).length}/{items.length})
            </Text>
            {items.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.completed ? '#DCFCE7' : '#F3F4F6' }
                ]}>
                  <achievement.icon
                    size={24}
                    color={achievement.completed ? '#22C55E' : '#9CA3AF'}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${(achievement.progress / achievement.total) * 100}%`,
                          backgroundColor: achievement.completed ? '#22C55E' : '#9CA3AF'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.completed ? '100% Completed' : `${Math.round((achievement.progress / achievement.total) * 100)}% Completed`}
                  </Text>
                </View>
              </View>
            ))}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
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
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
});