import { StyleSheet, View, ScrollView, StatusBar, Text, Animated, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiquidBackground } from '../src/components/LiquidBackground';
import { VibeInput } from '../src/components/VibeInput';
import { PersonaSelector } from '../src/components/PersonaSelector';
import { VibeOutput } from '../src/components/VibeOutput';
import { VibeControls } from '../src/components/VibeControls';
import { HistoryTray } from '../src/components/HistoryTray';
import { Logo } from '../src/components/Logo';
import { ShareModal } from '../src/components/ShareModal';
import { usePersonaStore } from '../src/store/usePersonaStore';
import { translateText } from '../src/api/aiService';
import { COLORS, SPACING } from '../src/theme';
import { EnrichedTranslationResult } from '../src/types';
import * as Haptics from 'expo-haptics';
import { Trash2 } from 'lucide-react-native';

export default function Index() {
  const scrollRef = useRef<ScrollView>(null);
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShareVisible, setIsShareVisible] = useState(false);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    errorOpacity.setValue(1);
    Animated.timing(errorOpacity, {
      toValue: 0,
      duration: 400,
      delay: 3000,
      useNativeDriver: true,
    }).start(() => setErrorMsg(null));
  };

  const { 
    inputText, 
    selectedPersona, 
    intensity, 
    outputLength, 
    hashtags,
    setIsTranslating,
    setLastResult,
    addToHistory,
    isTranslating,
    lastResult,
    history,
    clearHistory
  } = usePersonaStore();

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;

    try {
      setIsTranslating(true);
      setErrorMsg(null);
      
      // Generation Haptic Rhythm
      const hapticTimer = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 800);

      const result = await translateText(
        inputText,
        selectedPersona,
        intensity,
        outputLength,
        hashtags
      );
      
      clearInterval(hapticTimer);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setLastResult(result);
      addToHistory(result);
      
      // Auto-scroll to result after a short delay for smoothness
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 500);
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message
        || error?.message
        || 'Something went wrong. Try again.';
      showError(msg);
      console.error('[Persona Error]:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LiquidBackground 
        personaColor={selectedPersona.colorAccent} 
        cringeScore={lastResult?.cringeScore}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Logo size={32} showText />
        </View>

        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMsg ? (
            <Animated.View style={[styles.errorBanner, { opacity: errorOpacity }]}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </Animated.View>
          ) : null}

          <VibeInput onTranslate={handleTranslate} />
          
          <PersonaSelector />

          <HistoryTray />
          
          <VibeControls />
          
          <VibeOutput 
            onRegenerate={handleTranslate} 
            onShare={() => setIsShareVisible(true)}
          />

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Trash2 size={14} color={COLORS.textMuted} />
              <Text style={styles.clearText}>Clear History</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>Persona v1.0.0</Text>
            <Text style={styles.versionText}>[T3MPEST]</Text>
          </View>

          <View style={styles.spacer} />

          
        </ScrollView>

        {lastResult && (
          <ShareModal
            isVisible={isShareVisible}
            onClose={() => setIsShareVisible(false)}
            result={history[0] || (lastResult as any)} // Best to take from history for enriched fields
            persona={selectedPersona}
            originalText={inputText}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    paddingLeft: SPACING.xs,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  spacer: {
    height: 60,
  },
  footerContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    opacity: 0.6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  clearText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
