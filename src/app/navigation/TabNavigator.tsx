import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { GeneratorScreen } from '@/features/generator';
import { HistoryScreen } from '@/features/history';
import { ScannerScreen } from '@/features/scanner';
import { SettingsScreen } from '@/features/settings/ui/SettingsScreen';

import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

/** Нижняя панель табов */
export function TabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          title: t('tabs.scanner'),
          tabBarLabel: t('tabs.scanner'),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Generator"
        component={GeneratorScreen}
        options={{
          title: t('tabs.generator'),
          tabBarLabel: t('tabs.generator'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: t('tabs.history'),
          tabBarLabel: t('tabs.history'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('tabs.settings'),
          tabBarLabel: t('tabs.settings'),
        }}
      />
    </Tab.Navigator>
  );
}
