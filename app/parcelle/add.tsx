import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { addParcelle } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING } from '@/constants/styles';

export default function AddParcelleScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [surface, setSurface] = useState('');
  const [location, setLocation] = useState('');
  const [cultures, setCultures] = useState('');
  const [periodeRecolte, setPeriodeRecolte] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!user) return;
    if (!nom.trim()) {
      setError('Please enter a parcel name');
      return;
    }
    if (!surface.trim() || isNaN(Number(surface))) {
      setError('Please enter a valid surface area');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const culturesList = cultures
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      await addParcelle(user.uid, {
        nom: nom.trim(),
        surface: Number(surface),
        location: location.trim(),
        cultures: culturesList,
        periodeRecolte: periodeRecolte.trim(),
      });
      router.back();
    } catch {
      setError('Failed to add parcel. Please try again.');
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

      <Text style={globalStyles.label}>PARCEL NAME *</Text>
      <TextInput
        style={globalStyles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="e.g. North Field"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>SURFACE AREA (HECTARES) *</Text>
      <TextInput
        style={globalStyles.input}
        value={surface}
        onChangeText={setSurface}
        placeholder="e.g. 5.5"
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
        placeholder="e.g. Tomatoes, Potatoes, Wheat"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={globalStyles.label}>HARVEST PERIOD</Text>
      <TextInput
        style={globalStyles.input}
        value={periodeRecolte}
        onChangeText={setPeriodeRecolte}
        placeholder="e.g. June - August"
        placeholderTextColor={COLORS.textMuted}
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
          <Text style={globalStyles.buttonText}>Add Parcel</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
