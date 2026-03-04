import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  subscribeParcelles,
  Parcelle,
  getUserProfile,
  UserProfile,
} from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';
import {
  House,
  List,
  Bell,
  Plant,
  ChartBar,
  TrendUp,
  Minus,
  PlusCircle,
  ArrowRight,
} from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - SPACING.xl * 2 - CARD_GAP) / 2;

// Placeholder farm images for plot cards
const PLOT_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1595228610823-17e5fd10ad5b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop',
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((p) => setProfile(p));
    const unsub = subscribeParcelles(user.uid, (items) => {
      setParcelles(items);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const totalSurface = parcelles.reduce((s, p) => s + (p.surface || 0), 0);
  const allCrops = [...new Set(parcelles.flatMap((p) => p.cultures || []))];

  if (loading) {
    return (
      <View style={globalStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header bar ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}>
            <List size={22} color={COLORS.primary} weight="bold" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Farmer Dashboard</Text>
          <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}>
            <Bell size={22} color={COLORS.text} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* ── Stat Cards ── */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>TOTAL{'\n'}PLOTS</Text>
            <Text style={s.statValue}>{parcelles.length}</Text>
            <View style={s.trendRow}>
              <TrendUp size={14} color={COLORS.primary} weight="bold" />
              <Text style={s.trendText}>+{parcelles.length > 0 ? '2' : '0'}%</Text>
            </View>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>ACTIVE{'\n'}CROPS</Text>
            <Text style={s.statValue}>{allCrops.length}</Text>
            <View style={s.trendRow}>
              <Minus size={14} color={COLORS.textMuted} weight="bold" />
              <Text style={[s.trendText, { color: COLORS.textMuted }]}>0%</Text>
            </View>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>RECENT{'\n'}HARVEST</Text>
            <Text style={s.statValue}>
              {totalSurface.toFixed(0)}
              <Text style={s.statUnit}> ha</Text>
            </Text>
            <View style={s.trendRow}>
              <TrendUp size={14} color={COLORS.primary} weight="bold" />
              <Text style={s.trendText}>+15%</Text>
            </View>
          </View>
        </View>

        {/* ── Add New Harvest Button ── */}
        <View style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl }}>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => router.push('/parcelle/add' as any)}
            activeOpacity={0.8}
          >
            <PlusCircle size={24} color={COLORS.white} weight="fill" />
            <Text style={s.addBtnText}>Add New Harvest</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Plots ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Active Plots</Text>
          {parcelles.length > 4 && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/index' as any)}
              activeOpacity={0.7}
            >
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {parcelles.length === 0 ? (
          <View style={[globalStyles.emptyContainer, { paddingVertical: 48 }]}>
            <Plant size={56} color={COLORS.textMuted} weight="light" />
            <Text style={[globalStyles.emptyTitle, { marginTop: SPACING.lg }]}>
              No plots yet
            </Text>
            <Text style={globalStyles.emptySubtitle}>
              Add your first parcel to see it here
            </Text>
            <TouchableOpacity
              style={[globalStyles.button, { marginTop: SPACING.xl }]}
              onPress={() => router.push('/parcelle/add' as any)}
              activeOpacity={0.8}
            >
              <Text style={globalStyles.buttonText}>Add First Plot</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.plotGrid}>
            {parcelles.slice(0, 4).map((p, idx) => (
              <TouchableOpacity
                key={p.id}
                style={s.plotCard}
                onPress={() => router.push(`/parcelle/${p.id}` as any)}
                activeOpacity={0.85}
              >
                <ImageBackground
                  source={{ uri: PLOT_IMAGES[idx % PLOT_IMAGES.length] }}
                  style={s.plotImage}
                  imageStyle={{ borderRadius: RADIUS.lg }}
                >
                  <View style={s.plotOverlay}>
                    <Text style={s.plotName}>{p.nom}</Text>
                    <Text style={s.plotInfo}>
                      {p.cultures?.[0] || 'Mixed'} • {p.surface} ha
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Smart Insights ── */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl }}>
          <TouchableOpacity style={s.insightCard} activeOpacity={0.7}>
            <View style={s.insightIcon}>
              <ChartBar size={22} color={COLORS.primary} weight="fill" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.insightTitle}>Smart Insights</Text>
              <Text style={s.insightSubtitle}>
                {parcelles.length > 0
                  ? `You have ${allCrops.length} crop types across ${parcelles.length} plots`
                  : 'Add plots to get farming insights'}
              </Text>
            </View>
            <ArrowRight size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: SPACING.lg,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  headerTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  /* Stat cards */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: CARD_GAP,
    marginBottom: SPACING.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  statValue: {
    fontSize: FONT.xxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginTop: SPACING.sm,
  },
  statUnit: {
    fontSize: FONT.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  trendText: {
    fontSize: FONT.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },

  /* Add button */
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 18,
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  addBtnText: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.white,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT.xl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  viewAll: {
    fontSize: FONT.md,
    fontWeight: '600',
    color: COLORS.primary,
  },

  /* Plot grid */
  plotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    gap: CARD_GAP,
  },
  plotCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  plotImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  plotOverlay: {
    padding: SPACING.md,
    paddingTop: SPACING.xxxl,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    backgroundColor: 'transparent',
    // gradient-like overlay with a solid dark bottom
    ...Platform.select({
      ios: {},
      android: {},
    }),
  },
  plotName: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  plotInfo: {
    fontSize: FONT.sm,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* Insight card */
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  insightSubtitle: {
    fontSize: FONT.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
