import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { addZone } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING } from '@/constants/styles';

export default function AddZoneScreen() {
  const { parcelleId } = useLocalSearchParams<{ parcelleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [surface, setSurface] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!user || !parcelleId) return;
    if (!nom.trim()) {
      setError('Please enter a zone name');
      return;
    }
    if (!surface.trim() || isNaN(Number(surface))) {
      setError('Please enter a valid surface area');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await addZone(user.uid, parcelleId, {
        nom: nom.trim(),
        surface: Number(surface),
      });
      router.back();
    } catch {
      setError('Failed to add zone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContent}>
      {error ? (
        <View style={globalStyles.errorBox}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
          <Text style={globalStyles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Text style={globalStyles.label}>ZONE NAME *</Text>
      <TextInput
        style={globalStyles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="e.g. Zone A"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>SURFACE AREA (HECTARES) *</Text>
      <TextInput
        style={globalStyles.input}
        value={surface}
        onChangeText={setSurface}
        placeholder="e.g. 2.0"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: SPACING.sm }, loading && { opacity: 0.6 }]}
        onPress={handleAdd}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={globalStyles.buttonText}>Add Zone</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
