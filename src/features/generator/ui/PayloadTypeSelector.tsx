import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { GeneratablePayloadType } from '@/entities/qr-payload';
import { spacing } from '@/shared/theme/spacing';
import { Button } from '@/shared/ui/Button';

const PAYLOAD_TYPES: GeneratablePayloadType[] = ['url', 'text', 'wifi', 'vcard', 'email', 'phone'];

interface PayloadTypeSelectorProps {
  selected: GeneratablePayloadType;
  onSelect: (type: GeneratablePayloadType) => void;
}

/** Селектор типа пейлоада для генератора */
export function PayloadTypeSelector({ selected, onSelect }: PayloadTypeSelectorProps) {
  const { t } = useTranslation();

  const getLabel = (type: GeneratablePayloadType): string => {
    return t(`generator.${type}`);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PAYLOAD_TYPES.map((type) => (
        <View key={type} style={styles.chip}>
          <Button
            title={getLabel(type)}
            variant={selected === type ? 'primary' : 'secondary'}
            onPress={() => onSelect(type)}
            haptic
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    minWidth: 70,
  },
});
