import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trip, TripStatus } from '../types';
import { MOCK_TRIPS } from '../data/mockData';
import { updateTripStatus } from '../services/tripService';

interface TripContextValue {
  trips: Trip[];
  updateStatus: (tripId: string, status: TripStatus, extra?: Partial<Trip>) => void;
  markInspectionComplete: (tripId: string) => void;
  resetTrip: (tripId: string) => void;
}

const TripContext = createContext<TripContextValue | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);

  const updateStatus = (
    tripId: string,
    status: TripStatus,
    extra?: Partial<Trip>,
  ) => {
    setTrips(prev => updateTripStatus(prev, tripId, status, extra));
  };

  const markInspectionComplete = (tripId: string) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? { ...trip, inspectionCompleted: true, status: 'Ready to Start' }
          : trip,
      ),
    );
  };

  const resetTrip = (tripId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== tripId) return trip;
        const { startedAt, deliveredAt, ...rest } = trip;
        return { ...rest, status: 'Pending', inspectionCompleted: false };
      }),
    );
  };

  return (
    <TripContext.Provider value={{ trips, updateStatus, markInspectionComplete, resetTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = (): TripContextValue => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used inside <TripProvider>');
  return ctx;
};
