import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0F172A', // Slate 900
  secondary: '#1E293B', // Slate 800
  accent: '#38BDF8', // Sky 400
  text: '#F8FAFC', // Slate 50
  textMuted: '#94A3B8', // Slate 400
  glass: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  success: '#10B981',
  error: '#EF4444',
  black: '#000000',
  white: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const GLOABAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  glass: {
    backgroundColor: COLORS.glass,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
