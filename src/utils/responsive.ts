import { Dimensions, PixelRatio, Platform } from 'react-native';

// Design-base: iPhone 13 Mini (375 × 812).
// Everything scales proportionally from this baseline so smaller phones
// never clip and larger phones / tablets fill gracefully.
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Width-percentage scaler.
 * `wp(50)` → 50 % of screen width, linearly scaled from 375 base.
 * Useful for paddings, margins, card widths, icon sizes.
 */
export function wp(widthPercent: number): number {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
}

/**
 * Height-percentage scaler.
 * `hp(10)` → 10 % of screen height, linearly scaled from 812 base.
 * Useful for vertical spacing, image heights, header areas.
 */
export function hp(heightPercent: number): number {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
}

/**
 * Scales a fixed pixel value from the 375-wide design base to the
 * current device width. This gives a more intuitive API when you
 * already know the "design-pixel" value (e.g. `s(16)` for 16 px on
 * a 375 design).  On a 430-wide Max phone it becomes ~18.4 px.
 */
export function s(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return PixelRatio.roundToNearestPixel(newSize);
}

/**
 * Font-size normaliser.
 * Uses a moderated scaling factor so text grows on big screens but
 * never becomes comically large.  On iOS the raw scale is used; on
 * Android we dampen it slightly because Android already does some
 * font scaling based on system settings.
 */
export function normalize(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  // Android: dampen the scale slightly (average between 1× and full scale)
  const dampened = size * ((scale + 1) / 2);
  return Math.round(PixelRatio.roundToNearestPixel(dampened));
}

/** true on phones narrower than 375 lp (e.g. iPhone SE 1st-gen 320) */
export const isSmallDevice = SCREEN_WIDTH < 375;

/** true on iPad-class widths (>= 768 lp) */
export const isTablet = SCREEN_WIDTH >= 768;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
