import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TripStatus } from '../types';
import { STATUS_COLORS } from '../utils/statusHelpers';

interface Props {
  status: TripStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const { bg, text } = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
