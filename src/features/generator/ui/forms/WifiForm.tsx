import { useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

import { buildPayload, type WifiBuildData } from '../../lib/buildPayload';

const wifiSchema = z.object({
  ssid: z.string().min(1),
  password: z.string(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean(),
});

const ENCRYPTION_OPTIONS = ['WPA', 'WEP', 'nopass'] as const;

interface WifiFormProps {
  onGenerate: (value: string) => void;
}

/** Форма генерации QR-кода для Wi-Fi */
export function WifiForm({ onGenerate }: WifiFormProps) {
  const { t } = useTranslation();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<WifiBuildData['encryption']>('WPA');
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const data: WifiBuildData = { ssid, password, encryption, hidden };
    const result = wifiSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid data');
      return;
    }
    setError(null);
    onGenerate(buildPayload('wifi', data));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={ssid}
        onChangeText={setSsid}
        placeholder={t('generator.wifiSsid')}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={t('generator.wifiPassword')}
        secureTextEntry
      />

      <Text variant="subhead">{t('generator.wifiEncryption')}</Text>
      <View style={styles.encryptionRow}>
        {ENCRYPTION_OPTIONS.map((opt) => (
          <Button
            key={opt}
            title={opt}
            variant={encryption === opt ? 'primary' : 'secondary'}
            onPress={() => setEncryption(opt)}
            style={styles.encryptionBtn}
          />
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text variant="body">{t('generator.wifiHidden')}</Text>
        <Switch value={hidden} onValueChange={setHidden} />
      </View>

      {error && (
        <Text variant="caption1" color="#FF3B30">
          {error}
        </Text>
      )}

      <Button
        title={t('generator.generate')}
        onPress={handleGenerate}
        disabled={ssid.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  encryptionRow: { flexDirection: 'row', gap: spacing.sm },
  encryptionBtn: { flex: 1 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
