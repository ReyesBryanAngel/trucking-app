import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  total: number;
  inProgress: number;
  delivered: number;
  delayed: number;
}

interface Stat {
  label: string;
  value: number;
  valueColor: string;
}

const SummaryCard: React.FC<Props> = ({ total, inProgress, delivered, delayed }) => {
  const stats: Stat[] = [
    { label: 'Total', value: total, valueColor: '#FFFFFF' },
    { label: 'In Progress', value: inProgress, valueColor: '#FCD34D' },
    { label: 'Delivered', value: delivered, valueColor: '#6EE7B7' },
    { label: 'Delayed', value: delayed, valueColor: '#FCA5A5' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's Overview</Text>
      <View style={styles.grid}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.statBox}>
            <Text style={[styles.value, { color: stat.valueColor }]}>
              {stat.value}
            </Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#162D47',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#243F5C',
  },
  title: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    color: '#7BA7C8',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SummaryCard;
