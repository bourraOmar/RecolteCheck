import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, saveUserProfile, UserProfile } from '@/services/firestoreService';
import { globalStyles, COLORS, SPACING, FONT, RADIUS } from '@/constants/styles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    createdAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const data = await getUserProfile(user.uid);
      if (data) {
        setProfile(data);
      } else {
        setProfile((prev) => ({ ...prev, email: user.email || '' }));
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await saveUserProfile(user.uid, {
        nom: profile.nom,
        prenom: profile.prenom,
        telephone: profile.telephone,
        email: profile.email,
      });
      setIsSuccess(true);
      setMessage('Profile saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setIsSuccess(false);
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: () => logout(), style: 'destructive' },
    ]);
  };

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
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Avatar header ── */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={styles.avatarName}>
          {profile.prenom || 'Your'} {profile.nom || 'Name'}
        </Text>
        <Text style={styles.avatarEmail}>{profile.email}</Text>
      </View>

      {/* Messages */}
      {message ? (
        <View style={{ paddingHorizontal: SPACING.xl }}>
          <View style={isSuccess ? globalStyles.successBox : globalStyles.errorBox}>
            <Text style={{ fontSize: 16 }}>{isSuccess ? '✅' : '⚠️'}</Text>
            <Text style={isSuccess ? globalStyles.successText : globalStyles.errorText}>{message}</Text>
          </View>
        </View>
      ) : null}

      {/* ── iOS Grouped form ── */}
      <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.lg }}>
        <Text style={globalStyles.sectionSubtitle}>PERSONAL INFORMATION</Text>
        <View style={styles.groupedCard}>
          <View style={styles.groupRow}>
            <Text style={styles.groupLabel}>Last Name</Text>
            <TextInput
              style={styles.groupInput}
              value={profile.nom}
              onChangeText={(t) => setProfile({ ...profile, nom: t })}
              placeholder="Enter last name"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupRow}>
            <Text style={styles.groupLabel}>First Name</Text>
            <TextInput
              style={styles.groupInput}
              value={profile.prenom}
              onChangeText={(t) => setProfile({ ...profile, prenom: t })}
              placeholder="Enter first name"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupRow}>
            <Text style={styles.groupLabel}>Phone</Text>
            <TextInput
              style={styles.groupInput}
              value={profile.telephone}
              onChangeText={(t) => setProfile({ ...profile, telephone: t })}
              placeholder="+212 600 000000"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.groupRow}>
            <Text style={styles.groupLabel}>Email</Text>
            <Text style={[styles.groupInput, { color: COLORS.textMuted }]}>
              {profile.email}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Save ── */}
      <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl }}>
        <TouchableOpacity
          style={[globalStyles.button, saving && { opacity: 0.6 }]}
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
      </View>

      {/* ── Sign Out ── */}
      <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxxl }}>
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  avatarName: {
    fontSize: FONT.xxl,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  avatarEmail: {
    fontSize: FONT.md,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  groupedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
  },
  groupLabel: {
    width: 90,
    fontSize: FONT.body,
    color: COLORS.text,
    fontWeight: '400',
  },
  groupInput: {
    flex: 1,
    fontSize: FONT.body,
    color: COLORS.text,
    textAlign: 'right',
    padding: 0,
  },
  groupDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.separator,
    marginLeft: SPACING.lg,
  },
  signOutBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  signOutText: {
    color: COLORS.danger,
    fontSize: FONT.body,
    fontWeight: '600',
  },
});
