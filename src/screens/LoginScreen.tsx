// TH2 | 23733001 | HUỲNH KIM SANG
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../constants/theme';
import { STUDENT, VARIANT } from '../constants/student';
import { useAuthStore } from '../stores/authStore';
import { Watermark } from '../components/Watermark';

export const LoginScreen: React.FC = () => {
  const isEmail = VARIANT.authField === 'email';
  const defaultPlaceholder = isEmail
    ? `Email — ${STUDENT.mssv}@iuh.edu.vn`
    : `Phone — 09${STUDENT.mssv.slice(-8)}`;

  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    const val =
      inputValue.trim() ||
      (isEmail ? `${STUDENT.mssv}@iuh.edu.vn` : `09${STUDENT.mssv.slice(-8)}`);
    login(val);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>KTXGO</Text>
            <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldTag}>(A)</Text>
              <TextInput
                style={styles.input}
                placeholder={defaultPlaceholder}
                placeholderTextColor={theme.textLight}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType={isEmail ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>

            <Text style={styles.authStatus}>Auth Stack · chưa có token</Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.primary,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    backgroundColor: theme.background,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  fieldTag: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: theme.text,
  },
  loginButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  authStatus: {
    textAlign: 'center',
    fontSize: 11,
    color: theme.textLight,
  },
});

export default LoginScreen;
