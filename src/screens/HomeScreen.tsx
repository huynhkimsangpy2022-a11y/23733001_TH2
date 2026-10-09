// TH2 | 23733001 | HUỲNH KIM SANG
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../constants/theme';
import {
  STUDENT,
  DEBOUNCE_MS,
  STALE_TIME_MS,
  ROOM_LABEL,
  VARIANT,
} from '../constants/student';
import { getProducts, Product } from '../services/productApi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ProductCard } from '../components/ProductCard';
import { Watermark } from '../components/Watermark';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, DEBOUNCE_MS);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [products, debouncedSearch]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('Detail', { id: String(product.id) });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header (A) */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerBrand}>KTXGO</Text>
          <Text style={styles.headerRoom}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <Text style={styles.sectionTag}>(A)</Text>
      </View>

      {/* Search Input (B) */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
            placeholderTextColor={theme.textLight}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
          <Text style={styles.searchTag}>(B)</Text>
        </View>
      </View>

      {/* FlashList 2 cột (C) hoặc 3 cảnh mạng */}
      <View style={styles.listContainer}>
        {isLoading ? (
          // Cảnh mạng 1: Đang tải
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Đang tải món...</Text>
          </View>
        ) : isError ? (
          // Cảnh mạng 2: Lỗi mạng
          <View style={styles.centerBox}>
            <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
            <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Cảnh mạng 3: Có dữ liệu
          <View style={{ flex: 1 }}>
            <View style={styles.listTagRow}>
              <Text style={styles.listTag}>(C) FlashList ×2</Text>
            </View>
            <FlashList
              data={filteredProducts}
              numColumns={2}
              estimatedItemSize={220}
              keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={handleProductPress}
                />
              )}
              refreshing={isRefetching}
              onRefresh={refetch}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.centerBox}>
                  <Text style={styles.emptyText}>Không tìm thấy món phù hợp</Text>
                </View>
              }
            />
          </View>
        )}
      </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.primary,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerRoom: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 1,
    textAlign: 'center',
  },
  sectionTag: {
    position: 'absolute',
    right: 16,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: theme.text,
  },
  searchTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primary,
    marginLeft: 6,
  },
  listContainer: {
    flex: 1,
  },
  listTagRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
  },
  listTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textLight,
  },
  listContent: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.textLight,
  },
  errorMssv: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.error,
    marginBottom: 8,
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
  emptyText: {
    fontSize: 14,
    color: theme.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;
