import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#81C784',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 90 : 70,
          elevation: 4,
          shadowColor: '#e0e0e0',
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="house" 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="chart.bar" 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="person.circle" 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name="auth-gate"
        options={{
          title: 'AuthGateScreen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name="security-setup"
        options={{
          title: 'SecuritySetupScreen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name="otp-verification"
        options={{
          title: 'OTPVerificationScreen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mail.fill" color={color} />,
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />
    </Tabs>
  );
}
