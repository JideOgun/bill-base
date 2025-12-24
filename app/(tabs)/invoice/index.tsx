import { View, Text } from 'react-native';
import { invoiceStyles } from '@/styles';
import type { ReactElement } from 'react';

export default function InvoiceScreen(): ReactElement {
  return (
    <View style={invoiceStyles.container}>
      <Text style={invoiceStyles.title}>Invoices</Text>
      <Text style={invoiceStyles.hint}>Start building your invoice UI here</Text>
    </View>
  );
}
