import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HealthCheckCallback from '@/components/health-check/HealthCheckCallback';

export default function HealthCheckCallbackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HealthCheckCallback />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});