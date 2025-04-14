import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Car, Map, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InsightsDriving from '@/components/insights/InsightsDriving';
import InsightsMobility from '@/components/insights/InsightsMobility';
import InsightsLifestyle from '@/components/insights/InsightsLifestyle';

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

type Category = 'driving' | 'mobility' | 'lifestyle';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function InsightsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('driving');
  const slideAnimation = useSharedValue(0);

  const categories = [
    { id: 'driving', icon: Car, label: 'Driving' },
    { id: 'mobility', icon: Map, label: 'Mobility' },
    { id: 'lifestyle', icon: Activity, label: 'Lifestyle' }
  ];

  const handleCategoryPress = (category: Category) => {
    setActiveCategory(category);
    slideAnimation.value = withSpring(categories.findIndex(c => c.id === category));
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(slideAnimation.value * (100)) }],
  }));

  const renderContent = () => {
    switch (activeCategory) {
      case 'driving':
        return <InsightsDriving />;
      case 'mobility':
        return <InsightsMobility />;
      case 'lifestyle':
        return <InsightsLifestyle />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Insights</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Animated.View style={[styles.slider, sliderStyle]} />
        {categories.map((category) => (
          <AnimatedTouchable
            key={category.id}
            onPress={() => handleCategoryPress(category.id as Category)}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.categoryButtonActive
            ]}
          >
            <category.icon
              size={24}
              color={activeCategory === category.id ? COLORS.primary : COLORS.text.secondary}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.label}
            </Text>
          </AnimatedTouchable>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
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
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 8,
    position: 'relative',
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  slider: {
    position: 'absolute',
    width: '33.33%',
    height: '100%',
    backgroundColor: 'rgba(64, 224, 208, 0.1)',
    borderRadius: 12,
    top: 8,
    left: 8,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  categoryButtonActive: {
    backgroundColor: 'transparent',
  },
  categoryText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: COLORS.primary,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
});