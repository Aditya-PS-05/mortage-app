import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { View, StyleSheet } from 'react-native';

export function CustomTabButton(props: BottomTabBarButtonProps) {
  const isActive = props.accessibilityState?.selected;

  return (
    <PlatformPressable
      {...props}
      style={({ pressed }) => [
        styles.tabButton,
        isActive && styles.activeTabButton,
        pressed && styles.pressedTabButton
      ]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: '#E8F5E8',
  },
  pressedTabButton: {
    backgroundColor: '#F0F0F0',
  },
});