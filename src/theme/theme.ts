import { UserRole } from '../types';

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

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
export const RADIUS = { sm: 8, md: 14, lg: 20, xl: 28, full: 999 };

export const FONT = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, fontWeight: '600' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  tiny: { fontSize: 11, fontWeight: '600' as const },
};

export const CURRENCY = '₹';

export function roleColor(role: UserRole) {
  return role === 'player'
    ? { primary: COLORS.player, tint: COLORS.playerTint, dark: COLORS.playerDark }
    : { primary: COLORS.venue, tint: COLORS.venueTint, dark: COLORS.venueDark };
}
