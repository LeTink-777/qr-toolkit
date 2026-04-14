import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

import { buildPayload, type VCardBuildData } from '../../lib/buildPayload';

const vcardSchema = z.object({
  name: z.string().min(1),
  phone: z.string(),
  email: z.string(),
  org: z.string(),
});

interface VCardFormProps {
  onGenerate: (value: string) => void;
}

/** Форма генерации QR-кода для контактной карточки */
export function VCardForm({ onGenerate }: VCardFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const data: VCardBuildData = { name, phone, email, org };
    const result = vcardSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid data');
      return;
    }
    setError(null);
    onGenerate(buildPayload('vcard', data));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('generator.vcardName')}
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder={t('generator.vcardPhone')}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={t('generator.vcardEmail')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={org}
        onChangeText={setOrg}
        placeholder={t('generator.vcardOrg')}
      />
      {error && (
        <Text variant="caption1" color="#FF3B30">
          {error}
        </Text>
      )}
      <Button
        title={t('generator.generate')}
        onPress={handleGenerate}
        disabled={name.length === 0}
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
});
