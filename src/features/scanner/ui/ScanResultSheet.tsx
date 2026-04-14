import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { QrPayload } from '@/entities/qr-payload';
import { spacing } from '@/shared/theme/spacing';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

import { validateUrl } from '../lib/validateUrl';

interface ScanResultSheetProps {
  /** Распарсенный пейлоад */
  payload: QrPayload;
  /** Скопировать в буфер */
  onCopy: (text: string) => Promise<void>;
  /** Открыть URL */
  onOpenUrl: (url: string) => Promise<void>;
  /** Закрыть sheet */
  onDismiss: () => void;
}

/** Контент bottom sheet с результатом сканирования */
export function ScanResultSheet({ payload, onCopy, onOpenUrl, onDismiss }: ScanResultSheetProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await onCopy(payload.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onCopy, payload.raw]);

  const handleOpenUrl = useCallback(async () => {
    if (payload.type !== 'url') return;

    const validation = validateUrl(payload.url);
    if (!validation.safe && validation.reasonKey) {
      const reason = t(`scanner.suspiciousReasons.${validation.reasonKey}`);
      Alert.alert(
        t('scanner.suspiciousUrl'),
        t('scanner.suspiciousUrlMessage', { reason }),
        [
          { text: t('scanner.cancel'), style: 'cancel' },
          {
            text: t('scanner.openAnyway'),
            style: 'destructive',
            onPress: () => void onOpenUrl(payload.url),
          },
        ],
      );
      return;
    }

    await onOpenUrl(payload.url);
  }, [payload, onOpenUrl, t]);

  return (
    <View style={styles.container}>
      <Text variant="headline" style={styles.title}>
        {t('scanner.resultTitle')}
      </Text>

      <View style={styles.typeTag}>
        <Text variant="caption1" color="#FFFFFF">
          {payload.type.toUpperCase()}
        </Text>
      </View>

      <Text variant="body" style={styles.data} numberOfLines={5}>
        {getDisplayText(payload)}
      </Text>

      <View style={styles.actions}>
        <Button
          title={copied ? t('common.copied') : t('scanner.copy')}
          variant="secondary"
          onPress={() => void handleCopy()}
        />
        {payload.type === 'url' && (
          <Button title={t('scanner.openUrl')} onPress={() => void handleOpenUrl()} />
        )}
        {payload.type === 'phone' && (
          <Button
            title={t('scanner.call')}
            onPress={() => void onOpenUrl(`tel:${payload.number}`)}
          />
        )}
        {payload.type === 'email' && (
          <Button
            title={t('scanner.sendEmail')}
            onPress={() => void onOpenUrl(payload.raw)}
          />
        )}
      </View>

      <Button title={t('scanner.cancel')} variant="ghost" onPress={onDismiss} style={styles.dismiss} />
    </View>
  );
}

/** Извлекает наиболее читаемый текст из пейлоада */
function getDisplayText(payload: QrPayload): string {
  switch (payload.type) {
    case 'url':
      return payload.url;
    case 'text':
      return payload.text;
    case 'wifi':
      return `SSID: ${payload.ssid}`;
    case 'vcard':
      return payload.name || payload.raw;
    case 'email':
      return payload.address;
    case 'phone':
      return payload.number;
    case 'unknown':
      return payload.raw;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  typeTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  data: {
    marginBottom: spacing.xl,
    fontFamily: 'monospace',
  },
  actions: {
    gap: spacing.sm,
  },
  dismiss: {
    marginTop: spacing.sm,
  },
});
