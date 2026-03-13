import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 64) / 3;

const GENRES = ['All', 'Podcasts', 'Workout', 'Chill', 'Hip-Hop', 'R&B'];

const TRENDING = [
  { id: '1', title: 'Teenage Dirtbag', artist: 'Wheatus', colors: ['#c8a84a', '#6a5010'] as [string, string] },
  { id: '2', title: 'Starboy', artist: 'The Weeknd', colors: ['#6b1a1a', '#2a0808'] as [string, string] },
  { id: '3', title: 'Kiss It Better', artist: 'Rihanna', colors: ['#8B2020', '#3a0808'] as [string, string] },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', colors: ['#1a1a6b', '#0a0a2a'] as [string, string] },
  { id: '5', title: 'Levitating', artist: 'Dua Lipa', colors: ['#6b2a8B', '#2a0a3a'] as [string, string] },
  { id: '6', title: 'Stay', artist: 'Kid LAROI', colors: ['#1a5a2a', '#0a2a0a'] as [string, string] },
];

export default function HomeScreen({ navigation }: any) {
  const { colors, mode, toggle } = useTheme();
  const [activeGenre, setActiveGenre] = useState('All');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <StreamlineLogo size={36} />
            <View style={styles.headerRight}>
              {/* Theme toggle */}
              <TouchableOpacity
                onPress={toggle}
                style={[styles.themeBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 15 }}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>

              {/* Avatar */}
              <TouchableOpacity style={styles.avatar}>
                <LinearGradient colors={[colors.accent, colors.accentDark]} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>R</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Songs */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Songs</Text>
          <View style={[styles.featuredCard, { backgroundColor: colors.bgElevated, borderColor: colors.accentBorder }]}>
            <View style={styles.featuredContent}>
              <LinearGradient colors={[colors.accent, colors.accentDark]} style={styles.featuredThumb} />
              <View style={styles.featuredInfo}>
                <Text style={[styles.featuredNumber, { color: colors.textMuted }]}>10</Text>
                <Text style={[styles.featuredDesc, { color: colors.textSecondary }]} numberOfLines={4}>
                  Lorem ipsum dolor sit amet consectetur. Dui in viverra orci neque ac libero sed. Aliquam donec lorem duis velit donec vitae a.
                </Text>
                <Text style={[styles.featuredTitle, { color: colors.text }]}>Meowi</Text>
              </View>
            </View>
            <View style={styles.dotsRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent, width: 18 }]} />
              <View style={[styles.dot, { backgroundColor: colors.border }]} />
              <View style={[styles.dot, { backgroundColor: colors.border }]} />
            </View>
          </View>

          {/* Genre chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreRow}>
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setActiveGenre(g)}
                style={[
                  styles.genreChip,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                  activeGenre === g && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genreText,
                  { color: colors.textSecondary },
                  activeGenre === g && { color: '#fff', fontWeight: '700' },
                ]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Trending */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Songs</Text>
          <View style={styles.trendingGrid}>
            {TRENDING.map((song) => (
              <TouchableOpacity key={song.id} style={styles.trendingItem} activeOpacity={0.8}>
                <LinearGradient colors={song.colors} style={styles.trendingThumb} />
                <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
                <View style={styles.trendingArtistRow}>
                  <Text style={styles.explicit}>E</Text>
                  <Text style={[styles.trendingArtist, { color: colors.textSecondary }]} numberOfLines={1}>{song.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>
      </Animated.View>

      {/* Mini Player + Tab Bar */}
      <View style={styles.bottomWrapper}>
        <TouchableOpacity activeOpacity={0.9} style={[styles.miniPlayer, { backgroundColor: colors.bgElevated, borderColor: colors.accentBorder }]}>
          <LinearGradient colors={[colors.accent, colors.accentDark]} style={styles.miniThumb} />
          <View style={styles.miniInfo}>
            <Text style={[styles.miniTitle, { color: colors.text }]}>Teenage Dirtbag</Text>
            <View style={styles.miniArtistRow}>
              <Text style={styles.explicit}>E</Text>
              <Text style={[styles.miniArtist, { color: colors.textSecondary }]}>Wheatus</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={[styles.tabBar, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>
          {[
            { label: 'Home', icon: '⌂', active: true },
            { label: 'Community', icon: '⚇', active: false },
            { label: 'Explore', icon: '◎', active: false },
            { label: 'Library', icon: '▤', active: false },
          ].map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7}>
              <Text style={[styles.tabIcon, { color: tab.active ? colors.accent : colors.textMuted }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color: tab.active ? colors.accent : colors.textMuted, fontWeight: tab.active ? '700' : '500' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 56, paddingHorizontal: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatarGradient: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 14 },

  featuredCard: { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1 },
  featuredContent: { flexDirection: 'row', gap: 14 },
  featuredThumb: { width: 80, height: 100, borderRadius: 10 },
  featuredInfo: { flex: 1 },
  featuredNumber: { fontSize: 13, textAlign: 'right', marginBottom: 6 },
  featuredDesc: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
  featuredTitle: { fontSize: 15, fontWeight: '600' },
  dotsRow: { flexDirection: 'row', gap: 5, marginTop: 14, alignSelf: 'center' },
  dot: { height: 6, borderRadius: 3 },

  genreRow: { gap: 8, paddingBottom: 4, marginBottom: 24 },
  genreChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  genreText: { fontSize: 13, fontWeight: '500' },

  trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  trendingItem: { width: ITEM_SIZE },
  trendingThumb: { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 10 },
  trendingTitle: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  trendingArtistRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  explicit: {
    fontSize: 9, color: '#fff',
    backgroundColor: 'rgba(128,128,128,0.5)',
    paddingHorizontal: 3, paddingVertical: 1,
    borderRadius: 2, fontWeight: '700',
  },
  trendingArtist: { fontSize: 11, flex: 1 },

  bottomWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  miniPlayer: {
    marginHorizontal: 12, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 12,
    borderWidth: 1,
  },
  miniThumb: { width: 44, height: 44, borderRadius: 8 },
  miniInfo: { flex: 1 },
  miniTitle: { fontSize: 13, fontWeight: '600' },
  miniArtistRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  miniArtist: { fontSize: 11 },
  playBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: '#fff', fontSize: 12, marginLeft: 2 },

  tabBar: { flexDirection: 'row', paddingBottom: 24, paddingTop: 10, borderTopWidth: 1 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 10 },
});