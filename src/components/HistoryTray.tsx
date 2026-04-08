import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { usePersonaStore } from '../store/usePersonaStore';
import { PERSONA_REGISTRY } from '../constants/personas';
import { BORDER_RADIUS, COLORS, SPACING } from '../theme';
import { GlassCard } from './GlassCard';

export const HistoryTray: React.FC = () => {
  const { history, setLastResult } = usePersonaStore();

  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Translations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {history.map((item, index) => {
          const persona = PERSONA_REGISTRY.find(p => p.id === item.personaId) || PERSONA_REGISTRY[0];
          const iconName = persona.icon.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
          const Icon = (LucideIcons as any)[iconName] || LucideIcons.Zap;
          const accentColor = persona.colorAccent || COLORS.accent;

          return (
            <TouchableOpacity
              key={`${item.timestamp}-${index}`}
              onPress={() => setLastResult(item)}
              activeOpacity={0.8}
            >
              <GlassCard style={[styles.historyCard, { borderColor: accentColor + '40' }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
                    <Icon size={12} color={accentColor} />
                  </View>
                  <Text style={styles.historyText} numberOfLines={2}>
                    {item.translation}
                  </Text>
                </View>
                <View style={styles.footer}>
                   <Text style={styles.label} numberOfLines={1}>{item.personaLabel}</Text>
                   <Text style={[styles.score, { color: accentColor }]}>{item.cringeScore}%</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  historyCard: {
    width: 220,
    padding: SPACING.md,
    height: 100,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    flex: 1,
  },
  score: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: SPACING.xs,
  },
});
