import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { logger } from '@/shared/lib/logger';
import { err, ok, type Result } from '@/shared/lib/result';

/**
 * Сохраняет QR-код как изображение в галерею.
 *
 * @param svgDataUrl - Data URL из react-native-qrcode-svg (toDataURL)
 */
export async function saveQrToGallery(svgDataUrl: string): Promise<Result<string>> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return err(new Error('Media library permission denied'));
    }

    const fileUri = `${FileSystem.cacheDirectory ?? ''}qr-code-${Date.now()}.png`;
    const base64 = svgDataUrl.replace(/^data:image\/png;base64,/, '');

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const asset = await MediaLibrary.createAssetAsync(fileUri);
    logger.info('QR-код сохранён в галерею', { assetId: asset.id });

    return ok(asset.uri);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('Ошибка сохранения QR-кода', { error: error.message });
    return err(error);
  }
}

/**
 * Поделиться QR-кодом через системный share sheet.
 */
export async function shareQr(svgDataUrl: string): Promise<Result<void>> {
  try {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      return err(new Error('Sharing not available'));
    }

    const fileUri = `${FileSystem.cacheDirectory ?? ''}qr-code-share-${Date.now()}.png`;
    const base64 = svgDataUrl.replace(/^data:image\/png;base64,/, '');

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'image/png',
      dialogTitle: 'QR Code',
    });

    return ok(undefined);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    logger.error('Ошибка при share QR-кода', { error: error.message });
    return err(error);
  }
}
