import * as Haptics from 'expo-haptics';
import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PERSONA_REGISTRY } from '../constants/personas';
import { usePersonaStore } from '../store/usePersonaStore';
import { BORDER_RADIUS, COLORS, SPACING } from '../theme';
import { GlassCard } from './GlassCard';

export const PersonaSelector: React.FC = () => {
  const { selectedPersona, setSelectedPersona } = usePersonaStore();

  const handleSelect = (persona: any) => {
    Haptics.selectionAsync();
    setSelectedPersona(persona);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Persona</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PERSONA_REGISTRY.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;

          // Format icon name: "zap" -> "Zap", "user-round" -> "UserRound"
          const iconName = persona.icon.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
          const Icon = (LucideIcons as any)[iconName] || LucideIcons.Zap;

          return (
            <TouchableOpacity
              key={persona.id}
              onPress={() => handleSelect(persona)}
              activeOpacity={0.8}
            >
              <GlassCard
                style={[
                  styles.personaCard,
                  isSelected && { borderColor: persona.colorAccent, borderWidth: 2 }
                ]}
                intensity={isSelected ? 50 : 25}
              >
                <View style={[styles.iconContainer, { backgroundColor: persona.colorAccent + '20' }]}>
                  <Icon size={24} color={persona.colorAccent} />
                </View>
                <Text style={styles.personaLabel} numberOfLines={1}>{persona.label}</Text>
                {isSelected && <View style={[styles.activeDot, { backgroundColor: persona.colorAccent }]} />}
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  personaCard: {
    width: 130,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  iconContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  personaLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
