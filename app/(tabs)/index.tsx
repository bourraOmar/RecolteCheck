import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { subscribeParcelles, Parcelle } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';

export default function ParcellesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeParcelles(user.uid, (items) => {
      setParcelles(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const renderParcelle = ({ item }: { item: Parcelle }) => (
    <TouchableOpacity
      style={styles.parcelCard}
      onPress={() => router.push(`/parcelle/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={globalStyles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={styles.parcelName}>{item.nom}</Text>
          {item.location ? (
            <Text style={styles.parcelLocation}>📍 {item.location}</Text>
          ) : null}
        </View>
        <View style={styles.surfaceBadge}>
          <Text style={styles.surfaceValue}>{item.surface}</Text>
          <Text style={styles.surfaceUnit}>ha</Text>
        </View>
      </View>

      {/* Cultures chips */}
      {item.cultures && item.cultures.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.md }}>
          {item.cultures.map((c, i) => (
            <View key={i} style={globalStyles.chip}>
              <Text style={globalStyles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Bottom row */}
      {item.periodeRecolte ? (
        <View style={styles.periodRow}>
          <Text style={styles.periodText}>📅 {item.periodeRecolte}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={parcelles}
        keyExtractor={(item) => item.id!}
        renderItem={renderParcelle}
        contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          parcelles.length > 0 ? (
            <Text style={styles.listCount}>
              {parcelles.length} parcel{parcelles.length !== 1 ? 's' : ''}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={globalStyles.emptyContainer}>
            <Text style={globalStyles.emptyIcon}>🌱</Text>
            <Text style={globalStyles.emptyTitle}>No parcels yet</Text>
            <Text style={globalStyles.emptySubtitle}>
              Tap the + button below to add your first parcel
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={globalStyles.fab}
        onPress={() => router.push('/parcelle/add' as any)}
        activeOpacity={0.8}
      >
        <Text style={{ color: COLORS.white, fontSize: 28, lineHeight: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listCount: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  parcelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  parcelName: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  parcelLocation: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  surfaceBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  surfaceValue: {
    fontSize: FONT.xl,
    fontWeight: '800',
    color: COLORS.primaryDark,
    lineHeight: 24,
  },
  surfaceUnit: {
    fontSize: FONT.xs,
    fontWeight: '600',
    color: COLORS.primaryDark,
    opacity: 0.7,
  },
  periodRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderLight,
  },
  periodText: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
  },
});
