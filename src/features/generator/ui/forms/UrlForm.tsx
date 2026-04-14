import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

const urlSchema = z.string().url();

interface UrlFormProps {
  onGenerate: (value: string) => void;
}

/** Форма генерации QR-кода для URL */
export function UrlForm({ onGenerate }: UrlFormProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid URL');
      return;
    }
    setError(null);
    onGenerate(result.data);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={url}
        onChangeText={(text) => {
          setUrl(text);
          setError(null);
        }}
        placeholder={t('generator.urlPlaceholder')}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      {error && (
        <Text variant="caption1" color="#FF3B30">
          {error}
        </Text>
      )}
      <Button
        title={t('generator.generate')}
        onPress={handleGenerate}
        disabled={url.length === 0}
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
  inputError: { borderColor: '#FF3B30' },
});
