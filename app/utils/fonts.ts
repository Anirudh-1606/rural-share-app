export const FONTS = {
  // Poppins font family
  POPPINS: {
    REGULAR: 'Poppins-Regular',
    MEDIUM: 'Poppins-Medium',
    SEMIBOLD: 'Poppins-SemiBold',
    BOLD: 'Poppins-Bold',
    LIGHT: 'Poppins-Light',
    THIN: 'Poppins-Thin',
    EXTRALIGHT: 'Poppins-ExtraLight',
    EXTRABOLD: 'Poppins-ExtraBold',
    BLACK: 'Poppins-Black',
  },
} as const;

export const FONT_WEIGHTS = {
  THIN: '100',
  EXTRALIGHT: '200',
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
  BLACK: '900',
} as const;

export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
  '5XL': 48,
  '6XL': 60,
} as const;

// Helper function to get font family with weight
export const getFontFamily = (weight: keyof typeof FONT_WEIGHTS = 'REGULAR') => {
  const fontWeights = {
    THIN: FONTS.POPPINS.THIN,
    EXTRALIGHT: FONTS.POPPINS.EXTRALIGHT,
    LIGHT: FONTS.POPPINS.LIGHT,
    REGULAR: FONTS.POPPINS.REGULAR,
    MEDIUM: FONTS.POPPINS.MEDIUM,
    SEMIBOLD: FONTS.POPPINS.SEMIBOLD,
    BOLD: FONTS.POPPINS.BOLD,
    EXTRABOLD: FONTS.POPPINS.EXTRABOLD,
    BLACK: FONTS.POPPINS.BLACK,
  };
  
  return fontWeights[weight];
}; 