import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { usePersonaStore } from '../store/usePersonaStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { Intensity, OutputLength } from '../types';

export const VibeControls: React.FC = () => {
  const { intensity, setIntensity, outputLength, setOutputLength, hashtags, setHashtags } = usePersonaStore();

  const handleIntensity = (val: Intensity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIntensity(val);
  };

  const handleLength = (val: OutputLength) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOutputLength(val);
  };

  const handleHashtags = (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHashtags(val);
  };

  const renderGroup = (label: string, current: string, options: string[], setter: (val: any) => void) => (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.buttonContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionButton, current === opt && styles.optionButtonActive]}
            onPress={() => setter(opt)}
          >
            <Text style={[styles.optionText, current === opt && styles.optionTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGroup('Intensity', intensity, ['Low', 'Medium', 'High', 'Unhinged'], handleIntensity)}
      {renderGroup('Length', outputLength, ['Short', 'Medium', 'Long'], handleLength)}
      
      <View style={styles.hashtagRow}>
        <View style={styles.hashtagTextContainer}>
          <Text style={styles.hashtagLabel}>Include Hashtags #</Text>
          <Text style={styles.hashtagSubtext}>Auto-generate relevant tags</Text>
        </View>
        <Switch
          value={hashtags}
          onValueChange={handleHashtags}
          trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: COLORS.accent + '80' }}
          thumbColor={hashtags ? COLORS.accent : '#94A3B8'}
          ios_backgroundColor="rgba(0,0,0,0.2)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    gap: SPACING.md,
  },
  group: {
    gap: SPACING.sm,
  },
  groupLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingLeft: SPACING.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButtonActive: {
    backgroundColor: COLORS.accent + '20',
    borderColor: COLORS.accent,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.accent,
  },
  hashtagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: SPACING.sm,
  },
  hashtagTextContainer: {
    flex: 1,
    gap: 2,
  },
  hashtagLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  hashtagSubtext: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});
