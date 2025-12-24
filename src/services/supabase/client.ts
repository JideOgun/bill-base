import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to get from Expo config first, then fall back to process.env (for web)
const supabaseUrl =
  (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ||
  (typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_SUPABASE_URL : undefined);
const supabaseAnonKey =
  (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ||
  (typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY : undefined);

// Platform-aware storage adapter
// Uses expo-secure-store on native, localStorage on web
const createStorageAdapter = () => {
  // Web platform - use localStorage
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string): Promise<string | null> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key);
          }
          return null;
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
          }
        } catch (error) {
          console.error('Error storing item:', error);
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(key);
          }
        } catch (error) {
          console.error('Error removing item:', error);
        }
      },
    };
  }

  // Native platform - use expo-secure-store
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error('Error storing item:', error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },
  };
};

const secureStorageAdapter = createStorageAdapter();

const getSupabaseClient = (): SupabaseClient => {
  // Validate URL format
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase.co');
    } catch {
      return false;
    }
  };

  // Validate key format - accept both old (eyJ) and new (sb_publishable_) formats
  const isValidKey = (key: string | undefined): boolean => {
    if (!key) return false;
    // Old format: JWT starting with eyJ
    if (key.startsWith('eyJ')) return true;
    // New format: publishable key starting with sb_publishable_
    if (key.startsWith('sb_publishable_')) return true;
    return false;
  };

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'your_supabase_url_here' ||
    supabaseAnonKey === 'your_supabase_anon_key_here' ||
    !isValidUrl(supabaseUrl) ||
    !isValidKey(supabaseAnonKey)
  ) {
    const errorMsg =
      '⚠️  Invalid or missing Supabase configuration. Please check your .env file:\n' +
      `  - EXPO_PUBLIC_SUPABASE_URL: ${supabaseUrl || 'NOT SET'}\n` +
      `  - EXPO_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET'}\n` +
      '  Key should start with "eyJ" (anon key) or "sb_publishable_" (publishable key)\n' +
      '  Make sure to restart your dev server after updating .env file.';

    console.error(errorMsg);

    // Return a client with placeholder values to prevent crashes
    // This allows the app to start but auth/sync features won't work
    return createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key',
      {
        auth: {
          storage: secureStorageAdapter,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    );
  }

  // Log initialization (mask sensitive data)
  const keyType = supabaseAnonKey.startsWith('sb_publishable_') ? 'publishable' : 'anon';
  console.log('✅ Supabase client initialized');
  console.log('   URL:', supabaseUrl);
  console.log('   Key type:', keyType);
  console.log('   Key preview:', supabaseAnonKey.substring(0, 25) + '...');

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: secureStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

export const supabase = getSupabaseClient();
