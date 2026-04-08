import Svg, { Path, Circle, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
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
          <RadialGradient id="glow" cx="16" cy="16" r="10" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="0.8" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* Two overlapping persona bubbles */}
        <Circle cx="12" cy="16" r="8" fill={COLORS.accent} fillOpacity="0.6" />
        <Circle cx="20" cy="16" r="8" fill="#A855F7" fillOpacity="0.6" />
        
        {/* Central Glow */}
        <Circle cx="16" cy="16" r="10" fill="url(#glow)" />
        
        {/* Subtle smile/link between personae */}
        <Path 
          d="M13 19C13 19 14.5 21 16 21C17.5 21 19 19 19 19" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.8"
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
