# Font Setup and Safe Area Configuration

This document explains the font setup and safe area handling configuration for the RuralShare React Native app.

## Font Configuration

### Poppins Font Family
The app uses the Poppins font family with the following weights:
- Thin (100)
- ExtraLight (200)
- Light (300)
- Regular (400)
- Medium (500)
- SemiBold (600)
- Bold (700)
- ExtraBold (800)
- Black (900)

### Font Files Location
- **Android**: `android/app/src/main/assets/fonts/`
- **iOS**: `ios/RuralShareApp/Fonts/`

### Font Configuration Files
- **Android**: Fonts are automatically loaded from the assets folder
- **iOS**: Fonts are registered in `ios/RuralShareApp/Info.plist`

## Safe Area Configuration

### SafeAreaProvider
The app is wrapped with `SafeAreaProvider` in the main `App.tsx` file to provide safe area context throughout the app.

### SafeAreaWrapper Component
A reusable `SafeAreaWrapper` component is available at `app/components/SafeAreaWrapper.tsx` that:
- Automatically handles safe area insets
- Provides customizable background color
- Supports custom styling

### Usage Example
```tsx
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import {COLORS} from '../utils';

<SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
  {/* Your screen content */}
</SafeAreaWrapper>
```

## Utility Files

### Font Utilities (`app/utils/fonts.ts`)
- `FONTS`: Font family constants
- `FONT_WEIGHTS`: Font weight constants
- `FONT_SIZES`: Font size constants
- `getFontFamily()`: Helper function to get font family with weight

### Color Utilities (`app/utils/colors.ts`)
- Comprehensive color palette
- Status colors (success, warning, error, info)
- Background and text colors
- Helper function for opacity

### Spacing Utilities (`app/utils/spacing.ts`)
- Consistent spacing units
- Border radius constants
- Shadow configurations

## Text Component

A custom `Text` component is available at `app/components/Text.tsx` that:
- Uses Poppins font by default
- Supports different variants (h1, h2, h3, h4, body, caption, label)
- Supports different weights
- Provides consistent typography

### Usage Example
```tsx
import Text from '../components/Text';

<Text variant="h1" weight="bold" align="center">
  Welcome to RuralShare
</Text>
```

## Available Text Variants
- `h1`: 36px
- `h2`: 30px
- `h3`: 24px
- `h4`: 20px
- `body`: 16px
- `caption`: 14px
- `label`: 14px

## Available Font Weights
- `thin`
- `light`
- `regular`
- `medium`
- `semibold`
- `bold`
- `extrabold`
- `black`

## Building the App

After setting up fonts, you may need to:

### For iOS:
1. Clean the build: `cd ios && xcodebuild clean`
2. Rebuild: `npx react-native run-ios`

### For Android:
1. Clean the build: `cd android && ./gradlew clean`
2. Rebuild: `npx react-native run-android`

## Notes
- Fonts are automatically linked for both platforms
- Safe area handling works on all devices including notched phones
- The setup provides a consistent design system across the app 