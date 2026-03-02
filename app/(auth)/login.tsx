import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      if (e.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Incorrect password');
      } else if (e.code === 'auth/user-not-found') {
        setError('Account not found');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: SPACING.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={{ alignItems: 'center', marginBottom: 56 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 24,
            backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
            marginBottom: SPACING.lg,
          }}>
            <Text style={{ fontSize: 44 }}>🌾</Text>
          </View>
          <Text style={{ fontSize: FONT.hero, fontWeight: '800', color: COLORS.text, letterSpacing: -1.5 }}>
            RecolteCheck
          </Text>
          <Text style={{ fontSize: FONT.body, color: COLORS.textMuted, marginTop: SPACING.sm }}>
            Track your harvests with ease
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={globalStyles.errorBox}>
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Text style={globalStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <Text style={globalStyles.label}>EMAIL</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>PASSWORD</Text>
        <TextInput
          style={globalStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
        />

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: SPACING.sm }, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.buttonOutline, { marginTop: SPACING.md }]}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonOutlineText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
