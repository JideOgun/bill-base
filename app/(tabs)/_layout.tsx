import { Tabs } from 'expo-router';
import type { ReactElement } from 'react';

export default function TabsLayout(): ReactElement {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="invoice" />
      <Tabs.Screen name="client" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
