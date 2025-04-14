import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Car } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

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

interface ScoreItem {
  title: string;
  score: number;
  status: 'Perfect' | 'Average';
  info?: string;
}

const scores: ScoreItem[] = [
  {
    title: 'Legal',
    score: 100,
    status: 'Perfect',
    info: 'You followed all traffic rules perfectly'
  },
  {
    title: 'Phone Handling',
    score: 68,
    status: 'Average',
    info: 'Some phone usage detected during the trip'
  },
  {
    title: 'Smooth',
    score: 77,
    status: 'Average',
    info: 'Moderate acceleration and braking detected'
  }
];

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80' }}
            style={styles.mapImage}
          />
        </View>

        <View style={styles.tripInfo}>
          <View style={styles.tripHeader}>
            <View style={styles.tripMeta}>
              <Text style={styles.tripDate}>Mar 20, 2025 4:52 PM</Text>
              <View style={styles.tripStats}>
                <Car size={16} color={COLORS.text.secondary} />
                <Text style={styles.tripDistance}>12.4 km · 27 mins</Text>
              </View>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Trip score</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreValue}>89</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Trips driving scores</Text>
          
          {scores.map((score, index) => (
            <View key={index} style={styles.scoreItem}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>{score.title}</Text>
                <TouchableOpacity>
                  <Info size={16} color={COLORS.text.light} />
                </TouchableOpacity>
              </View>
              <View style={styles.scoreDetails}>
                <Text style={[
                  styles.scoreStatus,
                  { color: score.status === 'Perfect' ? '#22C55E' : '#F59E0B' }
                ]}>
                  {score.status}
                </Text>
                <Text style={styles.scoreNumber}>{score.score}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.moreDetails}
            onPress={() => router.push(`/insights/trip/${id}/under-hood`)}
          >
            <Text style={styles.moreDetailsText}>Under the hood</Text>
            <ChevronLeft size={20} color={COLORS.text.secondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
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
  mapContainer: {
    height: 300,
    backgroundColor: COLORS.light,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripInfo: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  tripMeta: {
    flex: 1,
  },
  tripDate: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  tripStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  scoreBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  scoreItem: {
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
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  scoreNumber: {
    fontSize: 24,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  moreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  moreDetailsText: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
});