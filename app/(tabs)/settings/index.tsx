import { View, Text } from 'react-native';
import { settingsStyles } from '@/styles';
import type { ReactElement } from 'react';

export default function SettingsScreen(): ReactElement {
  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.title}>Settings</Text>
      <Text style={settingsStyles.hint}>Start building your settings UI here</Text>
    </View>
  );
}
