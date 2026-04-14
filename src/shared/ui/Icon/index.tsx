import { type TextStyle } from 'react-native';

import { Text } from '@/shared/ui/Text';

interface IconProps {
  /** Символ или эмодзи-иконка */
  name: string;
  /** Размер (по умолчанию 24) */
  size?: number;
  /** Цвет */
  color?: string;
  /** Дополнительные стили */
  style?: TextStyle;
}

/**
 * Простой компонент иконки.
 * В production-проекте заменить на @expo/vector-icons или SVG-иконки.
 */
export function Icon({ name, size = 24, color = '#000000', style }: IconProps) {
  return (
    <Text style={[{ fontSize: size, color, lineHeight: size * 1.2 }, style]}>
      {name}
    </Text>
  );
}
