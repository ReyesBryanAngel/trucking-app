import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTripContext } from '../context/TripContext';
import { getTripById } from '../services/tripService';
import {
  canInspect,
  canStartTrip,
  canDeliver,
  canReportDelay,
  canReset,
  formatETA,
} from '../utils/statusHelpers';
import StatusBadge from '../components/StatusBadge';
import PrimaryButton from '../components/PrimaryButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;
  route: RouteProp<RootStackParamList, 'TripDetail'>;
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const TripDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tripId } = route.params;
  const { trips, updateStatus, resetTrip } = useTripContext();
  const trip = getTripById(trips, tripId);

  if (!trip) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  const handleStartTrip = () => {
    updateStatus(trip.id, 'In Progress', { startedAt: new Date().toISOString() });
  };

  const handleDeliver = () => {
    Alert.alert('Confirm Delivery', 'Mark this trip as Delivered?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delivered',
        onPress: () =>
          updateStatus(trip.id, 'Delivered', {
            deliveredAt: new Date().toISOString(),
          }),
      },
    ]);
  };

  const handleReportDelay = () => {
    Alert.alert('Report Delay', 'This trip will be marked as Delayed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: () => updateStatus(trip.id, 'Delayed'),
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Trip',
      'This will reset the trip back to Pending and clear all progress. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetTrip(trip.id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroId}>{trip.id}</Text>
            <StatusBadge status={trip.status} />
          </View>
          <Text style={styles.heroRoute}>
            {trip.pickupLocation}
          </Text>
          <Text style={styles.heroArrow}>↓</Text>
          <Text style={styles.heroRoute}>
            {trip.dropOffLocation}
          </Text>
          <Text style={styles.heroEta}>ETA  {formatETA(trip.eta)}</Text>
          {trip.notes ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>⚠  {trip.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Truck & driver */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truck & Driver</Text>
          <InfoRow label="Plate Number" value={trip.truck.plateNumber} />
          <InfoRow
            label="Truck"
            value={`${trip.truck.year} ${trip.truck.model}`}
          />
          <InfoRow label="Driver" value={trip.driver.name} />
          <InfoRow label="License No." value={trip.driver.licenseNumber} />
          <InfoRow
            label="Odometer"
            value={`${trip.truck.odometer.toLocaleString()} km`}
          />
          <InfoRow label="Load Type" value={trip.truck.loadType} />
        </View>

        {/* Cargo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cargo Details</Text>
          <InfoRow label="Description" value={trip.cargo} />
          <InfoRow label="Distance" value={trip.distance} />
          {trip.startedAt ? (
            <InfoRow
              label="Started"
              value={new Date(trip.startedAt).toLocaleString('en-PH')}
            />
          ) : null}
          {trip.deliveredAt ? (
            <InfoRow
              label="Delivered"
              value={new Date(trip.deliveredAt).toLocaleString('en-PH')}
            />
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {canInspect(trip.status) && (
            <PrimaryButton
              label="Start Pre-Trip Inspection"
              variant="primary"
              onPress={() =>
                navigation.navigate('PreTripInspection', { tripId: trip.id })
              }
            />
          )}
          {canStartTrip(trip.status) && (
            <PrimaryButton
              label="Start Trip"
              variant="success"
              onPress={handleStartTrip}
            />
          )}
          {canDeliver(trip.status) && (
            <PrimaryButton
              label="Mark as Delivered"
              variant="success"
              onPress={handleDeliver}
            />
          )}
          {canReportDelay(trip.status) && (
            <PrimaryButton
              label="Report Delay"
              variant="warning"
              onPress={handleReportDelay}
            />
          )}
          {canReset(trip.status) && (
            <PrimaryButton
              label="Reset to Pending"
              variant="danger"
              onPress={handleReset}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#1A3C5E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroId: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  heroRoute: {
    color: '#BAC8DB',
    fontSize: 13,
    lineHeight: 20,
  },
  heroArrow: {
    color: '#3B82F6',
    fontSize: 16,
    marginVertical: 2,
    marginLeft: 2,
  },
  heroEta: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  noteBox: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  noteText: {
    color: '#FDE68A',
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '600',
    maxWidth: '58%',
    textAlign: 'right',
  },
  actions: {
    marginTop: 4,
  },
  errorText: {
    padding: 20,
    fontSize: 16,
    color: '#DC2626',
  },
});

export default TripDetailScreen;
