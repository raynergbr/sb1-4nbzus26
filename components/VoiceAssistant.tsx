import React, { useEffect } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

const COLORS = {
  primary: '#40E0D0',
  secondary: '#4B0082',
  dark: '#001F3F',
  white: '#FFFFFF',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
  }
};

interface VoiceAssistantProps {
  onClose?: () => void;
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  if (Platform.OS === 'web') {
    useEffect(() => {
      // Create and append the script tag
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      document.body.appendChild(script);

      // Create and append the widget element
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'STR9r1J0JxGpoEEqPGLJ');
      widget.style.position = 'fixed';
      widget.style.top = '80px';
      widget.style.right = '20px';
      widget.style.zIndex = '1000';
      document.body.appendChild(widget);

      // Cleanup function
      return () => {
        document.body.removeChild(script);
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      };
    }, []);

    return null;
  }

  // Mobile version
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Voice Assistant</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>
          The voice assistant is currently only available on web browsers. Please visit our website to use this feature.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
  },
});