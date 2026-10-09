// TH2 | 23733001 | HUỲNH KIM SANG
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { theme } from '../constants/theme';
import { STUDENT, ROOM_LABEL, PRICE_MULTIPLIER, VARIANT } from '../constants/student';
import { useCartStore } from '../stores/cartStore';
import { Watermark } from '../components/Watermark';

export const CartScreen: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const shippingFee = useCartStore((state) => state.shippingFee);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);

  const subtotal = getTotalAmount();
  const currentShipFee = shippingFee !== null ? shippingFee : 0;
  const grandTotal = subtotal + currentShipFee;

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 GIỎ HÀNG</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
            <Text style={styles.emptySubText}>Hãy thêm món từ cửa hàng!</Text>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item) => {
              const itemTotal =
                Math.round(item.price * PRICE_MULTIPLIER) * item.quantity;
              const formattedItemTotal = itemTotal.toLocaleString('vi-VN') + ' đ';

              return (
                <View key={`${STUDENT.mssv}-cart-${item.id}`} style={styles.cartCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemPriceDetail}>
                      ×{item.quantity}  {formattedItemTotal}
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => changeQty(item.id, -1)}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyNumber}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => changeQty(item.id, 1)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Thông tin giao hàng & Phí ship */}
        <View style={styles.deliveryBox}>
          <Text style={styles.roomText}>📍 Giao đến {ROOM_LABEL}</Text>
          <Text style={styles.shipFeeText}>
            Phí ship:{' '}
            {shippingFee !== null
              ? `${shippingFee.toLocaleString('vi-VN')} đ`
              : 'Chưa ước tính (vào tab Tôi)'}{' '}
            <Text style={styles.formulaText}>(công thức {VARIANT.shipFormula})</Text>
          </Text>
        </View>

        {/* Tổng thanh toán */}
        {items.length > 0 && (
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tiền hàng:</Text>
              <Text style={styles.totalValue}>{subtotal.toLocaleString('vi-VN')} đ</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Phí ship:</Text>
              <Text style={styles.totalValue}>
                {shippingFee !== null ? `${shippingFee.toLocaleString('vi-VN')} đ` : '---'}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.grandTotalValue}>
                {grandTotal.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        )}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: theme.textLight,
  },
  itemList: {
    marginBottom: 12,
  },
  cartCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  itemPriceDetail: {
    fontSize: 13,
    color: theme.primary,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: theme.primary,
  },
  qtyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  qtyNumber: {
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: theme.error,
    fontSize: 14,
    fontWeight: '700',
  },
  deliveryBox: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  roomText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
  },
  shipFeeText: {
    fontSize: 13,
    color: theme.textLight,
  },
  formulaText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '600',
  },
  totalBox: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.textLight,
  },
  totalValue: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.primary,
  },
});

export default CartScreen;
