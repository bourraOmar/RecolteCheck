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
  Zone,
  Recolte,
  zoneDoc,
  subscribeRecoltes,
  deleteZone,
  deleteRecolte,
} from '@/services/firestoreService';
import { onSnapshot } from 'firebase/firestore';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';

export default function ZoneDetailsScreen() {
  const { id, parcelleId } = useLocalSearchParams<{ id: string; parcelleId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [zone, setZone] = useState<Zone | null>(null);
  const [recoltes, setRecoltes] = useState<Recolte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id || !parcelleId) return;

    const unsubZone = onSnapshot(zoneDoc(user.uid, parcelleId, id), (snap) => {
      if (snap.exists()) {
        setZone({ id: snap.id, ...snap.data() } as Zone);
      }
    });

    const unsubRecoltes = subscribeRecoltes(user.uid, parcelleId, id, (items) => {
      setRecoltes(items);
      setLoading(false);
    });

    return () => {
      unsubZone();
      unsubRecoltes();
    };
  }, [user, id, parcelleId]);

  const handleDeleteZone = () => {
    Alert.alert('Delete Zone', 'Are you sure you want to delete this zone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user || !id || !parcelleId) return;
          await deleteZone(user.uid, parcelleId, id);
          router.back();
        },
      },
    ]);
  };

  const handleDeleteRecolte = (recolteId: string) => {
    Alert.alert('Delete Harvest', 'Are you sure you want to delete this harvest record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user || !id || !parcelleId) return;
          await deleteRecolte(user.uid, parcelleId, id, recolteId);
        },
      },
    ]);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading || !zone) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const totalPoids = recoltes.reduce((sum, r) => sum + (r.poids || 0), 0);

  const renderRecolte = ({ item }: { item: Recolte }) => (
    <View style={styles.harvestCard}>
      <View style={globalStyles.rowBetween}>
        <View style={globalStyles.row}>
          <View style={styles.harvestIcon}>
            <Text style={{ fontSize: 18 }}>🌾</Text>
          </View>
          <View style={{ marginLeft: SPACING.md }}>
            <Text style={styles.harvestCrop}>{item.culture}</Text>
            <Text style={styles.harvestDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.harvestWeight}>{item.poids} kg</Text>
          <TouchableOpacity onPress={() => handleDeleteRecolte(item.id!)} activeOpacity={0.7}>
            <Text style={{ color: COLORS.danger, fontSize: FONT.xs, fontWeight: '600', marginTop: 4 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.notes ? (
        <Text style={styles.harvestNotes}>{item.notes}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Hero header */}
      <View style={styles.heroSection}>
        <Text style={globalStyles.heroTitle}>{zone.nom}</Text>

        {/* Stat pills */}
        <View style={[globalStyles.row, globalStyles.gap12, { marginTop: SPACING.xl }]}>
          <View style={[styles.statPill, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.statPillValue}>{zone.surface}</Text>
            <Text style={styles.statPillLabel}>Hectares</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#007AFF' }]}>
            <Text style={styles.statPillValue}>{recoltes.length}</Text>
            <Text style={styles.statPillLabel}>Harvests</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#FF9500' }]}>
            <Text style={styles.statPillValue}>{totalPoids}</Text>
            <Text style={styles.statPillLabel}>Total kg</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.deleteBtn, { marginTop: SPACING.xl }]}
          onPress={handleDeleteZone}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteBtnText}>🗑 Delete Zone</Text>
        </TouchableOpacity>
      </View>

      {/* Harvests */}
      <View style={styles.harvestsHeader}>
        <Text style={globalStyles.sectionTitle}>Harvest History</Text>
        <Text style={{ fontSize: FONT.sm, color: COLORS.textMuted }}>
          {recoltes.length} record{recoltes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={recoltes}
        keyExtractor={(item) => item.id!}
        renderItem={renderRecolte}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={globalStyles.emptyContainer}>
            <Text style={globalStyles.emptyIcon}>🌾</Text>
            <Text style={globalStyles.emptyTitle}>No harvests recorded</Text>
            <Text style={globalStyles.emptySubtitle}>
              Tap the + button to record your first harvest
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={globalStyles.fab}
        onPress={() =>
          router.push(`/recolte/add?parcelleId=${parcelleId}&zoneId=${id}` as any)
        }
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
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  harvestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: 0,
  },
  harvestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
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
  harvestIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  harvestCrop: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  harvestDate: {
    fontSize: FONT.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  harvestWeight: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  harvestNotes: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontSize: FONT.sm,
    lineHeight: 20,
    paddingLeft: 52,
  },
});
