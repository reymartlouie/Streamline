import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

export default function LoginScreen({ navigation }: any) {
  const { colors, mode, toggle } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 600, useNativeDriver: true }),
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
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideY }] }}>

            {/* Theme toggle */}
            <TouchableOpacity onPress={toggle} style={[styles.themeToggle, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
              <Text style={{ fontSize: 16 }}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
              <Text style={[styles.themeToggleText, { color: colors.textSecondary }]}>
                {mode === 'dark' ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoRow}>
              <StreamlineLogo size={56} />
              <Text style={[styles.appName, { color: colors.text }]}>S T R E A M L I N E</Text>
            </View>

            {/* Card */}
            <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>

              {/* Username */}
              <View style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
                userFocused && { borderColor: colors.accentBorder, backgroundColor: colors.accentMuted },
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

              {/* Password */}
              <View style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
                passFocused && { borderColor: colors.accentBorder, backgroundColor: colors.accentMuted },
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
                <Text style={[styles.forgotText, { color: colors.textMuted }]}>Forget Password?</Text>
              </TouchableOpacity>

              {/* Sign In */}
              <TouchableOpacity
                style={styles.signInBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Home')}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accentDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.signInBtnInner}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={[styles.orText, { color: colors.textMuted }]}>Or Sign up with</Text>

              {/* Social */}
              <View style={styles.socialRow}>
                {[
                  { label: 'f', color: '#4267B2' },
                  { label: 'G', color: '#EA4335' },
                  { label: '', color: colors.text },
                ].map((s, i) => (
                  <TouchableOpacity key={i} style={[styles.socialBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]} activeOpacity={0.7}>
                    <Text style={[styles.socialIcon, { color: s.color }]}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  themeToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, marginBottom: 24,
  },
  themeToggleText: { fontSize: 13, fontWeight: '500' },
  logoRow: { alignItems: 'center', marginBottom: 36, gap: 16 },
  appName: { fontSize: 17, fontWeight: '700', letterSpacing: 7, textAlign: 'center' },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, gap: 12 },
  inputWrapper: { borderRadius: 10, borderWidth: 1 },
  input: { paddingHorizontal: 16, paddingVertical: 14, fontSize: 14 },
  forgotRow: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 12 },
  signInBtn: { borderRadius: 10, overflow: 'hidden' },
  signInBtnInner: { paddingVertical: 15, alignItems: 'center' },
  signInText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
  orText: { textAlign: 'center', fontSize: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  socialBtn: { width: 50, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  socialIcon: { fontSize: 20, fontWeight: '800' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { fontSize: 13 },
  signupLink: { fontSize: 13, fontWeight: '600' },
});