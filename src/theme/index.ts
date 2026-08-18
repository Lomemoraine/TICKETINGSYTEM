export const Colors = {
  deepBlue: '#1A2B5E',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  white: '#FFFFFF',
  offWhite: '#F5F5F0',
  lightGray: '#E8E8E8',
  mediumGray: '#AAAAAA',
  darkGray: '#444444',
  black: '#111111',
  ticketBg: '#FAFAFA',
  success: '#2E7D32',
};

export const Fonts = {
  heading: 'serif',       // maps to system serif; swap to custom font if loaded
  body: 'sans-serif',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    shadowColor: Colors.deepBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};
