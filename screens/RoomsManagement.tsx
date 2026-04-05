import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Input } from '../components/Common';
import { API } from '../services/api';
import { Room } from '../types';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Layers,
    Users,
    DollarSign,
    Filter,
    ChevronDown,
    Wrench,
    CheckCircle2,
    XCircle,
    Clock,
    LayoutGrid,
    List,
} from 'lucide-react';

type RoomType = Room['type'];
type RoomStatus = Room['status'];
type ViewMode = 'grid' | 'list';

const ROOM_TYPES: RoomType[] = ['Private Office', 'Meeting Room', 'Hot Desk', 'Conference Hall'];
const ROOM_STATUSES: RoomStatus[] = ['available', 'occupied', 'maintenance', 'reserved'];

const statusConfig: Record<RoomStatus, { label: string; color: 'green' | 'red' | 'yellow' | 'gray' | 'blue'; icon: React.ReactNode; bg: string }> = {
    available: { label: 'Available', color: 'green', icon: <CheckCircle2 size={14} />, bg: 'bg-green-50 border-green-200' },
    occupied: { label: 'Occupied', color: 'red', icon: <XCircle size={14} />, bg: 'bg-red-50 border-red-200' },
    maintenance: { label: 'Maintenance', color: 'yellow', icon: <Wrench size={14} />, bg: 'bg-amber-50 border-amber-200' },
    reserved: { label: 'Reserved', color: 'blue', icon: <Clock size={14} />, bg: 'bg-blue-50 border-blue-200' },
};

const typeIcons: Record<RoomType, string> = {
    'Private Office': '🏢',
    'Meeting Room': '🤝',
    'Hot Desk': '💻',
    'Conference Hall': '🎤',
};

const emptyRoom = {
    name: '',
    type: 'Private Office' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    status: 'available' as RoomStatus,
    nextAvailable: '',
};

const RoomsManagement: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<RoomType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [formData, setFormData] = useState(emptyRoom);
    const [saving, setSaving] = useState(false);

    const loadRooms = async () => {
        setLoading(true);
        const data = await API.rooms.getAll();
        setRooms(data);
        setLoading(false);
    };

    useEffect(() => {
        loadRooms();
    }, []);

    // Filtering
    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || room.type === filterType;
        const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Stats
    const stats = {
        total: rooms.length,
        available: rooms.filter((r) => r.status === 'available').length,
        occupied: rooms.filter((r) => r.status === 'occupied').length,
        maintenance: rooms.filter((r) => r.status === 'maintenance').length,
        reserved: rooms.filter((r) => r.status === 'reserved').length,
        totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
        avgPrice: rooms.length > 0 ? (rooms.reduce((sum, r) => sum + r.pricePerHour, 0) / rooms.length).toFixed(2) : '0',
    };

    // Form handlers
    const openAddModal = () => {
        setEditingRoom(null);
        setFormData(emptyRoom);
        setIsModalOpen(true);
    };

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            pricePerHour: room.pricePerHour,
            status: room.status,
            nextAvailable: room.nextAvailable || '',
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (room: Room) => {
        setRoomToDelete(room);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        setSaving(true);

        if (editingRoom) {
            await API.rooms.update(editingRoom.id, {
                name: formData.name,
                type: formData.type,
                capacity: formData.capacity,
                pricePerHour: formData.pricePerHour,
                status: formData.status,
                nextAvailable: formData.nextAvailable || undefined,
            });
        } else {
            await API.rooms.create({
                name: formData.name,
                type: formData.type,
                capacity: formData.capacity,
                pricePerHour: formData.pricePerHour,
                status: formData.status,
                nextAvailable: formData.nextAvailable || undefined,
            });
        }

        setSaving(false);
        setIsModalOpen(false);
        loadRooms();
    };

    const handleDelete = async () => {
        if (!roomToDelete) return;
        setSaving(true);
        await API.rooms.delete(roomToDelete.id);
        setSaving(false);
        setIsDeleteModalOpen(false);
        setRoomToDelete(null);
        loadRooms();
    };

    const handleStatusChange = async (room: Room, newStatus: RoomStatus) => {
        await API.rooms.updateStatus(room.id, newStatus);
        loadRooms();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
                    <p className="text-xs text-slate-500 mt-1">Total Rooms</p>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{stats.available}</p>
                    <p className="text-xs text-green-600 mt-1">Available</p>
                </div>
                <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">{stats.occupied}</p>
                    <p className="text-xs text-red-600 mt-1">Occupied</p>
                </div>
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700">{stats.maintenance}</p>
                    <p className="text-xs text-amber-600 mt-1">Maintenance</p>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{stats.reserved}</p>
                    <p className="text-xs text-blue-600 mt-1">Reserved</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-secondary-900">{stats.totalCapacity}</p>
                    <p className="text-xs text-slate-500 mt-1">Total Seats</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-primary-600">${stats.avgPrice}</p>
                    <p className="text-xs text-slate-500 mt-1">Avg $/hr</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 items-center flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                    </div>

                    {/* Type filter */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as RoomType | 'all')}
                            className="appearance-none bg-white border border-slate-300 rounded-md text-sm pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            {ROOM_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'all')}
                            className="appearance-none bg-white border border-slate-300 rounded-md text-sm pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            {ROOM_STATUSES.map((s) => (
                                <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* View toggle */}
                    <div className="flex bg-slate-100 rounded-md p-0.5">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-secondary-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-secondary-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>

                    <Button onClick={openAddModal} size="md">
                        <Plus size={16} className="mr-1.5" />
                        Add Room
                    </Button>
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-secondary-700">{filteredRooms.length}</span> of {rooms.length} rooms
            </p>

            {/* Room Grid */}
            {filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Layers size={48} className="mb-3 text-slate-300" />
                    <p className="text-lg font-medium">No rooms found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or add a new room.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRooms.map((room) => {
                        const sc = statusConfig[room.status];
                        return (
                            <div
                                key={room.id}
                                className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${sc.bg}`}
                            >
                                {/* Room Header */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{typeIcons[room.type]}</span>
                                            <div>
                                                <h3 className="font-bold text-secondary-900 text-base">{room.name}</h3>
                                                <p className="text-xs text-slate-500">{room.type}</p>
                                            </div>
                                        </div>
                                        <Badge color={sc.color}>
                                            <span className="flex items-center gap-1">{sc.icon} {sc.label}</span>
                                        </Badge>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5 border border-slate-100">
                                            <Users size={14} className="text-secondary-500" />
                                            <div>
                                                <p className="text-xs text-slate-500">Capacity</p>
                                                <p className="text-sm font-bold text-secondary-900">{room.capacity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5 border border-slate-100">
                                            <DollarSign size={14} className="text-primary-600" />
                                            <div>
                                                <p className="text-xs text-slate-500">Per Hour</p>
                                                <p className="text-sm font-bold text-secondary-900">${room.pricePerHour}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {room.nextAvailable && room.status !== 'available' && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock size={12} />
                                            <span>Next available: <span className="font-medium text-secondary-700">{room.nextAvailable}</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="border-t border-slate-100 bg-white/60 px-5 py-3 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                                    {/* Status quick-switch */}
                                    <div className="relative">
                                        <select
                                            value={room.status}
                                            onChange={(e) => handleStatusChange(room, e.target.value as RoomStatus)}
                                            className="appearance-none text-xs bg-transparent border border-slate-200 rounded-md pl-2 pr-6 py-1 focus:outline-none focus:border-primary-500 cursor-pointer"
                                        >
                                            {ROOM_STATUSES.map((s) => (
                                                <option key={s} value={s}>{statusConfig[s].label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>

                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => openEditModal(room)}
                                            className="p-1.5 rounded hover:bg-secondary-50 text-slate-400 hover:text-secondary-600 transition-colors"
                                            title="Edit room"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(room)}
                                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                            title="Delete room"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List view */
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Room</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Capacity</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Price/hr</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Status</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-600">Next Available</th>
                                    <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map((room) => {
                                    const sc = statusConfig[room.status];
                                    return (
                                        <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{typeIcons[room.type]}</span>
                                                    <span className="font-semibold text-secondary-900">{room.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{room.type}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center gap-1">
                                                    <Users size={12} className="text-slate-400" />
                                                    {room.capacity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium text-secondary-800">${room.pricePerHour}</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={room.status}
                                                        onChange={(e) => handleStatusChange(room, e.target.value as RoomStatus)}
                                                        className="appearance-none text-xs bg-transparent border border-slate-200 rounded-full pl-2 pr-6 py-1 focus:outline-none focus:border-primary-500 cursor-pointer"
                                                    >
                                                        {ROOM_STATUSES.map((s) => (
                                                            <option key={s} value={s}>{statusConfig[s].label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center text-slate-500">{room.nextAvailable || '—'}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <button
                                                        onClick={() => openEditModal(room)}
                                                        className="p-1.5 rounded hover:bg-secondary-50 text-slate-400 hover:text-secondary-600 transition-colors"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(room)}
                                                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRoom ? 'Edit Room' : 'Add New Room'}
                width="max-w-lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Room Name"
                        placeholder="e.g. Meeting Room B"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Room Type</label>
                        <div className="relative">
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none cursor-pointer"
                            >
                                {ROOM_TYPES.map((t) => (
                                    <option key={t} value={t}>{typeIcons[t]} {t}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Capacity (seats)"
                            type="number"
                            min={1}
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                        />
                        <Input
                            label="Price Per Hour ($)"
                            type="number"
                            min={0}
                            step={0.5}
                            value={formData.pricePerHour}
                            onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROOM_STATUSES.map((s) => {
                                const sc = statusConfig[s];
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setFormData({ ...formData, status: s })}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                                            formData.status === s
                                                ? `${sc.bg} ring-2 ring-offset-1 ring-primary-400`
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {sc.icon}
                                        {sc.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {formData.status !== 'available' && (
                        <Input
                            label="Next Available"
                            placeholder="e.g. 14:00, Tomorrow"
                            value={formData.nextAvailable}
                            onChange={(e) => setFormData({ ...formData, nextAvailable: e.target.value })}
                        />
                    )}

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSave}
                            disabled={saving || !formData.name.trim()}
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-900"></span>
                                    Saving...
                                </span>
                            ) : editingRoom ? 'Update Room' : 'Create Room'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Room"
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                        <Trash2 className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-medium text-red-800">
                                Are you sure you want to delete <strong>{roomToDelete?.name}</strong>?
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                This action cannot be undone. All associated bookings may be affected.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="flex-1" onClick={handleDelete} disabled={saving}>
                            {saving ? 'Deleting...' : 'Delete Room'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RoomsManagement;
