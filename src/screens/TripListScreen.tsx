import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Trip } from '../types';
import { useTripContext } from '../context/TripContext';
import { getSummary } from '../services/tripService';
import TripCard from '../components/TripCard';
import SummaryCard from '../components/SummaryCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TripList'>;
};

const TripListScreen: React.FC<Props> = ({ navigation }) => {
  const { trips } = useTripContext();
  const summary = useMemo(() => getSummary(trips), [trips]);

  const renderItem = ({ item }: { item: Trip }) => (
    <TripCard
      trip={item}
      onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A3C5E" />

      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.driverName}>Bryan Reyes</Text>
      </View>

      <FlatList
        data={trips}
        keyExtractor={trip => trip.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SummaryCard
            total={summary.total}
            inProgress={summary.inProgress}
            delivered={summary.delivered}
            delayed={summary.delayed}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No trips assigned.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1A3C5E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '500',
  },
  driverName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  list: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 15,
  },
});

export default TripListScreen;
