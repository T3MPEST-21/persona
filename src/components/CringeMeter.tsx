import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

interface CringeMeterProps {
  score: number; // 0-100
  label: string;
}

export const CringeMeter: React.FC<CringeMeterProps> = ({ score, label }) => {
  const getMeterColor = () => {
    if (score < 30) return COLORS.success;
    if (score < 70) return '#F59E0B'; // Amber
    return COLORS.error;
  };

  const meterColor = getMeterColor();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Cringe Meter</Text>
        <Text style={[styles.scoreText, { color: meterColor }]}>{score}%</Text>
      </View>
      
      <View style={styles.track}>
        <View 
          style={[
            styles.fill, 
            { width: `${score}%`, backgroundColor: meterColor }
          ]} 
        />
      </View>
      
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  statusLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});
