import { supabase } from '../supabase/client';
import type { AuthResult } from '@/types';

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide user-friendly error messages
      let errorMessage = error.message;
      let isAccountNotFound = false;

      // Check for account not found FIRST - before network errors
      // Supabase returns "Invalid login credentials" for both wrong password and non-existent account
      if (
        error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid') ||
        error.status === 400 ||
        error.message.toLowerCase().includes('user not found') ||
        error.message.toLowerCase().includes('email not found')
      ) {
        // For security, Supabase doesn't distinguish between wrong password and non-existent account
        // But we can show a helpful message offering to create an account
        isAccountNotFound = true;
        errorMessage = 'ACCOUNT_NOT_FOUND';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please wait a moment and try again.';
      } else if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')
      ) {
        // If we get a network error during sign in with credentials provided,
        // it might be because Supabase isn't configured or account doesn't exist
        // Show account not found to guide user to create account
        if (email && password) {
          isAccountNotFound = true;
          errorMessage = 'ACCOUNT_NOT_FOUND';
        } else {
          errorMessage = 'Unable to connect. Please check your internet connection and try again.';
        }
      }

      return {
        success: false,
        error: errorMessage,
        accountNotFound: isAccountNotFound,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Unable to sign in. Please try again.',
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
      },
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let isAccountNotFound = false;

    if (error instanceof Error) {
      // Check for invalid credentials first, even in catch block
      if (
        error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid') ||
        error.message.toLowerCase().includes('user not found') ||
        error.message.toLowerCase().includes('email not found')
      ) {
        isAccountNotFound = true;
        errorMessage = 'ACCOUNT_NOT_FOUND';
      } else if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')
      ) {
        errorMessage = 'Unable to connect. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
      accountNotFound: isAccountNotFound,
    };
  }
};

export const signUp = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Provide user-friendly error messages
      let errorMessage = error.message;

      if (
        error.message.includes('already registered') ||
        error.message.includes('already exists')
      ) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('ERR_NAME_NOT_RESOLVED') ||
        error.message.includes('Failed to fetch')
      ) {
        errorMessage =
          'Unable to connect to Supabase. Please check:\n' +
          '1. Your internet connection\n' +
          '2. Your Supabase URL in .env file\n' +
          '3. Restart your dev server after updating .env';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please wait a moment and try again.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Unable to create account. Please try again.',
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
      },
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error instanceof Error) {
      if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('ERR_NAME_NOT_RESOLVED') ||
        error.message.includes('Failed to fetch')
      ) {
        errorMessage =
          'Unable to connect to Supabase. Please check:\n' +
          '1. Your internet connection\n' +
          '2. Your Supabase URL in .env file\n' +
          '3. Restart your dev server after updating .env';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<{ id: string; email: string } | null> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }
  return {
    id: data.user.id,
    email: data.user.email ?? '',
  };
};
