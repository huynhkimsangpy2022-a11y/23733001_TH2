import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { VARIANT } from '../constants/student';
import { useCartStore } from '../stores/cartStore';

import ShopStack from './ShopStack';
import { CartScreen } from '../screens/CartScreen';
import { MeScreen } from '../screens/MeScreen';

const Tab = createBottomTabNavigator();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {VARIANT.tabOrder === 'cartFirst' ? (
        <>
          <Tab.Screen
            name="CartTab"
            component={CartScreen}
            options={{
              tabBarLabel: 'Giỏ',
              tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
              tabBarBadgeStyle: {
                backgroundColor: theme.secondary,
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 'bold',
              },
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🧺</Text>
              ),
            }}
          />
          <Tab.Screen
            name="ShopTab"
            component={ShopStack}
            options={{
              tabBarLabel: 'Cửa hàng',
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🛍️</Text>
              ),
            }}
          />
          <Tab.Screen
            name="MeTab"
            component={MeScreen}
            options={{
              tabBarLabel: 'Tôi',
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🧑‍🎓</Text>
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="ShopTab"
            component={ShopStack}
            options={{
              tabBarLabel: 'Cửa hàng',
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🛍️</Text>
              ),
            }}
          />
          <Tab.Screen
            name="CartTab"
            component={CartScreen}
            options={{
              tabBarLabel: 'Giỏ',
              tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
              tabBarBadgeStyle: {
                backgroundColor: theme.secondary,
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 'bold',
              },
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🧺</Text>
              ),
            }}
          />
          <Tab.Screen
            name="MeTab"
            component={MeScreen}
            options={{
              tabBarLabel: 'Tôi',
              tabBarIcon: () => (
                <Text style={styles.tabIcon}>🧑‍🎓</Text>
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

export default MainTabs;
