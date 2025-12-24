import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeDatabase } from '@/db/schema';
import type { ReactElement } from 'react';

export default function RootLayout(): ReactElement {
  useEffect(() => {
    const init = async (): Promise<void> => {
      await initializeDatabase();
    };
    void init();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
