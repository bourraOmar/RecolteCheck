import { StyleSheet, Platform } from 'react-native';

/* ─────────────────────────────────────────────
 *  iOS / Apple Music inspired design system
 * ───────────────────────────────────────────── */

export const COLORS = {
  // Primary — vibrant green
  primary: '#34C759',
  primaryDark: '#248A3D',
  primaryLight: '#D1FAE5',
  primaryMuted: '#A7F3D0',

  // Accent — warm coral for highlights
  accent: '#FF6B6B',
  accentLight: '#FFE0E0',

  // Neutrals — iOS system grays
  white: '#FFFFFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F2F7',
  surfaceSecondary: '#EFEFF4',
  text: '#000000',
  textSecondary: '#3C3C43',
  textMuted: '#8E8E93',
  textTertiary: '#AEAEB2',
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  separator: '#C6C6C8',

  // Semantic
  danger: '#FF3B30',
  dangerLight: '#FFE5E5',
  warning: '#FF9500',
  warningLight: '#FFF4E0',
  info: '#007AFF',
  infoLight: '#E0F0FF',
  success: '#34C759',

  // Overlay
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.4)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FONT = {
  xs: 11,
  sm: 13,
  md: 15,
  body: 17,
  lg: 17,
  xl: 20,
  xxl: 28,
  xxxl: 34,
  hero: 40,
};

export const globalStyles = StyleSheet.create({
  /* ── Layout ── */
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 48,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  /* ── Cards — iOS grouped style ── */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* ── Typography — SF-style hierarchy ── */
  heroTitle: {
    fontSize: FONT.hero,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  screenTitle: {
    fontSize: FONT.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: FONT.sm,
    fontWeight: '500',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: FONT.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  caption: {
    fontSize: FONT.xs,
    color: COLORS.textMuted,
  },

  /* ── Form inputs — iOS grouped ── */
  input: {
    borderWidth: 0,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: FONT.body,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    color: COLORS.text,
  },
  inputFocused: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  /* ── Buttons — pill style ── */
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhost: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhostText: {
    color: COLORS.primary,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  buttonSm: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },

  /* ── Row / Layout ── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gap8: { gap: 8 },
  gap12: { gap: 12 },
  gap16: { gap: 16 },

  /* ── Chips / Tags ── */
  chip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chipText: {
    color: COLORS.primaryDark,
    fontSize: FONT.xs,
    fontWeight: '600',
  },

  /* ── Badge ── */
  badge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },

  /* ── Empty state ── */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 72,
    paddingHorizontal: SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  /* ── FAB — iOS floating pill ── */
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  /* ── Error ── */
  errorBox: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT.md,
    flex: 1,
    fontWeight: '500',
  },

  /* ── Success ── */
  successBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  successText: {
    color: COLORS.primaryDark,
    fontSize: FONT.md,
    flex: 1,
    fontWeight: '500',
  },

  /* ── Divider ── */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.separator,
    marginVertical: SPACING.xl,
  },

  /* ── Stat card — glassmorphic feel ── */
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statValue: {
    fontSize: FONT.xxl,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: FONT.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
