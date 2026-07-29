import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

// Adjust for Android emulator networking if necessary
const API_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/timesheet' : 'http://localhost:3000/api/timesheet';
// "http://qa.evosphere.nt.core/api/timesheet"

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get access token
      const authResponse = await fetch(`${API_BASE}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!authResponse.ok) {
        throw new Error('Invalid username or password');
      }

      const authData = await authResponse.json();
      const token = authData.access_token;

      if (!token) {
        throw new Error('No access token received');
      }

      // 2. Fetch current user details
      const userResponse = await fetch(`${API_BASE}/auth/current-user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await userResponse.json();

      // 3. Save to global store and redirect
      await loginAction(token, userData);
      router.replace('/');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Authentication Failed', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.inner, { paddingTop: insets.top + Spacing.six, paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/evosphere-logo.png')} style={styles.logoImage} contentFit='contain' />
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to access your dashboard</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Username</ThemedText>
            <View style={styles.inputContainer}>
              <SymbolView name="person" size={20} tintColor="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#C7C7CC"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputContainer}>
              <SymbolView name="lock" size={20} tintColor="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#C7C7CC"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <SymbolView name={showPassword ? 'eye.slash' : 'eye'} size={20} tintColor="#8E8E93" />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.six,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  form: {
    gap: Spacing.four,
  },
  inputGroup: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: Spacing.three,
    height: 56,
    paddingHorizontal: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    height: '100%',
  },
  eyeButton: {
    padding: Spacing.two,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: Spacing.four,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1EBD60',
  },
  loginButton: {
    backgroundColor: '#1EBD60',
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1EBD60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  logoImage: {
    width: 300,
    height: 100,
  },
});
