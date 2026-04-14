import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/shared/theme/spacing';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

interface PermissionDeniedProps {
  /** Callback для повторного запроса разрешения */
  onRequestPermission: () => void;
  /** Статус: undetermined — можно запросить, denied — только настройки */
  isDenied: boolean;
}

/** Экран при отсутствии разрешения на камеру */
export function PermissionDenied({ onRequestPermission, isDenied }: PermissionDeniedProps) {
  const { t } = useTranslation();

  const handleOpenSettings = () => {
    void Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text variant="title2" style={styles.title}>
        {t('scanner.permissionTitle')}
      </Text>
      <Text variant="body" color="#8E8E93" style={styles.message}>
        {t('scanner.permissionMessage')}
      </Text>
      {isDenied ? (
        <Button title={t('scanner.permissionButton')} onPress={handleOpenSettings} />
      ) : (
        <Button title={t('scanner.grantPermission')} onPress={onRequestPermission} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
    backgroundColor: '#000000',
  },
  title: {
    color: '#FFFFFF',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
});
