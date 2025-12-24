import { View, Text } from 'react-native';
import { clientStyles } from '@/styles';
import type { ReactElement } from 'react';

export default function ClientScreen(): ReactElement {
  return (
    <View style={clientStyles.container}>
      <Text style={clientStyles.title}>Clients</Text>
      <Text style={clientStyles.hint}>Start building your client UI here</Text>
    </View>
  );
}
