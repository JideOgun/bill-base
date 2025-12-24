import { View, Text } from 'react-native';
import { authStyles } from '@/styles';
import type { ReactElement } from 'react';

export default function AuthScreen(): ReactElement {
  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>BillBase</Text>
      <Text style={authStyles.subtitle}>Authentication Screen</Text>
      <Text style={authStyles.hint}>Start building your UI here</Text>
    </View>
  );
}
