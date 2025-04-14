import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Chrome as Home, Briefcase, ChevronRight } from 'lucide-react-native';

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
    limited: '#FEE2E2',
    limitedText: '#EF4444',
    moderate: '#FEF3C7',
    moderateText: '#F59E0B',
    detected: '#DCFCE7',
    detectedText: '#22C55E'
  }
};

interface ActivityCardProps {
  icon: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'danger';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ icon, title, description, type }) => {
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return '#DCFCE7';
      case 'warning':
        return '#FEF3C7';
      case 'danger':
        return '#FEE2E2';
      default:
        return COLORS.light;
    }
  };

  return (
    <View style={[styles.activityCard, { backgroundColor: getBgColor() }]}>
      <View style={[styles.activityIcon, { backgroundColor: COLORS.white }]}>
        <Text style={styles.activityIconText}>{icon}</Text>
      </View>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
    </View>
  );
};

export default function InsightsLifestyle() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobility & Activity</Text>
        <View style={styles.card}>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Your Mobility</Text>
            <View style={[styles.badge, { backgroundColor: COLORS.status.limited }]}>
              <Text style={[styles.badgeText, { color: COLORS.status.limitedText }]}>Limited</Text>
            </View>
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Your Physical Activity</Text>
            <View style={[styles.badge, { backgroundColor: COLORS.status.moderate }]}>
              <Text style={[styles.badgeText, { color: COLORS.status.moderateText }]}>Moderate</Text>
            </View>
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Your Social Activity</Text>
            <View style={[styles.badge, { backgroundColor: COLORS.status.limited }]}>
              <Text style={[styles.badgeText, { color: COLORS.status.limitedText }]}>Limited</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leisure</Text>
        <ActivityCard
          icon="🏃"
          title="Physical activity moderate"
          description="Based on your daily physical activities like walking, biking, and sports, we perceive your physical activity as average."
          type="warning"
        />
        <ActivityCard
          icon="🏃"
          title="Sportive"
          description="You engage in sports or physical activities regularly, indicating a sporty lifestyle."
          type="success"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobility</Text>
        <ActivityCard
          icon="🚗"
          title="Die hard driver"
          description="You heavily rely on driving, indicating that you prefer to use a car over other forms of transport."
          type="warning"
        />
        <ActivityCard
          icon="🚶"
          title="Mobility limited"
          description="Based on your distance traveled and frequency of trips, we perceive your mobility as below average."
          type="danger"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Life</Text>
        <ActivityCard
          icon="🏠"
          title="Homeworker"
          description="You work from home"
          type="warning"
        />
        <ActivityCard
          icon="👥"
          title="Social activity limited"
          description="Based on your time spent in social settings, we perceive your social activity as below average."
          type="danger"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.light,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.primary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  activityCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});