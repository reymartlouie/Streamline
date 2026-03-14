import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

export default function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.inner, { opacity: fadeIn, transform: [{ translateY: slideY }] }]}>

            {/* Logo */}
            <View style={styles.logoSection}>
              <StreamlineLogo size={96} />
              <Text style={[styles.appName, { color: colors.text }]}>S T R E A M L I N E</Text>
            </View>

            {/* Inputs */}
            <View style={styles.formSection}>
              <View style={[
                styles.inputWrapper,
                { borderColor: colors.borderStrong },
                userFocused && { borderColor: colors.accent },
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Username"
                  placeholderTextColor={colors.placeholder}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setUserFocused(true)}
                  onBlur={() => setUserFocused(false)}
                />
              </View>

              <View style={[
                styles.inputWrapper,
                { borderColor: colors.borderStrong },
                passFocused && { borderColor: colors.accent },
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
              </View>

              <TouchableOpacity style={styles.forgotRow}>
                <Text style={[styles.forgotText, { color: colors.textSecondary }]}>Forget Password?</Text>
              </TouchableOpacity>

              {/* Sign In */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Home')}
                style={styles.signInBtn}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accentDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.signInGradient}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Social */}
              <Text style={[styles.orText, { color: colors.textSecondary }]}>Or Sign up with</Text>
              <View style={styles.socialRow}>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#1877F2' }]} activeOpacity={0.8}>
                  <Text style={styles.socialIcon}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#fff' }]} activeOpacity={0.8}>
                  <Text style={[styles.socialIcon, { color: '#EA4335' }]}>M</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#000' }]} activeOpacity={0.8}>
                  <Text style={[styles.socialIcon, { color: '#fff' }]}></Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up */}
            <View style={styles.signupRow}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={[styles.signupLink, { color: colors.accent }]}>Sign up</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 64, paddingBottom: 40 },
  inner: { flex: 1 },

  logoSection: { alignItems: 'center', marginBottom: 48, gap: 20 },
  appName: { fontSize: 16, fontWeight: '700', letterSpacing: 8 },

  formSection: { gap: 12 },

  inputWrapper: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 20, paddingVertical: 15,
    fontSize: 14,
  },

  forgotRow: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 12 },

  signInBtn: { borderRadius: 28, overflow: 'hidden', marginTop: 4 },
  signInGradient: { paddingVertical: 16, alignItems: 'center' },
  signInText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  orText: { textAlign: 'center', fontSize: 12, marginTop: 8 },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 4 },
  socialBtn: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  socialIcon: { fontSize: 20, fontWeight: '800', color: '#fff' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 36 },
  signupText: { fontSize: 13 },
  signupLink: { fontSize: 13, fontWeight: '600' },
});
