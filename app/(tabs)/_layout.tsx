import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { COLORS, FONT, SPACING } from '@/constants/styles';
import {
  House,
  GridFour,
  ChartBar,
  UserCircle,
} from 'phosphor-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { fontWeight: '700', fontSize: FONT.xl },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: COLORS.white,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 6,
          ...Platform.select({
            ios: {
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
            },
            android: { elevation: 8 },
          }),
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <House size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plots',
          tabBarIcon: ({ color, focused }) => (
            <GridFour size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <ChartBar size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <UserCircle size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
    </Tabs>
  );
}
