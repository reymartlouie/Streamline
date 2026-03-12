import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerY = useRef(new Animated.Value(40)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(containerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(containerY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(formY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0a0a0f', '#0d0d1a', '#0a0a0f']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back + Logo */}
          <Animated.View style={[styles.header, { opacity: logoOpacity }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.logoSmall}>
              <Text style={styles.logoSymbol}>◈</Text>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View style={[{ opacity: containerOpacity, transform: [{ translateY: containerY }] }]}>
            <Text style={styles.title}>Welcome{'\n'}Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, { opacity: formOpacity, transform: [{ translateY: formY }] }]}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
              <TouchableOpacity style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In */}
            <TouchableOpacity style={styles.signInButton} activeOpacity={0.85}>
              <LinearGradient
                colors={['#5B5BD6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInGradient}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              {['f', 'G', ''].map((label, i) => (
                <TouchableOpacity key={i} style={styles.socialButton} activeOpacity={0.7}>
                  <Text style={styles.socialIcon}>
                    {i === 0 ? '𝐟' : i === 1 ? 'G' : ''}
                  </Text>
                  {i === 2 && <Text style={styles.appleIcon}>􀣺</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {/* Sign Up */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backArrow: {
    color: '#fff',
    fontSize: 18,
  },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 91, 214, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 91, 214, 0.35)',
  },
  logoSymbol: {
    fontSize: 20,
    color: '#7C7CFF',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 50,
    letterSpacing: -1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 36,
    letterSpacing: 0.3,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: 'rgba(91, 91, 214, 0.6)',
    backgroundColor: 'rgba(91, 91, 214, 0.06)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: '#ffffff',
    fontSize: 15,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 12,
    color: 'rgba(91, 91, 214, 0.8)',
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 28,
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.3,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 36,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  appleIcon: {
    color: '#fff',
    fontSize: 22,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
  },
  signUpLink: {
    fontSize: 14,
    color: '#7C7CFF',
    fontWeight: '600',
  },
});