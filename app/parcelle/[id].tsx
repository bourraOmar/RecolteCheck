import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Parcelle,
  Zone,
  parcelleDoc,
  subscribeZones,
  deleteParcelle,
} from '@/services/firestoreService';
import { onSnapshot } from 'firebase/firestore';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';

export default function ParcelleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [parcelle, setParcelle] = useState<Parcelle | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    const unsubParcelle = onSnapshot(parcelleDoc(user.uid, id), (snap) => {
      if (snap.exists()) {
        setParcelle({ id: snap.id, ...snap.data() } as Parcelle);
      }
    });

    const unsubZones = subscribeZones(user.uid, id, (items) => {
      setZones(items);
      setLoading(false);
    });

    return () => {
      unsubParcelle();
      unsubZones();
    };
  }, [user, id]);

  const handleDelete = () => {
    Alert.alert('Delete Parcel', 'Are you sure you want to delete this parcel?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user || !id) return;
          await deleteParcelle(user.uid, id);
          router.back();
        },
      },
    ]);
  };

  if (loading || !parcelle) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderZone = ({ item }: { item: Zone }) => (
    <TouchableOpacity
      style={styles.zoneCard}
      onPress={() => router.push(`/zone/${item.id}?parcelleId=${id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.zoneIcon}>
        <Text style={{ fontSize: 20 }}>📍</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.zoneName}>{item.nom}</Text>
        <Text style={styles.zoneSurface}>{item.surface} ha</Text>
      </View>
      <Text style={{ fontSize: FONT.body, color: COLORS.textTertiary }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Hero header */}
      <View style={styles.heroSection}>
        <Text style={globalStyles.heroTitle}>{parcelle.nom}</Text>

        {parcelle.location ? (
          <Text style={styles.locationText}>📍 {parcelle.location}</Text>
        ) : null}

        {/* Stat pills */}
        <View style={[globalStyles.row, globalStyles.gap12, { marginTop: SPACING.xl }]}>
          <View style={[styles.statPill, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.statPillValue}>{parcelle.surface}</Text>
            <Text style={styles.statPillLabel}>Hectares</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#007AFF' }]}>
            <Text style={styles.statPillValue}>{zones.length}</Text>
            <Text style={styles.statPillLabel}>Zones</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#FF9500' }]}>
            <Text style={styles.statPillValue}>{parcelle.cultures?.length || 0}</Text>
            <Text style={styles.statPillLabel}>Crops</Text>
          </View>
        </View>

        {/* Harvest period */}
        {parcelle.periodeRecolte ? (
          <Text style={styles.periodText}>
            📅 Harvest: {parcelle.periodeRecolte}
          </Text>
        ) : null}

        {/* Crops chips */}
        {parcelle.cultures && parcelle.cultures.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.lg }}>
            {parcelle.cultures.map((c, i) => (
              <View key={i} style={globalStyles.chip}>
                <Text style={globalStyles.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={[globalStyles.row, globalStyles.gap12, { marginTop: SPACING.xl }]}>
          <TouchableOpacity
            style={[globalStyles.buttonOutline, { flex: 1 }]}
            onPress={() => router.push(`/parcelle/edit/${id}` as any)}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.buttonOutlineText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.buttonDanger, { flex: 1 }]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.buttonText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Zones section */}
      <View style={styles.zonesHeader}>
        <Text style={globalStyles.sectionTitle}>Zones</Text>
        <Text style={{ fontSize: FONT.sm, color: COLORS.textMuted }}>
          {zones.length} zone{zones.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={zones}
        keyExtractor={(item) => item.id!}
        renderItem={renderZone}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={globalStyles.emptyContainer}>
            <Text style={globalStyles.emptyIcon}>📍</Text>
            <Text style={globalStyles.emptyTitle}>No zones yet</Text>
            <Text style={globalStyles.emptySubtitle}>
              Add zones to organize different areas of this parcel
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={globalStyles.fab}
        onPress={() => router.push(`/zone/add?parcelleId=${id}` as any)}
        activeOpacity={0.8}
      >
        <Text style={{ color: COLORS.white, fontSize: 28, lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 4 },
    }),
  },
  locationText: {
    fontSize: FONT.md,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  periodText: {
    fontSize: FONT.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
  statPill: {
    flex: 1,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  statPillValue: {
    fontSize: FONT.xxl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  statPillLabel: {
    fontSize: FONT.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  zonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: 0,
  },
  zoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  zoneIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneName: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  zoneSurface: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
