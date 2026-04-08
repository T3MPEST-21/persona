import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { usePersonaStore } from '../store/usePersonaStore';
import { Sparkles } from 'lucide-react-native';

interface VibeInputProps {
  onTranslate: () => void;
}

export const VibeInput: React.FC<VibeInputProps> = ({ onTranslate }) => {
  const { inputText, setInputText, isTranslating } = usePersonaStore();

  const handleTranslate = () => {
    if (!inputText.trim() || isTranslating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onTranslate();
  };

  return (
    <GlassCard style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Enter your vibe..."
        placeholderTextColor={COLORS.textMuted}
        multiline
        value={inputText}
        onChangeText={setInputText}
        maxLength={500}
      />
      
      <View style={styles.footer}>
        <Text style={styles.charCount}>{inputText.length}/500</Text>
        
        <TouchableOpacity 
          style={[styles.button, !inputText.trim() && styles.buttonDisabled]}
          onPress={handleTranslate}
          activeOpacity={0.7}
          disabled={!inputText.trim() || isTranslating}
        >
          {isTranslating ? (
            <ActivityIndicator color={COLORS.primary} size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Sparkles size={18} color={COLORS.primary} />
              <Text style={styles.buttonText}>Translate</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  input: {
    color: COLORS.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  charCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
