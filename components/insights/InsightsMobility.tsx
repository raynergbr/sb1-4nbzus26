import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Car, User, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#4B0082',
  dark: '#001F3F',
  light: '#F7FAFC',
  white: '#FFFFFF',
  blue: '#2563EB',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    light: '#718096'
  }
};

type ComparisonMode = 'Time' | 'Count' | 'Distance';

export default function InsightsMobility() {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('Time');

  const transportData = {
    car: {
      time: 302, // minutes
      distance: 162.0, // km
      trips: 22,
      duration: '5:02'
    },
    walking: {
      time: 39, // minutes
      distance: 2.7, // km
      trips: 16,
      duration: '39'
    },
    others: {
      time: 10, // minutes
      distance: 0.5, // km
      trips: 2
    }
  };

  const maxValue = Math.max(
    transportData.car.time,
    transportData.walking.time,
    transportData.others.time
  );

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 200; // 200px is the maximum bar height
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transport Mode Comparison</Text>
          <TouchableOpacity>
            <Info size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.comparisonToggle}>
          {(['Time', 'Count', 'Distance'] as ComparisonMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setComparisonMode(mode)}
              style={[
                styles.toggleButton,
                comparisonMode === mode && styles.toggleButtonActive
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  comparisonMode === mode && styles.toggleTextActive
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.yAxisLabel}>mins</Text>
          <View style={styles.chart}>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: getBarHeight(transportData.car.time), backgroundColor: COLORS.blue }]} />
              <Text style={styles.barLabel}>Car</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: getBarHeight(transportData.walking.time), backgroundColor: COLORS.blue + '80' }]} />
              <Text style={styles.barLabel}>Walking</Text>
            </View>
            <View style={styles.barGroup}>
              <View style={[styles.bar, { height: getBarHeight(transportData.others.time), backgroundColor: COLORS.blue + '40' }]} />
              <Text style={styles.barLabel}>Others</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <TouchableOpacity>
            <Info size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.highlightIcon}>
            <Car size={24} color={COLORS.blue} />
          </View>
          <Text style={styles.highlightTitle}>Car</Text>
          <View style={styles.highlightMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.car.distance} km</Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.car.trips} trips</Text>
              <Text style={styles.metricLabel}>Trips</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.car.duration} hours</Text>
              <Text style={styles.metricLabel}>Duration</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.highlightIcon}>
            <User size={24} color={COLORS.blue} />
          </View>
          <Text style={styles.highlightTitle}>Walking</Text>
          <View style={styles.highlightMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.walking.distance} km</Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.walking.trips} trips</Text>
              <Text style={styles.metricLabel}>Trips</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{transportData.walking.duration} mins</Text>
              <Text style={styles.metricLabel}>Duration</Text>
            </View>
          </View>
        </View>

        <View style={[styles.highlightCard, styles.ecologicalCard]}>
          <View style={[styles.highlightIcon, styles.ecologicalIcon]}>
            <View style={styles.leafIconContainer}>
              <Text style={styles.leafIcon}>🌱</Text>
            </View>
          </View>
          <Text style={styles.highlightTitle}>Your ecological impact</Text>
          <Text style={styles.ecologicalScore}>Your ecological score is 86</Text>
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
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  comparisonToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.white,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  toggleTextActive: {
    color: COLORS.text.primary,
    fontFamily: 'Inter-SemiBold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 250,
    paddingBottom: 20,
  },
  yAxisLabel: {
    width: 40,
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginRight: 8,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barGroup: {
    alignItems: 'center',
    width: 60,
  },
  bar: {
    width: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  highlightCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.blue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  highlightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  ecologicalCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  ecologicalIcon: {
    backgroundColor: '#DCF9E6',
  },
  leafIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 20,
  },
  ecologicalScore: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
});