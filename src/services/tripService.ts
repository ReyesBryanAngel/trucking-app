import { Trip, TripStatus } from '../types';

export const updateTripStatus = (
  trips: Trip[],
  tripId: string,
  newStatus: TripStatus,
  extra?: Partial<Trip>,
): Trip[] =>
  trips.map(trip =>
    trip.id === tripId ? { ...trip, status: newStatus, ...extra } : trip,
  );

export const getTripById = (trips: Trip[], tripId: string): Trip | undefined =>
  trips.find(trip => trip.id === tripId);

export const getSummary = (trips: Trip[]) => ({
  total: trips.length,
  inProgress: trips.filter(t => t.status === 'In Progress').length,
  delivered: trips.filter(t => t.status === 'Delivered').length,
  delayed: trips.filter(t => t.status === 'Delayed').length,
});
