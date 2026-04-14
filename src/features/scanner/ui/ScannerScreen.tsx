import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView } from 'expo-camera';
import type GorhomBottomSheet from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Text } from '@/shared/ui/Text';

import { useScanner } from '../model/useScanner';
import { PermissionDenied } from './PermissionDenied';
import { ScannerOverlay } from './ScannerOverlay';
import { ScanResultSheet } from './ScanResultSheet';

/** Экран сканера QR-кодов */
export function ScannerScreen() {
  const { t } = useTranslation();
  const {
    permission,
    status,
    lastPayload,
    onBarcodeScanned,
    resetResult,
    copyToClipboard,
    openUrl,
  } = useScanner();
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.close();
    resetResult();
  }, [resetResult]);

  // Если нет разрешения — показываем экран запроса
  if (!permission.isGranted) {
    return (
      <PermissionDenied
        onRequestPermission={() => void permission.request()}
        isDenied={permission.isDenied}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={status === 'scanning' ? onBarcodeScanned : undefined}
      />

      <ScannerOverlay />

      {/* Подсказка */}
      <View style={styles.hintContainer}>
        <Text variant="subhead" color="#FFFFFF" style={styles.hint}>
          {t('scanner.scanning')}
        </Text>
      </View>

      {/* Bottom sheet с результатом */}
      {lastPayload && (
        <BottomSheet ref={bottomSheetRef} snapPoints={['45%']} onClose={handleDismiss}>
          <ScanResultSheet
            payload={lastPayload}
            onCopy={copyToClipboard}
            onOpenUrl={openUrl}
            onDismiss={handleDismiss}
          />
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hint: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
