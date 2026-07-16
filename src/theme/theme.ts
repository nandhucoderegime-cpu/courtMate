import { UserRole } from '../types';
import { normalize, s } from '../utils/responsive';

// Palette is grounded in the architecture diagram itself: teal marked "Player
// services", coral marked "Venue services". We reuse that language as the
// app's own role indicator - the whole UI re-tints depending on which mode
// you're in, so the color isn't decoration, it's telling you where you are.
export const COLORS = {
  bg: '#F5F6F2',
  surface: '#FFFFFF',
  ink: '#14201E',
  inkSoft: '#5B6864',
  inkFaint: '#93A19C',
  line: '#E4E7E1',

  player: '#0E8E7C',
  playerTint: '#DEF2ED',
  playerDark: '#0A6B5D',

  venue: '#E0693A',
  venueTint: '#FCE7DA',
  venueDark: '#B94F26',

  amber: '#C99A3E',
  amberTint: '#F7EEDA',

  danger: '#C6453D',
  dangerTint: '#FBEAEA',
  success: '#3D8B52',
  white: '#FFFFFF',
};

export const SPACING = {
  xs: s(4),
  sm: s(8),
  md: s(16),
  lg: s(24),
  xl: s(32),
  xxl: s(40),
};

export const RADIUS = {
  sm: s(8),
  md: s(14),
  lg: s(20),
  xl: s(28),
  full: 999,
};

export const FONT = {
  h1: { fontSize: normalize(28), fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: normalize(22), fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: normalize(17), fontWeight: '700' as const },
  body: { fontSize: normalize(15), fontWeight: '400' as const },
  bodyMedium: { fontSize: normalize(15), fontWeight: '600' as const },
  small: { fontSize: normalize(13), fontWeight: '400' as const },
  tiny: { fontSize: normalize(11), fontWeight: '600' as const },
};

export const CURRENCY = '₹';

export function roleColor(role: UserRole) {
  return role === 'player'
    ? { primary: COLORS.player, tint: COLORS.playerTint, dark: COLORS.playerDark }
    : { primary: COLORS.venue, tint: COLORS.venueTint, dark: COLORS.venueDark };
}
