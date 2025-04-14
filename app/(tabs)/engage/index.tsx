import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Target } from 'lucide-react-native';
import { router } from 'expo-router';
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

export default function EngageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Engage</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/engage/challenges')}
        >
          <LinearGradient
            colors={['#4338CA', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <Target size={32} color={COLORS.white} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Challenges</Text>
            <Text style={styles.cardDescription}>
              Accept driving challenges and improve your skills
            </Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>0/14</Text>
                <Text style={styles.statLabel}>No Speeding</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>0/14</Text>
                <Text style={styles.statLabel}>Focused driving</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/engage/achievements')}
        >
          <LinearGradient
            colors={['#047857', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <Trophy size={32} color={COLORS.white} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Achievements</Text>
            <Text style={styles.cardDescription}>
              Track your progress and unlock achievements
            </Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>1/1</Text>
                <Text style={styles.statLabel}>Profile</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>1/3</Text>
                <Text style={styles.statLabel}>No speeding</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 24,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
});