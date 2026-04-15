export type WasteType = 'general' | 'heavy' | 'plasterboard';

export interface Address {
  id: string;
  line1: string;
  city: string;
}

export interface SkipOption {
  size: string;
  price: number;
  disabled: boolean;
}

export interface BookingPayload {
  postcode: string;
  addressId: string;
  heavyWaste: boolean;
  plasterboard: boolean;
  skipSize: string;
  price: number;
}
