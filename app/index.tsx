import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getCurrentUser } from '@/services/auth';
import { commonStyles } from '@/styles';
import type { ReactElement } from 'react';

export default function Index(): ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(user !== null);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    void checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={commonStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/invoice" />;
  }

  return <Redirect href="/(auth)" />;
}
