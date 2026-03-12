import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StreamlineLogo from '../components/StreamlineLogo';

export default function LoginScreen({ navigation }: any) {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#18182a', '#111118', '#0c0c14']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideY }] }}>
            {/* Logo + name */}
            <View style={styles.logoRow}>
              <StreamlineLogo size={56} />
              <Text style={styles.appName}>S T R E A M L I N E</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <View style={[styles.inputWrapper, userFocused && styles.inputFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="rgba(255,255,255,0.28)"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setUserFocused(true)}
                  onBlur={() => setUserFocused(false)}
                />
              </View>

              <View style={[styles.inputWrapper, passFocused && styles.inputFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.28)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
              </View>

              <TouchableOpacity style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forget Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signInBtn} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#5B5BD6', '#4a4ac4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signInBtnInner}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.orText}>Or Sign up with</Text>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                  <Text style={[styles.socialIcon, { color: '#4267B2' }]}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                  <Text style={[styles.socialIcon, { color: '#EA4335' }]}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                  <Text style={styles.socialIcon}></Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111118' },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 36,
    gap: 16,
  },
  appName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 7,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputFocused: {
    borderColor: 'rgba(91,91,214,0.5)',
    backgroundColor: 'rgba(91,91,214,0.06)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 14,
  },
  forgotRow: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  signInBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  signInBtnInner: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signInText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  orText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.28)',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  signupLink: {
    fontSize: 13,
    color: '#5B5BD6',
    fontWeight: '600',
  },
});