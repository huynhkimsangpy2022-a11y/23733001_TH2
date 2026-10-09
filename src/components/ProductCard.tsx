import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { theme } from '../constants/theme';
import { STUDENT, PRICE_MULTIPLIER, VARIANT } from '../constants/student';
import { Product } from '../services/productApi';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice =
    Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = () => {
    if (VARIANT.hapticOnAdd === 'selection') {
      Vibration.vibrate(30);
    } else {
      Vibration.vibrate(60);
    }

    addItem(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(product)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            activeOpacity={0.7}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    margin: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
    minHeight: 34,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.primary,
  },
  addButton: {
    backgroundColor: theme.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default ProductCard;
