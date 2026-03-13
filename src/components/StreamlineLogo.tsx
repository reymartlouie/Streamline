import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StreamlineLogo({ size = 100 }: { size?: number }) {
  const { colors } = useTheme();
  const s = size / 100;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View style={{
        position: 'absolute', top: 4 * s, left: 28 * s,
        width: 0, height: 0,
        borderLeftWidth: 22 * s, borderRightWidth: 22 * s, borderBottomWidth: 36 * s,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: colors.accent,
      }} />
      <View style={{
        position: 'absolute', top: 36 * s, left: 12 * s,
        width: 76 * s, height: 26 * s,
        backgroundColor: colors.accent, borderRadius: 2 * s,
      }} />
      <View style={{
        position: 'absolute', top: 58 * s, left: 28 * s,
        width: 0, height: 0,
        borderLeftWidth: 22 * s, borderRightWidth: 22 * s, borderTopWidth: 36 * s,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: colors.accentDark,
      }} />
    </View>
  );
}