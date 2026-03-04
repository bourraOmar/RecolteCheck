import React, { useEffect, useState } from 'react';
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
import { parcelleDoc, updateParcelle, Parcelle } from '@/services/firestoreService';
import { getDoc } from 'firebase/firestore';
import { globalStyles, COLORS, SPACING } from '@/constants/styles';

export default function EditParcelleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [surface, setSurface] = useState('');
  const [location, setLocation] = useState('');
  const [cultures, setCultures] = useState('');
  const [periodeRecolte, setPeriodeRecolte] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const snap = await getDoc(parcelleDoc(user.uid, id));
      if (snap.exists()) {
        const data = snap.data() as Parcelle;
        setNom(data.nom);
        setSurface(String(data.surface));
        setLocation(data.location || '');
        setCultures(data.cultures?.join(', ') || '');
        setPeriodeRecolte(data.periodeRecolte || '');
      }
      setLoading(false);
    };
    load();
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !id) return;
    if (!nom.trim()) {
      setError('Please enter a parcel name');
      return;
    }
    if (!surface.trim() || isNaN(Number(surface))) {
      setError('Please enter a valid surface area');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const culturesList = cultures
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      await updateParcelle(user.uid, id, {
        nom: nom.trim(),
        surface: Number(surface),
        location: location.trim(),
        cultures: culturesList,
        periodeRecolte: periodeRecolte.trim(),
      });
      router.back();
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContent}>
      {error ? (
        <View style={globalStyles.errorBox}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
          <Text style={globalStyles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Text style={globalStyles.label}>PARCEL NAME *</Text>
      <TextInput
        style={globalStyles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="Parcel name"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>SURFACE AREA (HECTARES) *</Text>
      <TextInput
        style={globalStyles.input}
        value={surface}
        onChangeText={setSurface}
        placeholder="5.5"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="decimal-pad"
      />

      <Text style={globalStyles.label}>LOCATION</Text>
      <TextInput
        style={globalStyles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Meknes, Morocco"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>CROPS (COMMA-SEPARATED)</Text>
      <TextInput
        style={globalStyles.input}
        value={cultures}
        onChangeText={setCultures}
        placeholder="Tomatoes, Potatoes, Wheat"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>HARVEST PERIOD</Text>
      <TextInput
        style={globalStyles.input}
        value={periodeRecolte}
        onChangeText={setPeriodeRecolte}
        placeholder="June - August"
        placeholderTextColor={COLORS.textMuted}
      />

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: SPACING.sm }, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={globalStyles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
