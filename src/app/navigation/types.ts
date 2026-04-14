import type { NavigatorScreenParams } from '@react-navigation/native';

/** Параметры нижних табов */
export type TabParamList = {
  Scanner: undefined;
  Generator: undefined;
  History: undefined;
  Settings: undefined;
};

/** Параметры корневого стека */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};

/**
 * Расширение глобальных типов для useNavigation().
 * Позволяет использовать типизированную навигацию без дополнительных обёрток.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
