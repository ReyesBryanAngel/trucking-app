import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trip } from '../types';
import StatusBadge from './StatusBadge';
import { formatETA } from '../utils/statusHelpers';

interface Props {
  trip: Trip;
  onPress: () => void;
}

const TripCard: React.FC<Props> = ({ trip, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    {/* Header row */}
    <View style={styles.header}>
      <Text style={styles.tripId}>{trip.id}</Text>
      <StatusBadge status={trip.status} />
    </View>

    {/* Plate chip */}
    <View style={styles.plateRow}>
      <Text style={styles.plateChipLabel}>Truck</Text>
      <Text style={styles.plateChip}>{trip.truck.plateNumber}</Text>
    </View>

    {/* Route visualiser */}
    <View style={styles.route}>
      <View style={styles.routeStop}>
        <View style={[styles.dot, styles.dotFrom]} />
        <Text style={styles.routeText} numberOfLines={1}>{trip.pickupLocation}</Text>
      </View>
      <View style={styles.routeLine} />
      <View style={styles.routeStop}>
        <View style={[styles.dot, styles.dotTo]} />
        <Text style={styles.routeText} numberOfLines={1}>{trip.dropOffLocation}</Text>
      </View>
    </View>

    {/* Footer */}
    <View style={styles.footer}>
      <Text style={styles.cargo} numberOfLines={1}>📦 {trip.cargo}</Text>
      <Text style={styles.eta}>ETA {formatETA(trip.eta)}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3C5E',
    letterSpacing: 0.5,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  plateChipLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  plateChip: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A2E',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
  },
  route: {
    marginBottom: 12,
  },
  routeStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeLine: {
    width: 2,
    height: 14,
    backgroundColor: '#E5E7EB',
    marginLeft: 7,
    marginVertical: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFrom: { backgroundColor: '#3B82F6' },
  dotTo: { backgroundColor: '#F97316' },
  routeText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cargo: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  eta: {
    fontSize: 12,
    color: '#1A3C5E',
    fontWeight: '600',
  },
});

export default TripCard;
