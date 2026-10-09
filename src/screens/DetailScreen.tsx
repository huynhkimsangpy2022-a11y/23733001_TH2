// TH2 | 23733001 | HUỲNH KIM SANG
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Vibration,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { theme } from '../constants/theme';
import { STUDENT, PRICE_MULTIPLIER, VARIANT } from '../constants/student';
import { getProductById, Product } from '../services/productApi';
import { useCartStore } from '../stores/cartStore';
import { Watermark } from '../components/Watermark';

export const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const productId = route.params?.id;

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (!product) return;

    if (VARIANT.hapticOnAdd === 'selection') {
      Vibration.vibrate(30);
    } else {
      Vibration.vibrate(60);
    }

    addItem(product);

    Alert.alert(
      `KTXGo · ${STUDENT.mssv}`,
      `Đã thêm "${product.title}" vào giỏ hàng!`,
    );
  };

  const formattedPrice = product
    ? Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ'
    : '0 đ';

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.stackTag}>Stack</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Không thể tải chi tiết sản phẩm.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>

            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>
                Giao nội khu · nhận tận phòng
              </Text>
            </View>

            <Text style={styles.description} numberOfLines={5}>
              {product.description}
            </Text>

            <Text style={styles.debugId}>
              ID sản phẩm: {productId}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>🛒 Thêm vào giỏ · Haptic ({VARIANT.hapticOnAdd})</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.primary,
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  stackTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.textLight,
  },
  errorText: {
    fontSize: 14,
    color: theme.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    paddingBottom: 32,
  },
  imageCard: {
    backgroundColor: theme.surface,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  detailsBox: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.primary,
    marginBottom: 12,
  },
  deliveryBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  deliveryText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: theme.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  debugId: {
    fontSize: 11,
    color: theme.textLight,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DetailScreen;
