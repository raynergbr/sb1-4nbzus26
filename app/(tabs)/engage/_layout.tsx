import { Stack } from 'expo-router';

export default function EngageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="challenges" />
      <Stack.Screen name="achievements" />
    </Stack>
  );
}