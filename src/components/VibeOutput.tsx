import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Copy, Share2, RefreshCcw } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { CringeMeter } from './CringeMeter';
import { Logo } from './Logo';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { usePersonaStore } from '../store/usePersonaStore';

interface VibeOutputProps {
  onRegenerate: () => void;
  onShare: () => void;
}

export const VibeOutput: React.FC<VibeOutputProps> = ({ onRegenerate, onShare }) => {
  const { lastResult, isTranslating, selectedPersona } = usePersonaStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;
  const borderPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lastResult && !isTranslating) {
      // Reveal Animation
      fadeAnim.setValue(0);
      slideAnim.setValue(10);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();

      // Breathing Border
      const pulseAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(borderPulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(borderPulse, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      
      pulseAnim.start();

      return () => {
        pulseAnim.stop();
      };
    }
  }, [lastResult, isTranslating]);

  if (!lastResult && !isTranslating) return null;

  const handleCopy = () => {
    if (!lastResult) return;
    const text = `${lastResult.translation}\n\n${lastResult.hashtags?.join(' ') || ''}`;
    Clipboard.setString(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onShare();
  };

  const borderColor = borderPulse.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.1)', selectedPersona.colorAccent || COLORS.accent],
  });

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}>
      <GlassCard style={[styles.card, { borderColor: borderColor, borderWidth: 1.5 }]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Logo size={20} />
            <Text style={styles.title}>The Result</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleCopy} style={styles.iconButton}>
              <Copy size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Share2 size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.translationText}>
          {isTranslating ? 'Shifting the vibes...' : lastResult?.translation}
        </Text>

        {lastResult?.hashtags && lastResult.hashtags.length > 0 && (
          <View style={styles.hashtagContainer}>
            {lastResult.hashtags.map((tag, i) => (
              <View key={i} style={[styles.tagPill, { backgroundColor: (selectedPersona.colorAccent || COLORS.accent) + '15' }]}>
                <Text style={[styles.tagText, { color: selectedPersona.colorAccent || COLORS.accent }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        {lastResult && (
          <View style={styles.meterSection}>
            <CringeMeter 
              score={lastResult.cringeScore} 
              label={lastResult.cringeLabel} 
            />
          </View>
        )}

        {lastResult && (
          <TouchableOpacity 
            style={styles.regenerateButton} 
            onPress={onRegenerate}
            disabled={isTranslating}
          >
            <RefreshCcw size={16} color={COLORS.textMuted} />
            <Text style={styles.regenerateText}>Degenerate... I mean, Regenerate</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  translationText: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  tagPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  meterSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  regenerateText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
