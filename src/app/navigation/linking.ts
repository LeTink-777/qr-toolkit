import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Конфигурация Deep Linking */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['qrtoolkit://', 'https://qrtoolkit.app'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Scanner: 'scan',
          Generator: 'generate',
          History: 'history',
          Settings: 'settings',
        },
      },
    },
  },
};
