import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import { STUDENT, BASE_SHIP_FEE, VARIANT } from '../constants/student';
import { useCartStore } from '../stores/cartStore';

// Tọa độ Cổng KTX IUH cố định
export const KTX_GATE_LOCATION = {
  latitude: 10.822363,
  longitude: 106.687352,
};

// Hàm tính khoảng cách theo công thức Haversine (km)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Bán kính Trái Đất (km)

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Làm tròn 1 chữ số thập phân
}

// Tính phí ship theo công thức A hoặc B của VARIANT
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    // Formula B: BASE_SHIP_FEE + Math.round(km * 1500) + 2000
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export function useCampusLocation() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [distance, setDistance] = useState<number | null>(null);
  const [shippingFee, setLocalShippingFee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setStoreShippingFee = useCartStore((state) => state.setShippingFee);
  const setStoreDistanceKm = useCartStore((state) => state.setDistanceKm);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    try {
      let isGranted = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: `KTXGo [${STUDENT.mssv}] Cần quyền vị trí`,
            message:
              'KTXGo cần quyền vị trí để ước tính khoảng cách và tính phí giao hàng tận phòng ký túc xá.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          isGranted = true;
          setStatus('granted');
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked');
          Alert.alert(
            'Quyền vị trí bị chặn',
            'Bạn đã chặn quyền vị trí. Vui lòng mở Cài đặt để cấp quyền cho KTXGo.',
            [
              { text: 'Để sau', style: 'cancel' },
              { text: 'Mở Cài đặt', onPress: openSettings },
            ]
          );
        } else {
          setStatus('denied');
        }
      } else {
        isGranted = true;
        setStatus('granted');
      }

      if (isGranted) {
        // Mock toạ độ máy ảo
        const mockCurrentLocation = {
          latitude: 10.831500,
          longitude: 106.692500,
        };

        const dist = calculateHaversineDistance(
          mockCurrentLocation.latitude,
          mockCurrentLocation.longitude,
          KTX_GATE_LOCATION.latitude,
          KTX_GATE_LOCATION.longitude
        );

        const fee = calculateShipFee(dist);

        setDistance(dist);
        setLocalShippingFee(fee);
        setStoreDistanceKm(dist);
        setStoreShippingFee(fee);
      }
    } catch (err) {
      console.warn('Lỗi khi xin quyền vị trí:', err);
      setStatus('denied');
    } finally {
      setLoading(false);
    }
  }, [openSettings, setStoreDistanceKm, setStoreShippingFee]);

  return {
    status,
    distance,
    shippingFee,
    loading,
    requestLocation,
    openSettings,
    setStatus,
  };
}

export default useCampusLocation;
