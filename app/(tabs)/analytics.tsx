import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { subscribeParcelles, Parcelle } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';
import {
  ChartBar,
  TrendUp,
  Plant,
  MapPin,
  Leaf,
} from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width - SPACING.xl * 2 - 100;

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeParcelles(user.uid, (items) => {
      setParcelles(items);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const totalSurface = parcelles.reduce((s, p) => s + (p.surface || 0), 0);
  const allCrops = [...new Set(parcelles.flatMap((p) => p.cultures || []))];
  const maxSurface = Math.max(...parcelles.map((p) => p.surface || 0), 1);

  // Count crops across parcels
  const cropCount: Record<string, number> = {};
  parcelles.forEach((p) => {
    (p.cultures || []).forEach((c) => {
      cropCount[c] = (cropCount[c] || 0) + 1;
    });
  });
  const sortedCrops = Object.entries(cropCount).sort((a, b) => b[1] - a[1]);
  const maxCropCount = Math.max(...Object.values(cropCount), 1);

  if (loading) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary cards */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: COLORS.primary }]}>
          <Plant size={24} color={COLORS.white} weight="fill" />
          <Text style={s.summaryValue}>{parcelles.length}</Text>
          <Text style={s.summaryLabel}>Total Plots</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: '#007AFF' }]}>
          <MapPin size={24} color={COLORS.white} weight="fill" />
          <Text style={s.summaryValue}>{totalSurface.toFixed(1)}</Text>
          <Text style={s.summaryLabel}>Hectares</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: '#FF9500' }]}>
          <Leaf size={24} color={COLORS.white} weight="fill" />
          <Text style={s.summaryValue}>{allCrops.length}</Text>
          <Text style={s.summaryLabel}>Crop Types</Text>
        </View>
      </View>

      {/* Plot sizes bar chart */}
      <View style={s.chartCard}>
        <View style={s.chartHeader}>
          <ChartBar size={20} color={COLORS.primary} weight="fill" />
          <Text style={s.chartTitle}>Plot Sizes (ha)</Text>
        </View>
        {parcelles.length === 0 ? (
          <Text style={s.emptyText}>No data yet</Text>
        ) : (
          parcelles.map((p) => (
            <View key={p.id} style={s.barRow}>
              <Text style={s.barLabel} numberOfLines={1}>
                {p.nom}
              </Text>
              <View style={s.barTrack}>
                <View
                  style={[
                    s.barFill,
                    { width: `${((p.surface || 0) / maxSurface) * 100}%` },
                  ]}
                />
              </View>
              <Text style={s.barValue}>{p.surface}</Text>
            </View>
          ))
        )}
      </View>

      {/* Crop distribution */}
      {sortedCrops.length > 0 && (
        <View style={s.chartCard}>
          <View style={s.chartHeader}>
            <TrendUp size={20} color={COLORS.primary} weight="fill" />
            <Text style={s.chartTitle}>Crop Distribution</Text>
          </View>
          {sortedCrops.map(([crop, count]) => (
            <View key={crop} style={s.barRow}>
              <Text style={s.barLabel} numberOfLines={1}>
                {crop}
              </Text>
              <View style={s.barTrack}>
                <View
                  style={[
                    s.barFill,
                    {
                      width: `${(count / maxCropCount) * 100}%`,
                      backgroundColor: '#007AFF',
                    },
                  ]}
                />
              </View>
              <Text style={s.barValue}>
                {count} plot{count !== 1 ? 's' : ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.xxl,
  },
  summaryCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  summaryValue: {
    fontSize: FONT.xxl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: FONT.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  chartTitle: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  barLabel: {
    width: 80,
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  barValue: {
    width: 48,
    fontSize: FONT.sm,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: FONT.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.xxl,
  },
});
