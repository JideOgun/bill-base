import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  accountNotFoundContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  accountNotFoundText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
