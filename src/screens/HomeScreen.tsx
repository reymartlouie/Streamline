import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar, ImageBackground, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const ITEM_SIZE = (width - 64) / 3;

const RECENT_SONGS = [
  {
    id: '1', title: 'Starboy', artist: 'The Weeknd', plays: '40M plays',
    image: 'https://picsum.photos/seed/starboy/600/300',
  },
  {
    id: '2', title: 'Blinding Lights', artist: 'The Weeknd', plays: '80M plays',
    image: 'https://picsum.photos/seed/blindinglights/600/300',
  },
  {
    id: '3', title: 'Teenage Dirtbag', artist: 'Wheatus', plays: '12M plays',
    image: 'https://picsum.photos/seed/dirtbag/600/300',
  },
];

const FEATURED_ARTISTS = [
  {
    id: '1', name: 'The Weeknd', genre: 'Alternative R&B, pop, and synth-pop',
    bio: 'Canadian singer-songwriter and producer',
    image: 'https://picsum.photos/seed/weekndartist/600/360',
  },
  {
    id: '2', name: 'Rihanna', genre: 'R&B, pop, dancehall',
    bio: 'Barbadian singer and businesswoman',
    image: 'https://picsum.photos/seed/rihannaartist/600/360',
  },
];

const FEATURED_SONGS = [
  { id: '1', title: 'Teenage Dirtbag', artist: 'Wheatus', image: 'https://picsum.photos/seed/td1/200/200' },
  { id: '2', title: 'Starboy', artist: 'The Weeknd', image: 'https://picsum.photos/seed/sb1/200/200' },
  { id: '3', title: 'Kiss It Better', artist: 'Rihanna', image: 'https://picsum.photos/seed/kib1/200/200' },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', image: 'https://picsum.photos/seed/bl1/200/200' },
  { id: '5', title: 'Levitating', artist: 'Dua Lipa', image: 'https://picsum.photos/seed/lev1/200/200' },
  { id: '6', title: 'Stay', artist: 'Kid LAROI', image: 'https://picsum.photos/seed/stay1/200/200' },
];

const TABS: { label: string; icon: string; iconActive: string }[] = [
  { label: 'Home',      icon: 'home-outline',          iconActive: 'home' },
  { label: 'Community', icon: 'account-group-outline',  iconActive: 'account-group' },
  { label: 'Explore',   icon: 'compass-outline',        iconActive: 'compass' },
  { label: 'Library',   icon: 'bookshelf',              iconActive: 'bookshelf' },
];

export default function HomeScreen({ navigation }: any) {
  const { colors, mode } = useTheme();
  const [activeSong, setActiveSong] = useState(0);
  const [activeArtist, setActiveArtist] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <StreamlineLogo size={36} />
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://picsum.photos/seed/avatar1/80/80' }}
                style={styles.avatar}
              />
            </View>
          </View>

          {/* Recent Songs */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Songs</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.cardRow}
            onMomentumScrollEnd={(e) => {
              setActiveSong(Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)));
            }}
          >
            {RECENT_SONGS.map((song) => (
              <TouchableOpacity key={song.id} activeOpacity={0.92} style={styles.heroCard}>
                <ImageBackground source={{ uri: song.image }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.playsRow}>
                    <Text style={styles.playsText}>{song.plays}</Text>
                  </View>
                  <View style={styles.heroBottom}>
                    <View style={styles.heroInfo}>
                      <Text style={styles.heroTitle}>{song.title}</Text>
                      <Text style={styles.heroArtist}>{song.artist}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionChip} activeOpacity={0.8}>
                      <Text style={styles.actionChipText}>Play</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {RECENT_SONGS.map((_, i) => (
              <View key={i} style={[
                styles.dot,
                { backgroundColor: i === activeSong ? colors.accent : colors.border },
                i === activeSong && styles.dotActive,
              ]} />
            ))}
          </View>

          {/* Featured Artists */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>Featured Artists</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.cardRow}
            onMomentumScrollEnd={(e) => {
              setActiveArtist(Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)));
            }}
          >
            {FEATURED_ARTISTS.map((artist) => (
              <TouchableOpacity key={artist.id} activeOpacity={0.92} style={styles.artistCard}>
                <ImageBackground source={{ uri: artist.image }} style={styles.artistImage} imageStyle={styles.heroImageStyle}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.artistTop}>
                    <Text style={styles.artistBio}>{artist.bio}</Text>
                  </View>
                  <View style={styles.heroBottom}>
                    <View style={styles.heroInfo}>
                      <Text style={styles.heroTitle}>{artist.name}</Text>
                      <Text style={styles.heroArtist}>{artist.genre}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionChip} activeOpacity={0.8}>
                      <Text style={styles.actionChipText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {FEATURED_ARTISTS.map((_, i) => (
              <View key={i} style={[
                styles.dot,
                { backgroundColor: i === activeArtist ? colors.accent : colors.border },
                i === activeArtist && styles.dotActive,
              ]} />
            ))}
          </View>

          {/* Featured Songs */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>Featured Songs</Text>
          <View style={styles.grid}>
            {FEATURED_SONGS.map((song) => (
              <TouchableOpacity key={song.id} style={styles.gridItem} activeOpacity={0.8}>
                <Image source={{ uri: song.image }} style={styles.gridThumb} />
                <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
                <View style={styles.gridArtistRow}>
                  <Text style={styles.explicit}>E</Text>
                  <Text style={[styles.gridArtist, { color: colors.textSecondary }]} numberOfLines={1}>{song.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>
      </Animated.View>

      {/* Floating Tab Bar — iOS 26 Liquid Glass */}
      <View style={styles.tabBarWrapper}>
        <View style={[
          styles.tabBarBg,
          {
            backgroundColor: mode === 'dark' ? 'rgba(28,28,30,0.88)' : 'rgba(242,242,247,0.88)',
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
          },
        ]}>
          <BlurView
            intensity={60}
            tint={mode === 'dark' ? 'dark' : 'light'}
            style={styles.tabBarBlur}
          >
            {TABS.map((tab, i) => {
              const active = activeTab === i;
              return (
                <TouchableOpacity
                  key={tab.label}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                  onPress={() => setActiveTab(i)}
                >
                  <View style={[styles.tabIconPill, active && { backgroundColor: colors.accentMuted }]}>
                    <MaterialCommunityIcons
                      name={(active ? tab.iconActive : tab.icon) as any}
                      size={22}
                      color={active ? colors.accent : colors.textMuted}
                    />
                  </View>
                  <Text style={[styles.tabLabel, { color: active ? colors.accent : colors.textMuted }, active && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 56, paddingHorizontal: 24 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24,
  },
  avatarWrap: {
    width: 40, height: 40, borderRadius: 20, overflow: 'hidden',
  },
  avatar: { width: 40, height: 40 },

  sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 14, letterSpacing: -0.4 },

  cardRow: { paddingRight: 24, gap: 16 },

  heroCard: {
    width: CARD_WIDTH,
    height: 210,
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroImage: { flex: 1, justifyContent: 'space-between', padding: 14 },
  heroImageStyle: { borderRadius: 18 },

  artistCard: {
    width: CARD_WIDTH,
    height: 260,
    borderRadius: 18,
    overflow: 'hidden',
  },
  artistImage: { flex: 1, justifyContent: 'space-between', padding: 14 },
  artistTop: { alignItems: 'center', paddingTop: 4 },
  artistBio: {
    color: 'rgba(255,255,255,0.85)', fontSize: 13,
    textAlign: 'center', fontWeight: '500',
  },

  playsRow: { alignItems: 'flex-end' },
  playsText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' },

  heroBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  heroInfo: { flex: 1, marginRight: 12 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  heroArtist: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },

  actionChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionChipText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  dotsRow: { flexDirection: 'row', gap: 5, marginTop: 12, alignSelf: 'center' },
  dot: { height: 6, width: 6, borderRadius: 3 },
  dotActive: { width: 18 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: ITEM_SIZE },
  gridThumb: { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 12 },
  gridTitle: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  gridArtistRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  explicit: {
    fontSize: 9, color: '#fff',
    backgroundColor: 'rgba(128,128,128,0.5)',
    paddingHorizontal: 3, paddingVertical: 1,
    borderRadius: 2, fontWeight: '700',
  },
  gridArtist: { fontSize: 11, flex: 1 },

  tabBarWrapper: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingBottom: 28,
  },
  tabBarBg: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },
  tabBarBlur: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabIconPill: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: { fontSize: 10, letterSpacing: 0.1 },
  tabLabelActive: { fontWeight: '700' },
});
