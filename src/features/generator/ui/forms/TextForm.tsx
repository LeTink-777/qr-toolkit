import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

const textSchema = z.string().min(1).max(4296);

interface TextFormProps {
  onGenerate: (value: string) => void;
}

/** Форма генерации QR-кода для произвольного текста */
export function TextForm({ onGenerate }: TextFormProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const result = textSchema.safeParse(text);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid text');
      return;
    }
    setError(null);
    onGenerate(result.data);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={text}
        onChangeText={(val) => {
          setText(val);
          setError(null);
        }}
        placeholder={t('generator.textPlaceholder')}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      {error && (
        <Text variant="caption1" color="#FF3B30">
          {error}
        </Text>
      )}
      <Button
        title={t('generator.generate')}
        onPress={handleGenerate}
        disabled={text.length === 0}
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
    minHeight: 120,
  },
  inputError: { borderColor: '#FF3B30' },
});
