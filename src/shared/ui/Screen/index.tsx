import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing } from '@/shared/theme/spacing';

interface ScreenProps {
  children: ReactNode;
  /** Цвет фона */
  backgroundColor?: string;
  /** Внутренние отступы (по умолчанию — horizontal lg) */
  padded?: boolean;
  /** Использовать SafeAreaView */
  safe?: boolean;
  /** Дополнительные стили */
  style?: ViewStyle;
}

/** Базовый контейнер экрана с SafeArea */
export function Screen({
  children,
  backgroundColor = '#FFFFFF',
  padded = true,
  safe = true,
  style,
}: ScreenProps) {
  const Container = safe ? SafeAreaView : View;

  return (
    <Container style={[styles.container, { backgroundColor }, padded && styles.padded, style]}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
