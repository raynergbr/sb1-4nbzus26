import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Navigation, Map, Activity, TriangleAlert as AlertTriangle, Brain, Shield, Phone, Waves as Wave, Equal, Phone as PhoneIcon } from 'lucide-react-native';
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

interface DataItem {
  icon: any;
  title: string;
  description: string;
  backgroundColor: string;
  iconColor: string;
}

interface ScoreItem {
  icon: any;
  title: string;
  score: number;
  status: 'Perfect' | 'Average' | 'Good';
  description: string;
  backgroundColor: string;
  iconColor: string;
}

const dataCollection: DataItem[] = [
  {
    icon: Navigation,
    title: 'GPS Tracking',
    description: 'From raw GPS coordinates, we selected 179 quality location points.',
    backgroundColor: '#DCFCE7',
    iconColor: '#22C55E'
  },
  {
    icon: Map,
    title: 'Trip Summary',
    description: '12.4km traveled over 27 mins.',
    backgroundColor: '#DBEAFE',
    iconColor: '#3B82F6'
  },
  {
    icon: Activity,
    title: 'Sensor Monitoring',
    description: 'Recorded accelerometer and gyroscope data (~5.242 MB).',
    backgroundColor: '#FEF3C7',
    iconColor: '#F59E0B'
  }
];

const dataAnalysis: DataItem[] = [
  {
    icon: AlertTriangle,
    title: 'Speed Check',
    description: 'Compared your speeds with locally stored speed limits.\nDetected 0 points at which you were exceeding the speed limit by over 5 km/h.',
    backgroundColor: '#FEE2E2',
    iconColor: '#EF4444'
  },
  {
    icon: Brain,
    title: 'Behaviour Assessment',
    description: 'Identified 0 harsh events (braking, accelerating, or turning).\nNoted 11 times the phone was handled(changed orientation) during the trip.',
    backgroundColor: '#FEF3C7',
    iconColor: '#F59E0B'
  }
];

const scoringBreakdown: ScoreItem[] = [
  {
    icon: Shield,
    title: 'Legal Score',
    score: 100,
    status: 'Perfect',
    description: 'Based on adherence to speed limits.\nFrequent or severe speeding lowers this score more than minor infractions due to exponential weighting.',
    backgroundColor: '#DCFCE7',
    iconColor: '#22C55E'
  },
  {
    icon: Phone,
    title: 'Phone Handling Score',
    score: 69,
    status: 'Average',
    description: 'Indicates distraction levels.\nLess phone handling increases this score.',
    backgroundColor: '#FEF3C7',
    iconColor: '#F59E0B'
  },
  {
    icon: Wave,
    title: 'Smooth Score',
    score: 77,
    status: 'Average',
    description: 'Reflects driving smoothness.\nFewer harsh events improve this score.',
    backgroundColor: '#FEF3C7',
    iconColor: '#F59E0B'
  }
];

export default function UnderHoodScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Under the hood</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          {dataCollection.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
                <item.icon size={24} color={item.iconColor} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Analysis</Text>
          {dataAnalysis.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
                <item.icon size={24} color={item.iconColor} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring Breakdown</Text>
          {scoringBreakdown.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
                <item.icon size={24} color={item.iconColor} />
              </View>
              <View style={styles.scoreHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={[styles.scoreBadge, { backgroundColor: item.backgroundColor }]}>
                  <Text style={[styles.scoreStatus, { color: item.iconColor }]}>{item.status}</Text>
                  <Text style={[styles.scoreValue, { color: item.iconColor }]}>{item.score}</Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Score</Text>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
              <Equal size={24} color="#22C55E" />
            </View>
            <View style={styles.scoreHeader}>
              <Text style={styles.cardTitle}>Calculated Average</Text>
              <View style={[styles.scoreBadge, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.scoreStatus, { color: '#22C55E' }]}>Good</Text>
                <Text style={[styles.scoreValue, { color: '#22C55E' }]}>82</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              A holistic measure of driving behavior that combines Legal, Smooth, and Focus scores.
              A higher overall score suggests safer driving behaviors.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Events</Text>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
              <PhoneIcon size={24} color="#22C55E" />
            </View>
            <Text style={styles.cardTitle}>Calls</Text>
            <Text style={styles.cardDescription}>We detected 4 calls during the trip.</Text>
          </View>
        </View>
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
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  card: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 14,
    fontFamily: 'WorkSans-SemiBold',
  },
});