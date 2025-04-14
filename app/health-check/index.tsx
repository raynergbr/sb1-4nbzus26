import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HealthCheckForm from '@/components/health-check/HealthCheckForm';

export default function HealthCheckScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HealthCheckForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});