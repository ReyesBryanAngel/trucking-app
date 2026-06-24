export type TripStatus =
  | 'Pending'
  | 'Ready to Start'
  | 'In Progress'
  | 'Delivered'
  | 'Delayed';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
}

export interface Truck {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  odometer: number;
  loadType: string;
}

export interface InspectionItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface Trip {
  id: string;
  driver: Driver;
  truck: Truck;
  pickupLocation: string;
  dropOffLocation: string;
  eta: string;
  status: TripStatus;
  inspectionCompleted: boolean;
  distance: string;
  cargo: string;
  notes?: string;
  startedAt?: string;
  deliveredAt?: string;
}

export type RootStackParamList = {
  TripList: undefined;
  TripDetail: { tripId: string };
  PreTripInspection: { tripId: string };
};
