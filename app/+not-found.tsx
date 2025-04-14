import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Oops!',
        headerTitleStyle: styles.headerTitle 
      }} />
      <View style={styles.content}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: '#40E0D0',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  headerTitle: {
    fontFamily: 'WorkSans-SemiBold',
    color: '#1a1a1a',
  },
});