import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Variant = 'primary' | 'success' | 'danger' | 'warning';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
}

const BG: Record<Variant, string> = {
  primary: '#1A3C5E',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',
};

const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  loading = false,
  style,
}) => (
  <TouchableOpacity
    style={[styles.btn, { backgroundColor: disabled ? '#D1D5DB' : BG[variant] }, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    {loading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <Text style={styles.label}>{label}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default PrimaryButton;
