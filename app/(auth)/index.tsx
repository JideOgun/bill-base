import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { authStyles } from '@/styles';
import { signIn, signUp } from '@/services/auth';
import { loginSchema, signupSchema } from '@/utils/validation';
import type { ReactElement } from 'react';

export default function AuthScreen(): ReactElement {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    try {
      if (isSignUp) {
        signupSchema.parse({ email, password, confirmPassword });
      } else {
        loginSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Error && 'errors' in err) {
        const zodErrors = err as { errors: Array<{ path: string[]; message: string }> };
        const errorMap: Record<string, string> = {};
        zodErrors.errors.forEach(e => {
          if (e.path[0]) {
            errorMap[e.path[0]] = e.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = isSignUp ? await signUp(email, password) : await signIn(email, password);

      if (result.success) {
        router.replace('/(tabs)/invoice');
      } else {
        // Check if account doesn't exist - show special UI
        if (result.accountNotFound || result.error === 'ACCOUNT_NOT_FOUND') {
          setError('ACCOUNT_NOT_FOUND');
        } else {
          setError(result.error || 'Authentication failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={authStyles.container}>
          <Text style={authStyles.title}>BillBase</Text>
          <Text style={authStyles.subtitle}>
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </Text>

          <View style={authStyles.form}>
            <TextInput
              style={[authStyles.input, errors.email && authStyles.inputError]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}

            <TextInput
              style={[authStyles.input, errors.password && authStyles.inputError]}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}

            {isSignUp && (
              <>
                <TextInput
                  style={[authStyles.input, errors.confirmPassword && authStyles.inputError]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {errors.confirmPassword && (
                  <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
                )}
              </>
            )}

            {error && error === 'ACCOUNT_NOT_FOUND' ? (
              <View style={authStyles.accountNotFoundContainer}>
                <Text style={authStyles.accountNotFoundText}>
                  You don't have an account with this email.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  style={authStyles.createAccountButton}
                >
                  <Text style={authStyles.createAccountButtonText}>Create an account</Text>
                </TouchableOpacity>
              </View>
            ) : (
              error && <Text style={authStyles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[authStyles.button, loading && authStyles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={authStyles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMode} disabled={loading}>
              <Text style={authStyles.switchText}>
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
