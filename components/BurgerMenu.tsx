import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { CircleUser as UserCircle, LogOut, ChevronRight, Settings } from 'lucide-react-native';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#4B0082',
  dark: '#001F3F',
  white: '#FFFFFF',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    light: '#718096'
  }
};

interface BurgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BurgerMenu({ isVisible, onClose }: BurgerMenuProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const menuAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(isVisible ? 0 : -300, {
          damping: 15,
          stiffness: 90
        })
      }
    ]
  }));

  const overlayAnimation = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 0.5 : 0, {
      duration: 300
    }),
  }));

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      const { error } = await signOut();
      
      if (error) throw error;
      
      onClose();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfilePress = () => {
    onClose();
    router.push('/profile');
  };

  const handleSettingsPress = () => {
    onClose();
    router.push('/settings');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[styles.overlay, overlayAnimation]}
          pointerEvents={isVisible ? 'auto' : 'none'}
        >
          <TouchableOpacity 
            style={styles.overlayPressable} 
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View style={[styles.menu, menuAnimation]}>
          <View style={styles.header}>
            <Image
              source={{ 
                uri: user?.user_metadata?.avatar_url || 
                     'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256&q=80' 
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.email}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <UserCircle size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Profile</Text>
                <ChevronRight size={20} color={COLORS.text.light} style={styles.chevron} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleSettingsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <Settings size={24} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Settings</Text>
                <ChevronRight size={20} color={COLORS.text.light} style={styles.chevron} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <LogOut size={24} color="#ff3b30" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  overlayPressable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: COLORS.dark,
    borderRightWidth: 1,
    borderRightColor: COLORS.primary,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userInfo: {
    marginTop: 8,
  },
  name: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    marginBottom: 4,
  },
  email: {
    color: COLORS.text.light,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#ff3b30',
  },
  chevron: {
    marginLeft: 'auto',
  },
});