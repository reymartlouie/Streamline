import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StreamlineLogo from '../components/StreamlineLogo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const RELEASE_W = 140;
const TREND_W = (width - 60) / 2;

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
  { id: '1', title: 'Teenage Dirtbag', artist: 'Wheatus', plays: '12M' },
  { id: '2', title: 'Starboy', artist: 'The Weeknd', plays: '40M' },
  { id: '3', title: 'Kiss It Better', artist: 'Rihanna', plays: '28M' },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', plays: '80M' },
  { id: '5', title: 'Levitating', artist: 'Dua Lipa', plays: '55M' },
  { id: '6', title: 'Stay', artist: 'Kid LAROI', plays: '33M' },
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

// ── Art placeholder ───────────────────────────────────────────────────────────

function ArtPlaceholder({ iconSize = 28, iconName = 'music-note', bgColor, iconColor, style }: any) {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', backgroundColor: bgColor }, style]}>
      <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
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

  const card = [styles.bentoCard, { backgroundColor: colors.bgElevated, borderColor: colors.border }];

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
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently Played</Text>
              <TouchableOpacity><Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
              {RECENTLY_PLAYED.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  style={[styles.recentChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
                  onPress={() => navigation.navigate('Player')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.recentArt, { backgroundColor: colors.bgCard }]}>
                    <MaterialCommunityIcons name="music-note" size={14} color={colors.textMuted} />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={[styles.recentTitle, { color: colors.text }]} numberOfLines={1}>{track.title}</Text>
                    <Text style={[styles.recentArtist, { color: colors.textMuted }]} numberOfLines={1}>{track.artist}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── New Releases ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>New Releases</Text>
              <TouchableOpacity><Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {NEW_RELEASES.map((r) => (
                <TouchableOpacity key={r.id} style={[styles.releaseCard, ...card]} activeOpacity={0.85}>
                  <ArtPlaceholder
                    iconSize={26} bgColor={colors.bgCard} iconColor={colors.textMuted}
                    style={{ width: RELEASE_W - 20, height: RELEASE_W - 20, borderRadius: 14 }}
                  />
                  <View style={[styles.newBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                  <View style={styles.releaseInfo}>
                    <Text style={[styles.releaseTitle, { color: colors.text }]} numberOfLines={1}>{r.title}</Text>
                    <Text style={[styles.releaseArtist, { color: colors.textSecondary }]} numberOfLines={1}>{r.artist}</Text>
                    <View style={styles.releaseMeta}>
                      <Text style={[styles.releaseType, { color: colors.accent }]}>{r.type}</Text>
                      <Text style={[styles.releaseTime, { color: colors.textMuted }]}>{r.timeAgo}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Artist Spotlight ────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Artist Spotlight</Text>
            </View>
            <TouchableOpacity style={[styles.spotlightCard, ...card]} activeOpacity={0.88}>
              <ArtPlaceholder
                iconSize={40} iconName="account-music" bgColor={colors.bgCard} iconColor={colors.textMuted}
                style={{ height: 180 }}
              />
              <View style={styles.spotlightInfo}>
                <View style={styles.spotlightStats}>
                  <View style={[styles.statChip, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="account-multiple" size={12} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>{SPOTLIGHT.followers} followers</Text>
                  </View>
                  <View style={[styles.statChip, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="music-note" size={12} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>{SPOTLIGHT.tracks} tracks</Text>
                  </View>
                </View>
                <View style={styles.spotlightBottom}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={[styles.spotlightName, { color: colors.text }]}>{SPOTLIGHT.name}</Text>
                    <Text style={[styles.spotlightGenre, { color: colors.textSecondary }]}>{SPOTLIGHT.genre}</Text>
                    <Text style={[styles.spotlightBio, { color: colors.textMuted }]} numberOfLines={2}>{SPOTLIGHT.bio}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.followBtn, following
                      ? { backgroundColor: colors.accentMuted, borderColor: colors.accentBorder }
                      : { backgroundColor: colors.accent, borderColor: colors.accent }]}
                    onPress={() => setFollowing(!following)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.followBtnText, { color: following ? colors.accent : '#fff' }]}>
                      {following ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* ── Activity Feed ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity</Text>
              <TouchableOpacity><Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text></TouchableOpacity>
            </View>
            <View style={styles.feedList}>
              {ACTIVITY_FEED.map((post, idx) => (
                <View key={post.id}>
                  <TouchableOpacity style={[styles.feedPost, ...card]} activeOpacity={0.8}>
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
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Now Trending</Text>
              <TouchableOpacity><Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text></TouchableOpacity>
            </View>
            <View style={styles.trendingGrid}>
              {TRENDING.map((song) => (
                <TouchableOpacity key={song.id} style={[styles.trendingCard, ...card]} activeOpacity={0.85}>
                  <ArtPlaceholder
                    iconSize={24} bgColor={colors.bgCard} iconColor={colors.textMuted}
                    style={{ height: TREND_W * 0.7 }}
                  />
                  <View style={styles.trendingInfo}>
                    <Text style={[styles.trendingTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
                    <Text style={[styles.trendingArtist, { color: colors.textSecondary }]} numberOfLines={1}>{song.artist}</Text>
                    <View style={styles.trendingPlaysRow}>
                      <MaterialCommunityIcons name="play-circle-outline" size={12} color={colors.textMuted} />
                      <Text style={[styles.trendingPlays, { color: colors.textMuted }]}>{song.plays}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '600' },

  bentoCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },

  chipBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipBtnText: { fontSize: 12, fontWeight: '700' },

  hRow: { gap: 12, paddingRight: 24 },

  // Recently Played
  recentRow: { gap: 10, paddingRight: 24 },
  recentChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 16, borderWidth: 1, width: 180,
  },
  recentArt: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  recentInfo: { flex: 1 },
  recentTitle: { fontSize: 12, fontWeight: '700' },
  recentArtist: { fontSize: 11, marginTop: 1 },

  releaseCard: { width: RELEASE_W, padding: 10 },
  newBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  newBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  releaseInfo: { marginTop: 10, gap: 2 },
  releaseTitle: { fontSize: 12, fontWeight: '700' },
  releaseArtist: { fontSize: 11 },
  releaseMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  releaseType: { fontSize: 10, fontWeight: '600' },
  releaseTime: { fontSize: 10 },


  spotlightCard: { width: '100%' },
  spotlightInfo: { padding: 16, gap: 12 },
  spotlightStats: { flexDirection: 'row', gap: 8 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statText: { fontSize: 11, fontWeight: '500' },
  spotlightBottom: { flexDirection: 'row', alignItems: 'flex-end' },
  spotlightName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  spotlightGenre: { fontSize: 13, marginTop: 2 },
  spotlightBio: { fontSize: 12, marginTop: 6, lineHeight: 17 },
  followBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  followBtnText: { fontSize: 13, fontWeight: '700' },

  feedList: {},
  feedPost: { flexDirection: 'row', gap: 12, padding: 14 },
  feedAvatarCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  feedContent: { flex: 1, gap: 6 },
  feedMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feedArtist: { fontSize: 13, fontWeight: '700' },
  feedTime: { fontSize: 11 },
  feedText: { fontSize: 13, lineHeight: 18 },
  feedActions: { flexDirection: 'row', gap: 16 },
  feedAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feedActionText: { fontSize: 11 },

  trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  trendingCard: { width: TREND_W },
  trendingInfo: { padding: 10, gap: 2 },
  trendingTitle: { fontSize: 13, fontWeight: '700' },
  trendingArtist: { fontSize: 11 },
  trendingPlaysRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  trendingPlays: { fontSize: 10 },

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
