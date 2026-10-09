// TH2 | 23733001 | HUỲNH KIM SANG
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../constants/theme';
import { STUDENT, examStamp, VARIANT } from '../constants/student';
import { useAuthStore } from '../stores/authStore';
import { useCampusLocation } from '../hooks/useCampusLocation';
import { Watermark } from '../components/Watermark';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const {
    status,
    distance,
    shippingFee,
    loading,
    requestLocation,
    openSettings,
  } = useCampusLocation();

  const stamp = examStamp();

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 TÔI · LOCATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card thông tin sinh viên */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {STUDENT.hoTen.split(' ').pop()?.charAt(0) || 'K'}
            </Text>
          </View>
          <Text style={styles.nameText}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentIdText}>
            {STUDENT.mssv} · #{stamp}
          </Text>
          {token && (
            <View style={styles.tokenBadge}>
              <Text style={styles.tokenText} numberOfLines={1}>
                {token}
              </Text>
            </View>
          )}
        </View>

        {/* Thông tin vị trí và phí ship */}
        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>📍 Vị trí & Phí ship</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Quyền vị trí:</Text>
            <Text
              style={[
                styles.valueStatus,
                status === 'granted'
                  ? styles.statusGranted
                  : status === 'blocked'
                  ? styles.statusBlocked
                  : styles.statusOther,
              ]}
            >
              {status}
            </Text>
          </View>

          {distance !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Khoảng cách:</Text>
              <Text style={styles.valueText}>≈ {distance} km tới cổng KTX</Text>
            </View>
          )}

          <View style={styles.feeSection}>
            <Text style={styles.feeLabel}>Phí ship ước tính</Text>
            <Text style={styles.feeValue}>
              {shippingFee !== null
                ? `${shippingFee.toLocaleString('vi-VN')} đ`
                : '--- đ'}
            </Text>
          </View>
        </View>

        {/* Các nút chức năng */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestLocation}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                📡 Lấy vị trí ước tính ship
              </Text>
            )}
          </TouchableOpacity>

          {status === 'blocked' && (
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={openSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.outlineButtonText}>⚙️ Mở Cài đặt (blocked)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>🚪 Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  studentIdText: {
    fontSize: 13,
    color: theme.textLight,
    fontWeight: '600',
    marginBottom: 10,
  },
  tokenBadge: {
    backgroundColor: theme.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.border,
    maxWidth: '100%',
  },
  tokenText: {
    fontSize: 11,
    color: theme.primary,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: theme.textLight,
    fontWeight: '500',
  },
  valueStatus: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusGranted: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },
  statusBlocked: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  statusOther: {
    backgroundColor: '#FEF9C3',
    color: '#CA8A04',
  },
  valueText: {
    fontSize: 13,
    color: theme.text,
    fontWeight: '600',
  },
  feeSection: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 4,
  },
  feeValue: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.primary,
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: theme.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: theme.error,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MeScreen;
