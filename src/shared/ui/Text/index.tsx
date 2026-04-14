import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { typography } from '@/shared/theme/typography';

type TextVariant =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

interface TextProps extends RNTextProps {
  /** Типографический вариант */
  variant?: TextVariant;
  /** Цвет текста */
  color?: string;
}

/** Типизированный текстовый компонент с поддержкой типографической системы */
export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  const variantStyle: TextStyle = typography[variant] ?? typography.body;
  const colorStyle: TextStyle = color ? { color } : {};

  return <RNText style={[variantStyle, colorStyle, style]} {...props} />;
}
