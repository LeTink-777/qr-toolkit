import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { Button } from '@/shared/ui/Button';

import { useGenerator } from '../model/useGenerator';
import { PayloadTypeSelector } from './PayloadTypeSelector';
import { QrPreview } from './QrPreview';
import { TextForm } from './forms/TextForm';
import { UrlForm } from './forms/UrlForm';
import { VCardForm } from './forms/VCardForm';
import { WifiForm } from './forms/WifiForm';

/** Экран генерации QR-кодов */
export function GeneratorScreen() {
  const { t } = useTranslation();
  const {
    payloadType,
    setPayloadType,
    customization,
    qrValue,
    generate,
    svgRef,
    handleSaveToGallery,
    handleShare,
  } = useGenerator();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PayloadTypeSelector selected={payloadType} onSelect={setPayloadType} />

      {/* Форма в зависимости от типа */}
      {payloadType === 'url' && <UrlForm onGenerate={generate} />}
      {payloadType === 'text' && <TextForm onGenerate={generate} />}
      {payloadType === 'wifi' && <WifiForm onGenerate={generate} />}
      {payloadType === 'vcard' && <VCardForm onGenerate={generate} />}
      {payloadType === 'email' && <UrlForm onGenerate={generate} />}
      {payloadType === 'phone' && <TextForm onGenerate={generate} />}

      {/* Превью и экспорт */}
      {qrValue && (
        <>
          <QrPreview value={qrValue} customization={customization} svgRef={svgRef} />
          <View style={styles.exportButtons}>
            <Button
              title={t('generator.saveToGallery')}
              onPress={handleSaveToGallery}
              variant="secondary"
            />
            <Button title={t('generator.shareQr')} onPress={handleShare} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing['5xl'] },
  exportButtons: { gap: spacing.sm },
});
