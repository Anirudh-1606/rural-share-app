import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {FONTS, COLORS, FONT_SIZES} from '../utils';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = COLORS.TEXT.PRIMARY,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'thin':
        return FONTS.POPPINS.THIN;
      case 'light':
        return FONTS.POPPINS.LIGHT;
      case 'regular':
        return FONTS.POPPINS.REGULAR;
      case 'medium':
        return FONTS.POPPINS.MEDIUM;
      case 'semibold':
        return FONTS.POPPINS.SEMIBOLD;
      case 'bold':
        return FONTS.POPPINS.BOLD;
      case 'extrabold':
        return FONTS.POPPINS.EXTRABOLD;
      case 'black':
        return FONTS.POPPINS.BLACK;
      default:
        return FONTS.POPPINS.REGULAR;
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return FONT_SIZES['4XL'];
      case 'h2':
        return FONT_SIZES['3XL'];
      case 'h3':
        return FONT_SIZES['2XL'];
      case 'h4':
        return FONT_SIZES.XL;
      case 'body':
        return FONT_SIZES.BASE;
      case 'caption':
        return FONT_SIZES.SM;
      case 'label':
        return FONT_SIZES.SM;
      default:
        return FONT_SIZES.BASE;
    }
  };

  const getLineHeight = () => {
    const fontSize = getFontSize();
    return fontSize * 1.5;
  };

  return (
    <RNText
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: getFontSize(),
          color,
          textAlign: align,
          lineHeight: getLineHeight(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text; 