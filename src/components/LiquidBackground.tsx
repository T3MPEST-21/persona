import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { COLORS } from '../theme';

interface LiquidBackgroundProps {
  personaColor?: string;
  cringeScore?: number;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ personaColor, cringeScore = 0 }) => {
  const { width, height } = useWindowDimensions();
  const move1 = useRef(new Animated.Value(0)).current;
  const move2 = useRef(new Animated.Value(0)).current;
  const intensity = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const prevColorRef = useRef(COLORS.primary);
  const currentColor = personaColor || COLORS.accent;

  const createAnimation = (value: Animated.Value, duration: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
      ])
    );
  };

  useEffect(() => {
    const anim1 = createAnimation(move1, 15000);
    const anim2 = createAnimation(move2, 20000);

    anim1.start();
    anim2.start();

    return () => {
      anim1.stop();
      anim2.stop();
    };
  }, []);

  useEffect(() => {
    colorAnim.setValue(0);
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false, // Color doesn't support native driver
    }).start(() => {
      prevColorRef.current = currentColor;
    });
  }, [currentColor]);

  useEffect(() => {
    Animated.spring(intensity, {
      toValue: cringeScore / 100,
      useNativeDriver: false,
      friction: 7,
      tension: 40,
    }).start();
  }, [cringeScore]);

  const bgInterpolation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColorRef.current, currentColor],
  });

  const blob2Interpolation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColorRef.current + '40', currentColor + '60'],
  });

  // Base range + added intensity range
  const getMoveRange = (base: number, multiplier: number) => {
    return intensity.interpolate({
      inputRange: [0, 1],
      outputRange: [base, base * multiplier],
    });
  };

  const blobScale = intensity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const translate1 = [
    {
      translateX: move1.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.2, width * 0.2],
      }),
    },
    {
      translateY: move1.interpolate({
        inputRange: [0, 1],
        outputRange: [-height * 0.1, height * 0.1],
      }),
    },
    { scale: blobScale }
  ];

  const translate2 = [
    {
      translateX: move2.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.2, -width * 0.2],
      }),
    },
    {
      translateY: move2.interpolate({
        inputRange: [0, 1],
        outputRange: [height * 0.1, -height * 0.1],
      }),
    },
    { scale: blobScale }
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.primary }]} />

      {/* Liquid Blobs */}
      <Animated.View
        style={[
          styles.blob,
          { backgroundColor: bgInterpolation, top: '20%', left: '10%' },
          { width: width * 0.6, height: width * 0.6, borderRadius: width * 0.3 },
          { transform: translate1 }
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          { backgroundColor: blob2Interpolation, bottom: '20%', right: '10%', width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4 },
          { transform: translate2 }
        ]}
      />

      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.4,
  },
});
