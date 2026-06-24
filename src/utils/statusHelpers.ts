import { TripStatus } from '../types';

export const STATUS_COLORS: Record<TripStatus, { bg: string; text: string }> = {
  Pending: { bg: '#EFF6FF', text: '#1D4ED8' },
  'Ready to Start': { bg: '#ECFDF5', text: '#065F46' },
  'In Progress': { bg: '#FFF7ED', text: '#C2410C' },
  Delivered: { bg: '#F0FDF4', text: '#15803D' },
  Delayed: { bg: '#FEF2F2', text: '#B91C1C' },
};

export const formatETA = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const canInspect = (status: TripStatus): boolean => status === 'Pending';
export const canStartTrip = (status: TripStatus): boolean => status === 'Ready to Start';
export const canDeliver = (status: TripStatus): boolean => status === 'In Progress';
export const canReportDelay = (status: TripStatus): boolean => status === 'In Progress';
export const canReset = (status: TripStatus): boolean => status !== 'Pending';
