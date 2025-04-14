import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { WorkSans_500Medium, WorkSans_600SemiBold } from '@expo-google-fonts/work-sans';
import { Activity, Car, Shield, Fuel, Stethoscope } from 'lucide-react-native';
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
  },
  gradient: {
    start: '#40E0D0',
    end: '#4B0082'
  }
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const categories = [
    { 
      icon: Activity, 
      title: 'Driver Insights', 
      description: 'Track your driving patterns',
      onPress: () => router.push('/insights')
    },
    { 
      icon: Car, 
      title: 'Services', 
      description: 'Vehicle maintenance info',
      onPress: () => console.log('Services pressed')
    },
    { 
      icon: Shield, 
      title: 'Licenses', 
      description: 'License management',
      onPress: () => console.log('Licenses pressed')
    },
    { 
      icon: Fuel, 
      title: 'Fuel Insights', 
      description: 'Track fuel expenses',
      onPress: () => console.log('Fuel pressed')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Driver Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>88</Text>
            <Text style={styles.scoreLabel}>Excellent</Text>
          </View>
          
          <View style={styles.metrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>92</Text>
              <Text style={styles.metricLabel}>Legal</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>92</Text>
              <Text style={styles.metricLabel}>Phone</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>80</Text>
              <Text style={styles.metricLabel}>Smooth</Text>
            </View>
          </View>

          <Pressable 
            style={styles.scanButton}
            onPress={() => router.push('/health-check')}
          >
            <Stethoscope size={20} color={COLORS.white} style={styles.scanIcon} />
            <Text style={styles.scanButtonText}>Health Check</Text>
          </Pressable>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Pressable 
              key={index}
              onPress={category.onPress}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed
              ]}>
              <category.icon size={32} color={COLORS.primary} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </Pressable>
          ))}
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
  content: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginVertical: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreTitle: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 20,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreCircle: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 8,
    borderColor: COLORS.primary,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: COLORS.text.primary,
  },
  scoreLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.light,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: COLORS.text.primary,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  categoryTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.text.light,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  scanIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
});