import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, Settings, Shield, CircleUser as UserCircle } from 'lucide-react-native';

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

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.replace('/sign-in');
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  const menuItems = [
    {
      icon: UserCircle,
      title: 'Account Settings',
      subtitle: 'Manage your account details',
      action: () => console.log('Account settings')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      action: () => console.log('Privacy settings')
    },
    {
      icon: Settings,
      title: 'Preferences',
      subtitle: 'Customize your experience',
      action: () => console.log('Preferences')
    },
    {
      icon: LogOut,
      title: 'Sign Out',
      subtitle: 'Log out of your account',
      action: handleSignOut,
      danger: true
    }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.dark, COLORS.secondary]}
        style={styles.header}
      >
        <Image
          source={{ 
            uri: user?.user_metadata?.avatar_url || 
                 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256&q=80' 
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
          >
            <item.icon
              size={24}
              color={item.danger ? '#ff3b30' : COLORS.dark}
              style={styles.menuIcon}
            />
            <View style={styles.menuText}>
              <Text style={[
                styles.menuTitle,
                item.danger && styles.menuTitleDanger
              ]}>
                {item.title}
              </Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 16,
  },
  name: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text.light,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  menuTitleDanger: {
    color: '#ff3b30',
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text.secondary,
  },
});