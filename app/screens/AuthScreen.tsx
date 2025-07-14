import React from 'react';
import {View, StyleSheet} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import {COLORS, SPACING} from '../utils';

export default function AuthScreen() {
  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <View style={styles.container}>
        <Text variant="h1" weight="bold" align="center" style={styles.title}>
          RuralShare
        </Text>
        <Text variant="h4" weight="medium" align="center" style={styles.subtitle}>
          Sign in to continue
        </Text>
        <Text variant="body" align="center" style={styles.body}>
          Authentication screen with Poppins fonts and safe area handling.
        </Text>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: SPACING.SM,
    color: COLORS.PRIMARY.MAIN,
  },
  subtitle: {
    marginBottom: SPACING.LG,
    color: COLORS.TEXT.SECONDARY,
  },
  body: {
    color: COLORS.TEXT.SECONDARY,
  },
});
