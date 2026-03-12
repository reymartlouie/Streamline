import React from 'react';
import { View, StyleSheet } from 'react-native';

// Bolt/lightning shape using pure RN views
export default function StreamlineLogo({ size = 100 }: { size?: number }) {
  const s = size / 100;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Top-right triangle */}
      <View
        style={{
          position: 'absolute',
          top: 4 * s,
          left: 28 * s,
          width: 0,
          height: 0,
          borderLeftWidth: 22 * s,
          borderRightWidth: 22 * s,
          borderBottomWidth: 36 * s,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#5B5BD6',
        }}
      />
      {/* Middle bar */}
      <View
        style={{
          position: 'absolute',
          top: 36 * s,
          left: 12 * s,
          width: 76 * s,
          height: 26 * s,
          backgroundColor: '#5B5BD6',
          borderRadius: 2 * s,
        }}
      />
      {/* Bottom-left triangle */}
      <View
        style={{
          position: 'absolute',
          top: 58 * s,
          left: 28 * s,
          width: 0,
          height: 0,
          borderLeftWidth: 22 * s,
          borderRightWidth: 22 * s,
          borderTopWidth: 36 * s,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#4a4ac4',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});