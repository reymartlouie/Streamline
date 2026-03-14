import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const ART_SIZE = width - 64;

const TRACK = {
  title: 'Starboy',
  artist: 'The Weeknd',
  album: 'Starboy',
  duration: 230,
};

const QUEUE = [
  { id: '1', title: 'Starboy', artist: 'The Weeknd' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
  { id: '3', title: 'Die For You', artist: 'The Weeknd' },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function PlayerScreen({ navigation }: any) {
  const { colors, mode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressBarWidth = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isPlaying ? 1 : 0.88,
      tension: 60, friction: 10, useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  const currentTime = Math.floor(progress * TRACK.duration);
  const remaining = TRACK.duration - currentTime;
  const c = colors;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: c.bgElevated, borderColor: c.border }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="chevron-down" size={22} color={c.text} />
          </TouchableOpacity>
          <View style={styles.topCenter}>
            <Text style={[styles.topLabel, { color: c.textMuted }]}>Now Playing</Text>
            <Text style={[styles.topAlbum, { color: c.textSecondary }]} numberOfLines={1}>{TRACK.album}</Text>
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: c.bgElevated, borderColor: c.border }]}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="dots-horizontal" size={22} color={c.text} />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artSection}>
          <Animated.View style={[styles.artCard, { backgroundColor: c.bgElevated, borderColor: c.border, transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.artPlaceholder, { backgroundColor: c.bgCard }]}>
              <MaterialCommunityIcons name="music-note" size={72} color={c.textMuted} />
            </View>
          </Animated.View>
        </View>

        {/* Song info + like */}
        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.trackTitle, { color: c.text }]}>{TRACK.title}</Text>
            <Text style={[styles.trackArtist, { color: c.textSecondary }]}>{TRACK.artist}</Text>
          </View>
          <TouchableOpacity
            style={[styles.likeBtn, { backgroundColor: liked ? c.accentMuted : c.bgElevated, borderColor: liked ? c.accentBorder : c.border }]}
            onPress={() => setLiked(!liked)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? c.accent : c.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.progressTouchable}
            onLayout={(e) => { progressBarWidth.current = e.nativeEvent.layout.width; }}
            onPress={(e) => {
              const val = e.nativeEvent.locationX / progressBarWidth.current;
              setProgress(Math.max(0, Math.min(1, val)));
            }}
          >
            <View style={[styles.progressTrack, { backgroundColor: c.bgCard }]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: c.accent }]} />
              <View style={[styles.progressThumb, { backgroundColor: c.accent, left: `${progress * 100}%` as any }]} />
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: c.textMuted }]}>{formatTime(currentTime)}</Text>
            <Text style={[styles.timeText, { color: c.textMuted }]}>-{formatTime(remaining)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={[styles.controlsCard, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
          <View style={styles.secondaryControls}>
            <TouchableOpacity style={[styles.secondaryBtn, shuffle && { backgroundColor: c.accentMuted }]} onPress={() => setShuffle(!shuffle)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="shuffle" size={18} color={shuffle ? c.accent : c.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, repeat && { backgroundColor: c.accentMuted }]} onPress={() => setRepeat(!repeat)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="repeat" size={18} color={repeat ? c.accent : c.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons name="playlist-plus" size={18} color={c.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons name="share-variant-outline" size={18} color={c.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <View style={styles.mainControls}>
            <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="skip-previous" size={32} color={c.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.playPauseBtn, { backgroundColor: c.accent }]} onPress={() => setIsPlaying(!isPlaying)} activeOpacity={0.85}>
              <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" style={{ marginLeft: isPlaying ? 0 : 3 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="skip-next" size={32} color={c.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Queue toggle */}
        <TouchableOpacity
          style={[styles.queueToggle, { backgroundColor: c.bgElevated, borderColor: c.border }]}
          onPress={() => setShowQueue(!showQueue)}
          activeOpacity={0.85}
        >
          <View style={styles.queueToggleLeft}>
            <MaterialCommunityIcons name="playlist-music" size={18} color={c.textSecondary} />
            <Text style={[styles.queueToggleText, { color: c.textSecondary }]}>Up next</Text>
          </View>
          <MaterialCommunityIcons name={showQueue ? 'chevron-up' : 'chevron-down'} size={18} color={c.textMuted} />
        </TouchableOpacity>

        {showQueue && (
          <View style={[styles.queueCard, { backgroundColor: c.bgElevated, borderColor: c.border }]}>
            {QUEUE.map((item, i) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.queueItem} activeOpacity={0.8}>
                  <View style={[styles.queueArt, { backgroundColor: c.bgCard }]}>
                    <MaterialCommunityIcons name="music-note" size={14} color={c.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.queueTitle, { color: i === 0 ? c.accent : c.text }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.queueArtist, { color: c.textMuted }]} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  {i === 0 && <MaterialCommunityIcons name="music-note" size={14} color={c.accent} />}
                </TouchableOpacity>
                {i < QUEUE.length - 1 && <View style={[styles.queueDivider, { backgroundColor: c.border }]} />}
              </View>
            ))}
          </View>
        )}

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 32, gap: 14 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  topCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  topLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  topAlbum: { fontSize: 13, fontWeight: '500', marginTop: 2 },

  artSection: { alignItems: 'center' },
  artCard: { width: ART_SIZE, height: ART_SIZE, borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  artPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  trackArtist: { fontSize: 15, marginTop: 3 },
  likeBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  progressCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 10 },
  progressTouchable: { paddingVertical: 6 },
  progressTrack: { height: 4, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  progressThumb: { position: 'absolute', top: -5, width: 14, height: 14, borderRadius: 7, marginLeft: -7 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 11 },

  controlsCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 14 },
  secondaryControls: { flexDirection: 'row', justifyContent: 'space-around' },
  secondaryBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1 },
  mainControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  skipBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  playPauseBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },

  queueToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 20, borderWidth: 1 },
  queueToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  queueToggleText: { fontSize: 13, fontWeight: '600' },

  queueCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  queueItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  queueArt: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  queueTitle: { fontSize: 13, fontWeight: '600' },
  queueArtist: { fontSize: 11, marginTop: 1 },
  queueDivider: { height: 1, marginLeft: 64 },
});
