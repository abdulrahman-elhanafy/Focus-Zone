import { Customer, Room, Booking, Transaction, User, ServiceItem } from '../types';

const BASE_URL = '/api';

const fetchJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    let errorData = await response.text();
    try {
      errorData = JSON.parse(errorData).error || errorData;
    } catch {}
    throw new Error(errorData || `HTTP error ${response.status}`);
  }
  return await response.json();
};

export const API = {
  init: async () => {
    try {
      await fetchJson('/status');
      console.log('Connected to FocusZone backend.');
    } catch (error) {
      console.error('FocusZone backend not reachable. Please start the server.');
    }
  },

  auth: {
    login: async (username: string, password: string): Promise<User> => {
      return await fetchJson<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    }
  },

  customers: {
    getAll: async (): Promise<Customer[]> => {
      return await fetchJson<Customer[]>('/customers');
    },
    create: async (customerData: Omit<Customer, 'id' | 'history' | 'balance' | 'lastVisit'>): Promise<Customer> => {
      return await fetchJson<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
    }
  },

  rooms: {
    getAll: async (): Promise<Room[]> => {
      return await fetchJson<Room[]>('/rooms');
    },
    updateStatus: async (id: string, status: Room['status']): Promise<void> => {
      await fetchJson('/rooms/status', {
        method: 'PUT',
        body: JSON.stringify({ id, status }),
      });
    },
    create: async (roomData: Omit<Room, 'id'>): Promise<Room> => {
      return await fetchJson<Room>('/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
      });
    },
    update: async (id: string, data: Partial<Omit<Room, 'id'>>): Promise<void> => {
      await fetchJson('/rooms', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
      });
    },
    delete: async (id: string): Promise<void> => {
      await fetchJson('/rooms', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    }
  },

  bookings: {
    getAll: async (): Promise<Booking[]> => {
      return await fetchJson<Booking[]>('/bookings');
    },
    getActive: async (): Promise<Booking[]> => {
      const bookings = await API.bookings.getAll();
      return bookings.filter(b => b.status === 'active' || b.status === 'upcoming');
    },
    create: async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
      return await fetchJson<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    }
  },

  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      return await fetchJson<Transaction[]>('/transactions');
    }
  }
};
