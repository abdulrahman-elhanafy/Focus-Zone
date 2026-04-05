
import { Room, Customer, Booking, ServiceItem, Transaction } from './types';

export const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'Meeting Room A', type: 'Meeting Room', capacity: 6, pricePerHour: 25, status: 'available', nextAvailable: 'Now' },
  { id: '2', name: 'Private Office 101', type: 'Private Office', capacity: 2, pricePerHour: 40, status: 'occupied', nextAvailable: '14:00' },
  { id: '3', name: 'Hot Desk Area', type: 'Hot Desk', capacity: 20, pricePerHour: 5, status: 'available', nextAvailable: 'Now' },
  { id: '4', name: 'Conf. Hall Alpha', type: 'Conference Hall', capacity: 50, pricePerHour: 150, status: 'reserved', nextAvailable: 'Tomorrow' },
  { id: '5', name: 'Zoom Pod 1', type: 'Private Office', capacity: 1, pricePerHour: 15, status: 'maintenance' },
  { id: '6', name: 'Creative Studio', type: 'Meeting Room', capacity: 8, pricePerHour: 50, status: 'occupied', nextAvailable: '16:30' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', 
    name: 'Salah Ahmed', 
    email: 'salah.ahmed@tech.eg', 
    phone: '+20 100 123 4567', 
    age: 29,
    gender: 'Male',
    membership: 'Premium', 
    lastVisit: '2023-10-25', 
    balance: 0,
    history: [
      { id: 'h1', date: '2023-10-25', action: 'Private Office 101', duration: '4h', cost: 160 },
      { id: 'h2', date: '2023-10-22', action: 'Hot Desk Area', duration: '8h', cost: 40 },
      { id: 'h3', date: '2023-10-22', action: 'Coffee: Latte', cost: 4.5 }
    ]
  },
  { 
    id: 'c2', 
    name: 'Mahmoud Hassan', 
    email: 'm.hassan@freelance.net', 
    phone: '+20 111 987 6543', 
    age: 34,
    gender: 'Male',
    membership: 'Basic', 
    lastVisit: '2023-10-26', 
    balance: 15.50,
    history: [
      { id: 'h4', date: '2023-10-26', action: 'Hot Desk Area', duration: '3h', cost: 15 },
      { id: 'h5', date: '2023-10-26', action: 'Printing (Color)', cost: 5.5 }
    ]
  },
  { 
    id: 'c3', 
    name: 'Jana Youssef', 
    email: 'jana.y@startup.io', 
    phone: '+20 122 555 0192', 
    age: 26,
    gender: 'Female',
    membership: 'Enterprise', 
    lastVisit: '2023-10-24', 
    balance: 0,
    history: [
      { id: 'h6', date: '2023-10-24', action: 'Conf. Hall Alpha', duration: '5h', cost: 750 },
      { id: 'h7', date: '2023-10-20', action: 'Meeting Room A', duration: '2h', cost: 50 }
    ]
  },
  { 
    id: 'c4', 
    name: 'Nour El-Din', 
    email: 'nour.el@design.co', 
    phone: '+20 106 444 3322', 
    age: 24,
    gender: 'Female',
    membership: 'Basic', 
    lastVisit: '2023-10-21', 
    balance: 0,
    history: [
      { id: 'h8', date: '2023-10-21', action: 'Creative Studio', duration: '4h', cost: 200 }
    ]
  },
  { 
    id: 'c5', 
    name: 'Mohamed Ali', 
    email: 'm.ali@devs.com', 
    phone: '+20 155 222 1100', 
    age: 31,
    gender: 'Male',
    membership: 'Premium', 
    lastVisit: '2023-10-23', 
    balance: 45.00,
    history: [
      { id: 'h9', date: '2023-10-23', action: 'Hot Desk Area', duration: '6h', cost: 30 }
    ]
  },
  { 
    id: 'c6', 
    name: 'Fatima Ibrahim', 
    email: 'fatima.i@edu.eg', 
    phone: '+20 100 888 7766', 
    age: 22,
    gender: 'Female',
    membership: 'Basic', 
    lastVisit: '2023-10-27', 
    balance: 0,
    history: []
  },
  { 
    id: 'c7', 
    name: 'Omar Khaled', 
    email: 'omar.k@sales.net', 
    phone: '+20 114 333 2211', 
    age: 40,
    gender: 'Male',
    membership: 'Enterprise', 
    lastVisit: '2023-10-18', 
    balance: 0,
    history: [
       { id: 'h10', date: '2023-10-18', action: 'Private Office 101', duration: '8h', cost: 320 }
    ]
  },
  { 
    id: 'c8', 
    name: 'Mariam Ezzat', 
    email: 'mariam.e@art.com', 
    phone: '+20 120 000 9988', 
    age: 27,
    gender: 'Female',
    membership: 'Premium', 
    lastVisit: '2023-10-25', 
    balance: 10.00,
    history: [
       { id: 'h11', date: '2023-10-25', action: 'Creative Studio', duration: '2h', cost: 100 }
    ]
  },
  { 
    id: 'c9', 
    name: 'Youssef Amr', 
    email: 'youssef.a@gym.io', 
    phone: '+20 101 111 2222', 
    age: 23,
    gender: 'Male',
    membership: 'Basic', 
    lastVisit: '2023-10-26', 
    balance: 0,
    history: []
  },
  { 
    id: 'c10', 
    name: 'Hagar Moustafa', 
    email: 'hagar.m@law.eg', 
    phone: '+20 112 345 6789', 
    age: 35,
    gender: 'Female',
    membership: 'Enterprise', 
    lastVisit: '2023-10-15', 
    balance: 120.00,
    history: [
        { id: 'h12', date: '2023-10-15', action: 'Meeting Room A', duration: '3h', cost: 75 },
        { id: 'h13', date: '2023-10-14', action: 'Meeting Room A', duration: '2h', cost: 50 }
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: '2', roomName: 'Private Office 101', customerName: 'Salah Ahmed', startTime: '09:00', endTime: '13:00', status: 'active', totalAmount: 160 },
  { id: 'b2', roomId: '6', roomName: 'Creative Studio', customerName: 'Jana Youssef', startTime: '14:30', endTime: '16:30', status: 'upcoming', totalAmount: 100 },
];

export const MOCK_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Espresso', price: 3.50, stock: 120, category: 'Drink' },
  { id: 's2', name: 'Latte', price: 4.50, stock: 80, category: 'Drink' },
  { id: 's3', name: 'Printing (Color)', price: 0.50, stock: 5000, category: 'Service' },
  { id: 's4', name: 'HDMI Cable', price: 10.00, stock: 15, category: 'Office Supply' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-26', description: 'Booking #B102', category: 'Income', amount: 160, method: 'Card' },
  { id: 't2', date: '2023-10-26', description: 'Coffee Sale', category: 'Income', amount: 4.50, method: 'Cash' },
  { id: 't3', date: '2023-10-25', description: 'Office Supplies Restock', category: 'Expense', amount: -250.00, method: 'Transfer' },
  { id: 't4', date: '2023-10-25', description: 'Cleaning Service', category: 'Expense', amount: -120.00, method: 'Transfer' },
];
