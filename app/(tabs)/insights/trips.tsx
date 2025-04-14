import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, User, ChevronLeft } from 'lucide-react-native';
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

interface Trip {
  id: string;
  type: 'car' | 'walking';
  date: string;
  time: string;
  distance: string;
  score?: number;
  mapImage: string;
}

const trips: Trip[] = [
  {
    id: '1',
    type: 'car',
    date: 'Mar 24th',
    time: '5:31 PM',
    distance: '0.85 km',
    score: 91,
    mapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80'
  },
  {
    id: '2',
    type: 'walking',
    date: 'Mar 24th',
    time: '5:25 PM',
    distance: '0.14 km',
    mapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80'
  },
  {
    id: '3',
    type: 'car',
    date: 'Mar 24th',
    time: '5:04 PM',
    distance: '11.08 km',
    score: 95,
    mapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80'
  },
  {
    id: '4',
    type: 'car',
    date: 'Mar 24th',
    time: '7:30 AM',
    distance: '12.82 km',
    score: 88,
    mapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80'
  }
];

export default function TripsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Transports</Text>
      </View>

      <ScrollView style={styles.content}>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripCard}
            onPress={() => router.push(`/insights/trip/${trip.id}`)}
          >
            <View style={styles.tripHeader}>
              <View style={styles.tripInfo}>
                <View style={styles.typeContainer}>
                  {trip.type === 'car' ? (
                    <Car size={20} color={COLORS.text.primary} />
                  ) : (
                    <User size={20} color={COLORS.text.primary} />
                  )}
                  <Text style={styles.tripType}>
                    {trip.type === 'car' ? 'Car' : 'Walking'}
                  </Text>
                </View>
                <Text style={styles.tripDateTime}>
                  {trip.date}, {trip.time} · {trip.distance}
                </Text>
              </View>
              {trip.score && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Trip score</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreValue}>{trip.score}</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.mapContainer}>
              <View style={styles.map} />
            </View>
          </TouchableOpacity>
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
  tripCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tripInfo: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripType: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  tripDateTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
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
  mapContainer: {
    height: 160,
    backgroundColor: COLORS.light,
  },
  map: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
});