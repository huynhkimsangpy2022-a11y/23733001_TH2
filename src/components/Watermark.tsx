import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp } from '../constants/student';
import { theme } from '../constants/theme';

interface WatermarkProps {
  style?: object;
}

export const Watermark: React.FC<WatermarkProps> = ({ style }) => {
  const stamp = examStamp();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text} numberOfLines={1}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 0.5,
  },
});

export default Watermark;
