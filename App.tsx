
import React, { useState, useEffect } from 'react';
import { User, ScreenName, Role } from './types';
import { LayoutGrid, Users, Calendar, LogOut, Coffee, Settings as SettingsIcon, FileText, ChevronLeft, Building, UserCircle, PieChart, CreditCard, Layers } from 'lucide-react';
import { API } from './services/api';

import Login from './screens/Login';
import ReceptionDashboard from './screens/ReceptionDashboard';
import OwnerDashboard from './screens/OwnerDashboard';
import AccountantDashboard from './screens/AccountantDashboard';
import Booking from './screens/Booking';
import Customers from './screens/Customers';
import Reports from './screens/Reports';
import Settings from './screens/Settings';
import CheckIn from './screens/CheckIn';
import RoomsManagement from './screens/RoomsManagement';

// --- Sidebar ---
interface SidebarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  role: Role;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, role, onLogout }) => {
  const getMenuItems = () => {
    const common = [
        { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    ];
    
    if (role === 'receptionist') {
      return [
        { id: 'dashboard_reception', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
        { id: 'make_booking', label: 'Bookings', icon: <Calendar size={20} /> },
        { id: 'check_in', label: 'Check-In', icon: <Users size={20} /> },
        { id: 'services', label: 'Services / POS', icon: <Coffee size={20} /> },
        ...common
      ];
    } else if (role === 'owner') {
      return [
        { id: 'dashboard_owner', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
        { id: 'rooms_mgmt', label: 'Rooms', icon: <Layers size={20} /> },
        { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
        { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
      ];
    } else if (role === 'accountant') {
      return [
        { id: 'dashboard_accountant', label: 'Dashboard', icon: <PieChart size={20} /> },
        { id: 'expenses', label: 'Expenses', icon: <CreditCard size={20} /> },
        { id: 'reports', label: 'Financial Reports', icon: <FileText size={20} /> },
      ];
    }
    return [];
  };

  return (
    <div className="w-64 bg-secondary-900 text-white h-full flex flex-col shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-secondary-800">
        <div className="bg-secondary-800 p-2 rounded-lg">
             <Building className="text-primary-500" size={24} />
        </div>
        <div>
            <h1 className="font-bold text-lg tracking-wide text-white">FocusZone</h1>
            <p className="text-xs text-secondary-300 uppercase tracking-wider">{role}</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1">
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ScreenName)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
              ${currentScreen === item.id ? 'bg-primary-500 text-secondary-900 shadow-md font-bold' : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'}`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary-800">
        <button onClick={onLogout} className="w-full flex items-center space-x-3 px-3 py-2 text-secondary-400 hover:text-red-400 hover:bg-secondary-800/50 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

// --- Topbar ---
const Topbar: React.FC<{ user: User, title: string }> = ({ user, title }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
    <h2 className="text-xl font-bold text-secondary-900 capitalize">{title.replace('_', ' ')}</h2>
    <div className="flex items-center space-x-4">
      <div className="text-right hidden md:block">
        <p className="text-sm font-semibold text-secondary-900">{user.name}</p>
        <p className="text-xs text-secondary-500 capitalize">{user.role}</p>
      </div>
      <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-secondary-100" />
    </div>
  </header>
);

// --- Main App ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');

  useEffect(() => {
    // Initialize the local backend
    API.init();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'receptionist') setCurrentScreen('dashboard_reception');
    else if (loggedInUser.role === 'owner') setCurrentScreen('dashboard_owner');
    else if (loggedInUser.role === 'accountant') setCurrentScreen('dashboard_accountant');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard_reception': return <ReceptionDashboard onNavigate={setCurrentScreen} />;
      case 'dashboard_owner': return <OwnerDashboard />;
      case 'dashboard_accountant': return <AccountantDashboard />;
      case 'make_booking': return <Booking />;
      case 'check_in': return <CheckIn />;
      case 'rooms_mgmt': return <RoomsManagement />;
      case 'customers': return <Customers />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <Layers size={64} className="mb-4 text-slate-300" />
            <p className="text-lg">This module ({currentScreen}) is under development.</p>
            <button onClick={() => setCurrentScreen(user?.role === 'owner' ? 'dashboard_owner' : user?.role === 'accountant' ? 'dashboard_accountant' : 'dashboard_reception')} className="mt-4 text-primary-600 underline">Return Home</button>
          </div>
        );
    }
  };

  if (!user || currentScreen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} role={user.role} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} title={currentScreen} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
