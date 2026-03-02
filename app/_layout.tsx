import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/styles';

const HEADER_OPTS = {
  headerTitleAlign: 'center' as const,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: COLORS.background },
  headerTintColor: COLORS.primary,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
  headerBackVisible: false,
};

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
    </TouchableOpacity>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={HEADER_OPTS}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="parcelle/add" options={{ title: 'New Parcel', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="parcelle/[id]" options={{ title: 'Parcel Details', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="parcelle/edit/[id]" options={{ title: 'Edit Parcel', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="zone/add" options={{ title: 'New Zone', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="zone/[id]" options={{ title: 'Zone Details', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="recolte/add" options={{ title: 'Record Harvest', headerLeft: () => <BackButton /> }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
