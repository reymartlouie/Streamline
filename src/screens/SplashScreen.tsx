import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StreamlineLogo from '../components/StreamlineLogo';

export default function SplashScreen({ navigation }: any) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 45, friction: 7, useNativeDriver: true }),
      ]),
      Animated.delay(250),
      Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(buttonY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#18182a', '#111118', '#0c0c14']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.center}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            marginBottom: 28,
          }}
        >
          <StreamlineLogo size={140} />
        </Animated.View>

        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          S T R E A M L I N E
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          styles.bottom,
          { opacity: buttonOpacity, transform: [{ translateY: buttonY }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
          style={styles.primaryBtn}
        >
          <LinearGradient
            colors={['#5B5BD6', '#4a4ac4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnInner}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.signupRow}>
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111118' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 8,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 52,
    gap: 14,
  },
  primaryBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryBtnInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  signupRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  signupText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  signupLink: {
    color: '#5B5BD6',
    fontWeight: '600',
  },
});