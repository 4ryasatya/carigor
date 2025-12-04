import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="home" color={color} />,
        }}
      />

      {/* <Tabs.Screen
        name="mhs"
        options={{
          title: 'Mahasiswa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.pin" color={color} />,
        }}
      /> */}

      <Tabs.Screen
        name="lokasi"
        options={{
          title: 'GOR',
          tabBarIcon: ({ color }) => <IconSymbol
            size={28}
            name="list"
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="mapwebview"
        options={{
          title: 'Peta',
          tabBarIcon: ({ color }) => <IconSymbol
            size={28}
            name="map"
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.pin" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="gmap"
        options={{
          title: 'Gmap API',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gmap.fill" color={color} />,
        }}
      /> */}
    </Tabs>
  );
}
