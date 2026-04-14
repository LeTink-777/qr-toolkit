import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_PROD = process.env.APP_ENV === 'production';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? 'QR Toolkit' : 'QR Toolkit (Dev)',
  slug: 'qr-toolkit',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icons/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_PROD ? 'com.qrtoolkit.app' : 'com.qrtoolkit.app.dev',
    infoPlist: {
      NSCameraUsageDescription: 'Камера используется для сканирования QR-кодов',
      NSPhotoLibraryAddUsageDescription: 'Доступ к галерее для сохранения сгенерированных QR-кодов',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#0A0A0A',
    },
    package: IS_PROD ? 'com.qrtoolkit.app' : 'com.qrtoolkit.app.dev',
    permissions: ['android.permission.CAMERA'],
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Камера используется для сканирования QR-кодов',
      },
    ],
    'expo-secure-store',
    'expo-sqlite',
    [
      'expo-media-library',
      {
        photosPermission: 'Доступ к галерее для сохранения QR-кодов',
        savePhotosPermission: 'Сохранение сгенерированных QR-кодов в галерею',
      },
    ],
    'expo-screen-capture',
  ],
  experiments: {
    typedRoutes: true,
  },
});
