
export type Role = 'receptionist' | 'owner' | 'accountant' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'Private Office' | 'Meeting Room' | 'Hot Desk' | 'Conference Hall';
  capacity: number;
  pricePerHour: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  nextAvailable?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female';
  membership: 'Basic' | 'Premium' | 'Enterprise';
  lastVisit: string;
  balance: number;
}

export interface Session {
  id: string;
  customerId: string;
  roomId: string;
  bookingId?: string | null;
  startTime: string;
  endTime?: string | null;
  status: 'active' | 'closed';
}

export interface SessionItem {
  id: number;
  sessionId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
}

export interface Payment {
  id: string;
  sessionId: string;
  roomAmount: number;
  itemsAmount: number;
  totalAmount: number;
  method: 'Cash' | 'Card' | 'Transfer';
  status: 'pending' | 'paid' | 'refunded';
  paidAt?: string | null;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  customerName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  totalAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Income' | 'Expense';
  amount: number;
  method: 'Card' | 'Cash' | 'Transfer';
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: 'Drink' | 'Snack' | 'Office Supply' | 'Service';
}

// Navigation keys
export type ScreenName = 
  | 'login'
  | 'dashboard_reception'
  | 'dashboard_owner'
  | 'dashboard_accountant'
  | 'make_booking'
  | 'check_in'
  | 'check_out'
  | 'rooms_mgmt'
  | 'customers'
  | 'services'
  | 'reports'
  | 'settings'
  | 'expenses';
