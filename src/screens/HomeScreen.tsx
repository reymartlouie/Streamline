import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar, PanResponder,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const RELEASE_W = 160;
const RELEASE_H = 230;

// ── Data ─────────────────────────────────────────────────────────────────────

const RECENTLY_PLAYED = [
  { id: '1', title: 'Starboy', artist: 'The Weeknd' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
  { id: '3', title: 'Teenage Dirtbag', artist: 'Wheatus' },
  { id: '4', title: 'Levitating', artist: 'Dua Lipa' },
  { id: '5', title: 'Stay', artist: 'Kid LAROI' },
  { id: '6', title: 'Peaches', artist: 'Justin Bieber' },
];

const NEW_RELEASES = [
  { id: '1', title: 'Die For You', artist: 'The Weeknd', type: 'Single', timeAgo: '2h ago' },
  { id: '2', title: 'Needed Me', artist: 'Rihanna', type: 'Album', timeAgo: '1d ago' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', type: 'EP', timeAgo: '3d ago' },
  { id: '4', title: 'Peaches', artist: 'Justin Bieber', type: 'Single', timeAgo: '1w ago' },
];

const SPOTLIGHT = {
  name: 'The Weeknd',
  genre: 'Alternative R&B · Pop',
  followers: '112M',
  tracks: '284',
  bio: 'Pushing the boundaries of R&B, one track at a time.',
};

const ACTIVITY_FEED = [
  { id: '1', artist: 'The Weeknd', timeAgo: '2h ago', text: 'New single dropping midnight 🌙 Stay up.', likes: '24k', comments: '1.2k' },
  { id: '2', artist: 'Rihanna', timeAgo: '5h ago', text: 'In the studio working on something special for you all 🎵', likes: '89k', comments: '4.3k' },
  { id: '3', artist: 'Dua Lipa', timeAgo: '1d ago', text: "Thank you for 50M streams on Levitating! You're everything 💙", likes: '61k', comments: '2.8k' },
];

const TRENDING = [
  { id: '1', title: 'Teenage Dirtbag', artist: 'Wheatus', plays: '12M', rank: 1 },
  { id: '2', title: 'Starboy', artist: 'The Weeknd', plays: '40M', rank: 2 },
  { id: '3', title: 'Kiss It Better', artist: 'Rihanna', plays: '28M', rank: 3 },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', plays: '80M', rank: 4 },
  { id: '5', title: 'Levitating', artist: 'Dua Lipa', plays: '55M', rank: 5 },
  { id: '6', title: 'Stay', artist: 'Kid LAROI', plays: '33M', rank: 6 },
];

const TABS: { label: string; icon: string; iconActive: string }[] = [
  { label: 'Home',      icon: 'home-outline',         iconActive: 'home' },
  { label: 'Community', icon: 'account-group-outline', iconActive: 'account-group' },
  { label: 'Explore',   icon: 'compass-outline',       iconActive: 'compass' },
  { label: 'Library',   icon: 'bookshelf',             iconActive: 'bookshelf' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Trending stack ────────────────────────────────────────────────────────────

const STACK_CARD_HEIGHT = 320;
const STACK_OFFSET = 12;
const STACK_SCALE_STEP = 0.05;
const VISIBLE_CARDS = 3;

function TrendingStack({ items, colors, navigation }: any) {
  const [deck, setDeck] = useState(items);
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipeY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
      onPanResponderMove: (_, g) => {
        swipeX.setValue(g.dx);
        swipeY.setValue(g.dy * 0.15);
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 80 || Math.abs(g.vx) > 0.8) {
          const dir = g.dx > 0 ? 1 : -1;
          Animated.timing(swipeX, { toValue: dir * (width + 100), duration: 280, useNativeDriver: true }).start(() => {
            swipeX.setValue(0);
            swipeY.setValue(0);
            setDeck((prev: any[]) => {
              const [first, ...rest] = prev;
              return [...rest, first];
            });
          });
        } else {
          Animated.parallel([
            Animated.spring(swipeX, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
            Animated.spring(swipeY, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const swipeProgress = swipeX.interpolate({ inputRange: [-width, 0, width], outputRange: [1, 0, 1], extrapolate: 'clamp' });
  const rotate = swipeX.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: ['-12deg', '0deg', '12deg'], extrapolate: 'clamp' });

  return (
    <View style={{ height: STACK_CARD_HEIGHT + STACK_OFFSET * (VISIBLE_CARDS - 1) + 8 }}>
      {deck.slice(0, VISIBLE_CARDS).reverse().map((song: any, revIdx: number) => {
        const idx = VISIBLE_CARDS - 1 - revIdx;
        const isFront = idx === 0;
        const baseScale = 1 - idx * STACK_SCALE_STEP;
        const baseTranslateY = idx * STACK_OFFSET;

        const scale = isFront
          ? baseScale
          : swipeProgress.interpolate({ inputRange: [0, 1], outputRange: [baseScale, baseScale + STACK_SCALE_STEP], extrapolate: 'clamp' });
        const translateY = isFront
          ? swipeY
          : (swipeProgress.interpolate({ inputRange: [0, 1], outputRange: [baseTranslateY, baseTranslateY - STACK_OFFSET], extrapolate: 'clamp' }) as any);

        return (
          <Animated.View
            key={song.id + idx}
            style={[
              styles.stackCard,
              { backgroundColor: colors.bgCard, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: VISIBLE_CARDS - idx },
              isFront
                ? { transform: [{ scale }, { translateX: swipeX }, { translateY }, { rotate }] }
                : { transform: [{ scale }, { translateY }] },
            ]}
            {...(isFront ? panResponder.panHandlers : {})}
          >
            {/* Full-bleed art */}
            <View style={[StyleSheet.absoluteFill, styles.stackArtFill]}>
              <MaterialCommunityIcons name="music-note" size={80} color={colors.textMuted} />
            </View>

            {/* Rank badge */}
            <View style={[styles.rankBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.rankText}>#{song.rank}</Text>
            </View>

            {/* Gradient + info overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.92)']}
              style={styles.stackGradient}
            >
              <View style={styles.stackInfoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stackTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.stackArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
                <View style={styles.stackActions}>
                  <View style={styles.playsChip}>
                    <MaterialCommunityIcons name="play-circle-outline" size={13} color="rgba(255,255,255,0.65)" />
                    <Text style={styles.playsChipText}>{song.plays}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.stackPlayBtn, { backgroundColor: colors.accent }]}
                    onPress={() => navigation.navigate('Player')}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons name="play" size={18} color="#fff" style={{ marginLeft: 2 }} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        );
      })}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: any) {
  const { colors, mode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [following, setFollowing] = useState(false);
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

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <StreamlineLogo size={36} />
            <View style={[styles.avatarCircle, { backgroundColor: colors.bgCard }]}>
              <MaterialCommunityIcons name="account" size={22} color={colors.textMuted} />
            </View>
          </View>

          {/* ── Greeting ────────────────────────────────────────────────────── */}
          <View>
            <Text style={[styles.greetingText, { color: colors.text }]}>{getGreeting()}, Rey 👋</Text>
            <Text style={[styles.greetingSubtext, { color: colors.textSecondary }]}>What are you feeling today?</Text>
          </View>

          {/* ── Recently Played ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently Played</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
              {RECENTLY_PLAYED.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  style={[styles.recentCard, { backgroundColor: colors.bgCard }]}
                  onPress={() => navigation.navigate('Player')}
                  activeOpacity={0.85}
                >
                  {/* Full-bleed art */}
                  <View style={[StyleSheet.absoluteFill, styles.recentArtFill]}>
                    <MaterialCommunityIcons name="music-note" size={32} color={colors.textMuted} />
                  </View>
                  {/* Gradient + info */}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.recentGradient}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.recentArtist} numberOfLines={1}>{track.artist}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── New Releases ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>New Releases</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {NEW_RELEASES.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.releaseCard, { backgroundColor: colors.bgCard }]}
                  activeOpacity={0.85}
                >
                  {/* Art fills entire card */}
                  <View style={[StyleSheet.absoluteFill, styles.releaseArtFill]}>
                    <MaterialCommunityIcons name="music-note" size={40} color={colors.textMuted} />
                  </View>

                  {/* Type badge */}
                  <View style={[styles.releaseBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.releaseBadgeText}>{r.type}</Text>
                  </View>

                  {/* Gradient + info */}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.88)']} style={styles.releaseGradient}>
                    <Text style={styles.releaseTimeAgo}>{r.timeAgo}</Text>
                    <Text style={styles.releaseTitle} numberOfLines={1}>{r.title}</Text>
                    <Text style={styles.releaseArtist} numberOfLines={1}>{r.artist}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Artist Spotlight ────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Artist Spotlight</Text>
            <TouchableOpacity style={[styles.spotlightCard, { backgroundColor: colors.bgCard }]} activeOpacity={0.88}>
              {/* Art fills entire card */}
              <View style={[StyleSheet.absoluteFill, styles.spotlightArtFill]}>
                <MaterialCommunityIcons name="account-music" size={100} color={colors.textMuted} />
              </View>

              {/* Gradient + info at bottom */}
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.94)']} style={styles.spotlightGradient}>
                <View style={styles.spotlightStats}>
                  <View style={styles.statChip}>
                    <MaterialCommunityIcons name="account-multiple" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.statText}>{SPOTLIGHT.followers} followers</Text>
                  </View>
                  <View style={styles.statChip}>
                    <MaterialCommunityIcons name="music-note" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.statText}>{SPOTLIGHT.tracks} tracks</Text>
                  </View>
                </View>
                <Text style={styles.spotlightName}>{SPOTLIGHT.name}</Text>
                <Text style={styles.spotlightGenre}>{SPOTLIGHT.genre}</Text>
                <View style={styles.spotlightBottom}>
                  <Text style={styles.spotlightBio} numberOfLines={2}>{SPOTLIGHT.bio}</Text>
                  <TouchableOpacity
                    style={[styles.followBtn, { backgroundColor: following ? 'rgba(255,255,255,0.15)' : colors.accent }]}
                    onPress={() => setFollowing(!following)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.followBtnText}>{following ? 'Following' : 'Follow'}</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── Activity Feed ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity</Text>
            <View style={styles.feedList}>
              {ACTIVITY_FEED.map((post, idx) => (
                <View key={post.id}>
                  <TouchableOpacity style={[styles.feedPost, { backgroundColor: colors.bgElevated }]} activeOpacity={0.8}>
                    <View style={[styles.feedAvatarCircle, { backgroundColor: colors.bgCard }]}>
                      <MaterialCommunityIcons name="account-music" size={18} color={colors.textMuted} />
                    </View>
                    <View style={styles.feedContent}>
                      <View style={styles.feedMeta}>
                        <Text style={[styles.feedArtist, { color: colors.text }]}>{post.artist}</Text>
                        <Text style={[styles.feedTime, { color: colors.textMuted }]}>{post.timeAgo}</Text>
                      </View>
                      <Text style={[styles.feedText, { color: colors.textSecondary }]}>{post.text}</Text>
                      <View style={styles.feedActions}>
                        <TouchableOpacity style={styles.feedAction}>
                          <MaterialCommunityIcons name="heart-outline" size={15} color={colors.textMuted} />
                          <Text style={[styles.feedActionText, { color: colors.textMuted }]}>{post.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.feedAction}>
                          <MaterialCommunityIcons name="comment-outline" size={15} color={colors.textMuted} />
                          <Text style={[styles.feedActionText, { color: colors.textMuted }]}>{post.comments}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {idx < ACTIVITY_FEED.length - 1 && <View style={{ height: 10 }} />}
                </View>
              ))}
            </View>
          </View>

          {/* ── Now Trending ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Now Trending</Text>
            <TrendingStack items={TRENDING} colors={colors} navigation={navigation} />
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>
      </Animated.View>

      {/* ── Tab Bar ──────────────────────────────────────────────────────────── */}
      <View style={styles.tabBarWrapper}>
        <View style={[styles.tabBarBg, {
          backgroundColor: mode === 'dark' ? 'rgba(28,28,30,0.92)' : 'rgba(242,242,247,0.92)',
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
        }]}>
          <BlurView intensity={60} tint={mode === 'dark' ? 'dark' : 'light'} style={styles.tabBarBlur}>
            {TABS.map((tab, i) => {
              const active = activeTab === i;
              return (
                <TouchableOpacity key={tab.label} style={styles.tabItem} activeOpacity={0.7} onPress={() => setActiveTab(i)}>
                  <View style={[styles.tabIconPill, active && { backgroundColor: colors.accentMuted }]}>
                    <MaterialCommunityIcons name={(active ? tab.iconActive : tab.icon) as any} size={22} color={active ? colors.accent : colors.textMuted} />
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

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 56, paddingHorizontal: 24, gap: 28, paddingBottom: 0 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  greetingText: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  greetingSubtext: { fontSize: 14, marginTop: 4 },

  section: { gap: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },

  hRow: { gap: 12, paddingRight: 24 },

  // Recently Played — square bento cards
  recentRow: { gap: 12, paddingRight: 24 },
  recentCard: { width: 140, height: 140, borderRadius: 24, overflow: 'hidden' },
  recentArtFill: { alignItems: 'center', justifyContent: 'center' },
  recentGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 12, paddingTop: 40, paddingBottom: 12 },
  recentTitle: { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: -0.1 },
  recentArtist: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  // New Releases — full-bleed bento card
  releaseCard: { width: RELEASE_W, height: RELEASE_H, borderRadius: 28, overflow: 'hidden' },
  releaseArtFill: { alignItems: 'center', justifyContent: 'center' },
  releaseBadge: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  releaseBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  releaseGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 14, paddingTop: 48, paddingBottom: 14 },
  releaseTimeAgo: { fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 3 },
  releaseTitle: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  releaseArtist: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Artist Spotlight — full-bleed hero bento
  spotlightCard: { width: '100%', height: 380, borderRadius: 28, overflow: 'hidden' },
  spotlightArtFill: { alignItems: 'center', justifyContent: 'center' },
  spotlightGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 80, paddingBottom: 20, gap: 6 },
  spotlightStats: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' },
  statText: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.75)' },
  spotlightName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  spotlightGenre: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  spotlightBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 4 },
  spotlightBio: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 17 },
  followBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  followBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Activity Feed
  feedList: {},
  feedPost: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 24 },
  feedAvatarCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  feedContent: { flex: 1, gap: 6 },
  feedMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feedArtist: { fontSize: 13, fontWeight: '700' },
  feedTime: { fontSize: 11 },
  feedText: { fontSize: 13, lineHeight: 18 },
  feedActions: { flexDirection: 'row', gap: 16 },
  feedAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feedActionText: { fontSize: 11 },

  // Trending stack — full-bleed bento cards
  stackCard: { height: STACK_CARD_HEIGHT, borderRadius: 28, overflow: 'hidden' },
  stackArtFill: { alignItems: 'center', justifyContent: 'center' },
  rankBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  rankText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  stackGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 80, paddingBottom: 20 },
  stackInfoRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  stackTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
  stackArtist: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  stackActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playsChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' },
  playsChipText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  stackPlayBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  // Tab Bar
  tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 28 },
  tabBarBg: {
    borderRadius: 32, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 16,
  },
  tabBarBlur: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabIconPill: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 100, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, letterSpacing: 0.1 },
  tabLabelActive: { fontWeight: '700' },
});
