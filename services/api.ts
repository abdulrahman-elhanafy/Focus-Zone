import { Customer, Room, Booking, Transaction, User, Employee, Session, SessionItem, Item, Payment } from '../types';

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
      errorData = JSON.parse(errorData).message || errorData;
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
      const result = await fetchJson<{ success: boolean; data: Customer[] }>('/customers');
      return result.data;
    },
    getById: async (id: string): Promise<Customer> => {
      const result = await fetchJson<{ success: boolean; data: Customer }>(`/customers/${id}`);
      return result.data;
    },
    create: async (customerData: Omit<Customer, 'customer_id' | 'customer_last_visit' | 'customer_balance'>): Promise<Customer> => {
      const result = await fetchJson<{ success: boolean; data: Customer }>('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
      return result.data;
    }
  },

  employees: {
    getAll: async (): Promise<Employee[]> => {
      const result = await fetchJson<{ success: boolean; data: Employee[] }>('/employees');
      return result.data;
    },
    getById: async (id: string): Promise<Employee> => {
      const result = await fetchJson<{ success: boolean; data: Employee }>(`/employees/${id}`);
      return result.data;
    },
    create: async (employeeData: Omit<Employee, 'employee_id' | 'employee_hire_date' | 'employee_status'>): Promise<Employee> => {
      const result = await fetchJson<{ success: boolean; data: Employee }>('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return result.data;
    },
    update: async (id: string, data: Partial<Omit<Employee, 'employee_id' | 'employee_hire_date'>>): Promise<Employee> => {
      const result = await fetchJson<{ success: boolean; data: Employee }>(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return result.data;
    }
  },

  rooms: {
    getAll: async (): Promise<Room[]> => {
      const result = await fetchJson<{ success: boolean; data: Room[] }>('/rooms');
      return result.data;
    },
    updateStatus: async (room_id: string, room_status: Room['room_status']): Promise<void> => {
      await fetchJson('/rooms/status', {
        method: 'PUT',
        body: JSON.stringify({ room_id, room_status }),
      });
    },
    create: async (roomData: Omit<Room, 'room_id'>): Promise<Room> => {
      const result = await fetchJson<{ success: boolean; data: Room }>('/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
      });
      return result.data;
    },
    update: async (room_id: string, data: Partial<Omit<Room, 'room_id'>>): Promise<Room> => {
      const result = await fetchJson<{ success: boolean; data: Room }>('/rooms', {
        method: 'PUT',
        body: JSON.stringify({ room_id, ...data }),
      });
      return result.data;
    },
    delete: async (room_id: string): Promise<void> => {
      await fetchJson('/rooms', {
        method: 'DELETE',
        body: JSON.stringify({ room_id }),
      });
    }
  },

  items: {
    getAll: async (): Promise<Item[]> => {
      const result = await fetchJson<{ success: boolean; data: Item[] }>('/items');
      return result.data;
    },
    create: async (itemData: Omit<Item, 'item_id'>): Promise<Item> => {
      const result = await fetchJson<{ success: boolean; data: Item }>('/items', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      return result.data;
    },
    update: async (id: string, data: { item_price?: number; item_stock?: number }): Promise<Item> => {
      const result = await fetchJson<{ success: boolean; data: Item }>(`/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return result.data;
    }
  },

  bookings: {
    getAll: async (): Promise<Booking[]> => {
      const result = await fetchJson<{ success: boolean; data: Booking[] }>('/bookings');
      return result.data;
    },
    getActive: async (): Promise<Booking[]> => {
      const bookings = await API.bookings.getAll();
      return bookings.filter(b => b.status === 'confirmed');
    },
    create: async (bookingData: Omit<Booking, 'booking_id' | 'created_at'>): Promise<Booking> => {
      const result = await fetchJson<{ success: boolean; data: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      return result.data;
    }
  },

  sessions: {
    getActive: async (): Promise<Session[]> => {
      const result = await fetchJson<{ success: boolean; data: Session[] }>('/sessions/active');
      return result.data;
    },
    create: async (sessionData: Omit<Session, 'session_id' | 'start_time' | 'end_time' | 'status'>): Promise<Session> => {
      const result = await fetchJson<{ success: boolean; data: Session }>('/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      return result.data;
    },
    close: async (id: string): Promise<Session> => {
      const result = await fetchJson<{ success: boolean; data: Session }>(`/sessions/${id}/close`, {
        method: 'PUT',
      });
      return result.data;
    },
    addItem: async (id: string, itemData: { item_id: string; quantity: number }): Promise<SessionItem> => {
      const result = await fetchJson<{ success: boolean; data: SessionItem }>(`/sessions/${id}/items`, {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      return result.data;
    },
    getBill: async (id: string): Promise<{
      session: Session;
      session_items: SessionItem[];
      room_amount: number;
      items_amount: number;
      total_amount: number;
      payment: Payment | null;
    }> => {
      const result = await fetchJson<{
        success: boolean;
        data: {
          session: Session;
          session_items: SessionItem[];
          room_amount: number;
          items_amount: number;
          total_amount: number;
          payment: Payment | null;
        };
      }>(`/sessions/${id}/bill`);
      return result.data;
    }
  },

  payments: {
    create: async (paymentData: { session_id: string; payment_method: 'Cash' | 'Visa' | 'Wallet' }): Promise<Payment> => {
      const result = await fetchJson<{ success: boolean; data: Payment }>('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      return result.data;
    }
  },

  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      const result = await fetchJson<{ success: boolean; data: Transaction[] }>('/transactions');
      return result.data;
    }
  }
};
