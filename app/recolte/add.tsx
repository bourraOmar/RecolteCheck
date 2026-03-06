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
import { addRecolte } from '@/services/firestoreService';
import { Timestamp } from 'firebase/firestore';
import { globalStyles, COLORS, SPACING } from '@/constants/styles';

export default function AddRecolteScreen() {
  const { parcelleId, zoneId } = useLocalSearchParams<{
    parcelleId: string;
    zoneId: string;
  }>();
  const { user } = useAuth();
  const router = useRouter();
  const [culture, setCulture] = useState('');
  const [poids, setPoids] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!user || !parcelleId || !zoneId) return;
    if (!culture.trim()) {
      setError('Please enter the crop type');
      return;
    }
    if (!poids.trim() || isNaN(Number(poids))) {
      setError('Please enter a valid weight');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await addRecolte(user.uid, parcelleId, zoneId, {
        culture: culture.trim(),
        poids: Number(poids),
        date: Timestamp.now(),
        notes: notes.trim(),
      });
      router.back();
    } catch {
      setError('Failed to record harvest. Please try again.');
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

      <Text style={globalStyles.label}>CROP TYPE *</Text>
      <TextInput
        style={globalStyles.input}
        value={culture}
        onChangeText={setCulture}
        placeholder="e.g. Tomatoes"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>WEIGHT (KG) *</Text>
      <TextInput
        style={globalStyles.input}
        value={poids}
        onChangeText={setPoids}
        placeholder="e.g. 500"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="decimal-pad"
      />

      <Text style={globalStyles.label}>NOTES</Text>
      <TextInput
        style={[globalStyles.input, { height: 100, textAlignVertical: 'top', paddingTop: SPACING.md }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Additional notes about this harvest..."
        placeholderTextColor={COLORS.textMuted}
        multiline
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
          <Text style={globalStyles.buttonText}>Record Harvest</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
