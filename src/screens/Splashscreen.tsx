import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(40)).current;
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0.4)).current;
  const ring2Opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // Pulsing rings
    const pulseRings = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ring1Scale, { toValue: 1.4, duration: 2000, useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(ring1Scale, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(ring2Scale, { toValue: 1.6, duration: 2000, useNativeDriver: true }),
              Animated.timing(ring2Opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(ring2Scale, { toValue: 0, duration: 0, useNativeDriver: true }),
              Animated.timing(ring2Opacity, { toValue: 0.2, duration: 0, useNativeDriver: true }),
            ]),
          ])
        ).start();
      }, 700);
    };

    // Entrance sequence
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(buttonY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    pulseRings();
  }, []);

  return (
    <LinearGradient
      colors={['#0a0a0f', '#0d0d1a', '#0a0a0f']}
      style={styles.container}
    >
      {/* Background grid lines */}
      <View style={styles.gridContainer} pointerEvents="none">
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: (height / 8) * i }]} />
        ))}
      </View>

      {/* Center glow */}
      <View style={styles.glowContainer} pointerEvents="none">
        <View style={styles.glow} />
      </View>

      {/* Pulse rings */}
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]}
      />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Text style={styles.logoSymbol}>◈</Text>
          </View>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
        <Text style={styles.title}>STREAMLINE</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineOpacity, marginTop: 10 }}>
        <Text style={styles.tagline}>The bridge between artists and community</Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity, transform: [{ translateY: buttonY }] }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#5B5BD6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms</Text> &{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(91, 91, 214, 0.08)',
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: '#5B5BD6',
    alignSelf: 'center',
    top: height / 2 - 90,
  },
  ring2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    top: height / 2 - 100,
    borderColor: '#7C3AED',
  },
  logoContainer: {
    marginBottom: 28,
  },
  logoOuter: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(91, 91, 214, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 91, 214, 0.4)',
  },
  logoInner: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: 'rgba(91, 91, 214, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    fontSize: 36,
    color: '#7C7CFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 40,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
  },
  termsLink: {
    color: 'rgba(91, 91, 214, 0.7)',
  },
});