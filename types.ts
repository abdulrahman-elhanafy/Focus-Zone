export type Role = 'receptionist' | 'owner' | 'accountant' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface Customer {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_age: number;
  customer_gender: 'male' | 'female';
  customer_membership: 'daily' | 'weekly' | 'monthly';
  customer_last_visit: string;
  customer_balance: number;
}

export interface Employee {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_phone: string;
  employee_role: 'Manager' | 'Supervisor' | 'Reception' | 'Cashier' | 'HR' | 'Cleaner';
  employee_salary: number;
  employee_shift: 'Morning' | 'Evening' | 'Night';
  employee_hire_date: string;
  employee_status: 'Active' | 'Inactive';
}

export interface Room {
  room_id: string;
  room_name: string;
  room_type: 'VIP' | 'Meeting' | 'Office' | 'Gaming';
  room_capacity: number;
  room_status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  price_per_hour?: number;
  price_per_day?: number;
}

export interface Booking {
  booking_id: string;
  customer_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  created_at?: string;
}

export interface Session {
  session_id: string;
  customer_id: string;
  room_id: string;
  booking_id: string | null;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed' | 'cancelled';
}

export interface SessionItem {
  id: number;
  session_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
}

export interface Item {
  item_id: string;
  item_name: string;
  item_price: number;
  item_stock: number;
  item_category: 'Drinks' | 'Snacks' | 'Food';
}

export interface Payment {
  payment_id: string;
  session_id: string;
  room_amount: number;
  items_amount: number;
  total_amount: number;
  payment_method: 'Cash' | 'Visa' | 'Wallet';
  payment_status: 'Paid' | 'Pending' | 'Cancelled' | 'Refunded';
  paid_at: string | null;
}

export interface Transaction {
  transaction_id: string;
  booking_id: string | null;
  session_id: string | null;
  customer_id: string | null;
  transaction_date: string;
  transaction_description: string;
  transaction_category: 'Booking' | 'Expense' | 'Refund';
  transaction_amount: number;
  transaction_method: 'Cash' | 'Visa' | 'Wallet';
  created_at?: string;
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
