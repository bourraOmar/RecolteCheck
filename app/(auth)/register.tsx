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
import { saveUserProfile } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING, FONT } from '@/constants/styles';

export default function RegisterScreen() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const cred = await register(email.trim(), password);
      await saveUserProfile(cred.user.uid, {
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        createdAt: null,
      });
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Registration failed. Please try again.');
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
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ fontSize: FONT.xxl, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 }}>
            Create Account
          </Text>
          <Text style={{ fontSize: FONT.md, color: COLORS.textSecondary, marginTop: SPACING.xs }}>
            Start tracking your farm today
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
        <Text style={globalStyles.label}>LAST NAME *</Text>
        <TextInput
          style={globalStyles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Doe"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={globalStyles.label}>FIRST NAME *</Text>
        <TextInput
          style={globalStyles.input}
          value={prenom}
          onChangeText={setPrenom}
          placeholder="John"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={globalStyles.label}>PHONE NUMBER</Text>
        <TextInput
          style={globalStyles.input}
          value={telephone}
          onChangeText={setTelephone}
          placeholder="+1 (555) 000-0000"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
        />

        <Text style={globalStyles.label}>EMAIL *</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>PASSWORD *</Text>
        <TextInput
          style={globalStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
        />

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: SPACING.sm }, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.buttonGhost, { marginTop: SPACING.md }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonGhostText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
