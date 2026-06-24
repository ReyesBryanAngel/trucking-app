import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { InspectionItem } from '../types';

interface Props {
  item: InspectionItem;
  onToggle: (id: string) => void;
}

const ChecklistItem: React.FC<Props> = ({ item, onToggle }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => onToggle(item.id)}
    activeOpacity={0.7}
  >
    <View style={[styles.box, item.checked && styles.boxChecked]}>
      {item.checked && <Text style={styles.tick}>✓</Text>}
    </View>
    <Text style={[styles.label, item.checked && styles.labelDone]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  tick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  labelDone: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
});

export default ChecklistItem;
