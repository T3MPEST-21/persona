import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, showText = false }) => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={COLORS.accent} />
            <Stop offset="1" stopColor="#A855F7" /> 
          </LinearGradient>
        </Defs>
        {/* Two overlapping persona bubbles */}
        <Circle cx="12" cy="16" r="10" fill="url(#grad)" fillOpacity="0.8" />
        <Circle cx="20" cy="16" r="10" fill={COLORS.textMuted} fillOpacity="0.3" stroke={COLORS.accent} strokeWidth="1" />
        
        {/* Subtle smile/link between personae */}
        <Path 
          d="M12 20C12 20 14.5 22 16 22C17.5 22 20 20 20 20" 
          stroke={COLORS.text} 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </Svg>
      {showText && (
        <Text style={[styles.text, { fontSize: size * 0.6 }]}>Persona</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: -0.5,
    textTransform: 'lowercase',
  },
});
