import { type MutableRefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';

import type { QrCustomization } from '../model/generator.store';

interface QrPreviewProps {
  /** Значение для кодирования */
  value: string;
  /** Настройки внешнего вида */
  customization: QrCustomization;
  /** Ref для доступа к SVG (экспорт) */
  svgRef: MutableRefObject<{ toDataURL: (cb: (data: string) => void) => void } | null>;
}

/** Live-превью сгенерированного QR-кода */
export function QrPreview({ value, customization, svgRef }: QrPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.qrWrapper, { backgroundColor: customization.backgroundColor }]}>
        <QRCode
          value={value}
          size={customization.size}
          color={customization.foregroundColor}
          backgroundColor={customization.backgroundColor}
          getRef={(ref) => {
            if (ref) {
              svgRef.current = ref as unknown as {
                toDataURL: (cb: (data: string) => void) => void;
              };
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  qrWrapper: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
