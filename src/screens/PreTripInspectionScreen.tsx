import React, { useState } from 'react';
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
import { RootStackParamList, InspectionItem } from '../types';
import { useTripContext } from '../context/TripContext';
import { DEFAULT_INSPECTION_ITEMS } from '../data/mockData';
import ChecklistItem from '../components/ChecklistItem';
import PrimaryButton from '../components/PrimaryButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PreTripInspection'>;
  route: RouteProp<RootStackParamList, 'PreTripInspection'>;
};

const PreTripInspectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tripId } = route.params;
  const { markInspectionComplete } = useTripContext();

  // Each visit gets a fresh checklist — state is local to this screen
  const [items, setItems] = useState<InspectionItem[]>(
    DEFAULT_INSPECTION_ITEMS.map(i => ({ ...i, checked: false })),
  );

  const checkedCount = items.filter(i => i.checked).length;
  const allChecked = checkedCount === items.length;
  const progress = checkedCount / items.length;

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleSubmit = () => {
    if (!allChecked) return;
    markInspectionComplete(tripId);
    Alert.alert(
      'Inspection Passed',
      'All items checked. Trip is now Ready to Start.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Pre-Trip Inspection</Text>
          <Text style={styles.heroSub}>Trip {tripId}</Text>
          <Text style={styles.heroCount}>
            {checkedCount} / {items.length} completed
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.instruction}>
          Tap each item to confirm it has been checked before starting your trip.
        </Text>

        {/* Checklist */}
        {items.map(item => (
          <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
        ))}

        {/* Submit */}
        <View style={styles.submitArea}>
          {!allChecked && (
            <Text style={styles.hint}>
              {items.length - checkedCount} item
              {items.length - checkedCount !== 1 ? 's' : ''} remaining
            </Text>
          )}
          <PrimaryButton
            label={allChecked ? 'Submit Inspection' : 'Complete All Items First'}
            variant="success"
            disabled={!allChecked}
            onPress={handleSubmit}
          />
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
    marginBottom: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: {
    color: '#93C5FD',
    fontSize: 13,
    marginBottom: 14,
  },
  heroCount: {
    color: '#BAC8DB',
    fontSize: 12,
    marginBottom: 8,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
  },
  fill: {
    height: 6,
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  instruction: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 20,
  },
  submitArea: {
    marginTop: 16,
  },
  hint: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 6,
  },
});

export default PreTripInspectionScreen;
