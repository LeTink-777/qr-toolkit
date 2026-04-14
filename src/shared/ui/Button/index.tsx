import { useCallback } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/shared/theme/colors';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
  /** Текст кнопки */
  title: string;
  /** Обработчик нажатия */
  onPress: () => void;
  /** Визуальный вариант */
  variant?: ButtonVariant;
  /** Отключить кнопку */
  disabled?: boolean;
  /** Показать индикатор загрузки */
  loading?: boolean;
  /** Тактильная обратная связь при нажатии */
  haptic?: boolean;
  /** Дополнительные стили */
  style?: ViewStyle;
}

/** Универсальная кнопка с вариантами и haptic feedback */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  haptic = true,
  style,
}: ButtonProps) {
  const handlePress = useCallback(() => {
    if (haptic) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress, haptic]);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.light.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.headline,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.light.primary },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.light.primary,
  },
  destructive: { backgroundColor: colors.light.error },
  ghost: { backgroundColor: 'transparent' },
};

const textVariantStyles = StyleSheet.create({
  primary: { color: '#FFFFFF' },
  secondary: { color: colors.light.primary },
  destructive: { color: '#FFFFFF' },
  ghost: { color: colors.light.primary },
});
