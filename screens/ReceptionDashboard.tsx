import React, { useState, useEffect } from "react";
import { StatCard, Card, Button, Badge } from "../components/Common";
import {
    Users,
    CalendarCheck,
    DoorOpen,
    Plus,
    LogIn,
    LogOut,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import { ScreenName, Room, Booking } from "../types";
import { API } from "../services/api";

interface ReceptionDashboardProps {
    onNavigate: (screen: ScreenName) => void;
}

const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({
    onNavigate,
}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [r, b] = await Promise.all([
                API.rooms.getAll(),
                API.bookings.getActive(),
            ]);
            setRooms(r);
            setActiveBookings(b);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin w-8 h-8 text-primary-500" />
            </div>
        );

    const availableCount = rooms.filter((r) => r.status === "available").length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Customers Checked In"
                    value="24"
                    icon={<Users className="w-6 h-6" />}
                    trend="+12% vs yesterday"
                    trendUp={true}
                />
                <StatCard
                    title="Active Bookings"
                    value={activeBookings.length.toString()}
                    icon={<CalendarCheck className="w-6 h-6" />}
                    trend="Steady"
                    trendUp={true}
                />
                <StatCard
                    title="Available Rooms"
                    value={availableCount.toString()}
                    icon={<DoorOpen className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                    size="lg"
                    className="h-24 flex-col gap-2 shadow-sm"
                    onClick={() => onNavigate("make_booking")}>
                    <Plus className="w-6 h-6" /> New Booking
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="h-24 flex-col gap-2 shadow-sm bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    onClick={() => onNavigate("check_in")}>
                    <LogIn className="w-6 h-6" /> Check In
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="h-24 flex-col gap-2 shadow-sm bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                    onClick={() => onNavigate("check_out")}>
                    <LogOut className="w-6 h-6" /> Check Out
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="h-24 flex-col gap-2 shadow-sm bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                    onClick={() => onNavigate("services")}>
                    <ShoppingBag className="w-6 h-6" /> Sell Item
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Room Grid */}
                <div className="lg:col-span-2">
                    <Card title="Live Rooms Status">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className={`p-4 rounded-lg border-l-4 shadow-sm flex flex-col justify-between h-32 transition-transform hover:-translate-y-1
                        ${
                            room.status === "available"
                                ? "bg-white border-green-500"
                                : room.status === "occupied"
                                ? "bg-red-50 border-red-500"
                                : room.status === "maintenance"
                                ? "bg-slate-100 border-slate-500"
                                : "bg-yellow-50 border-yellow-500"
                        }`}>
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-slate-800 text-lg truncate">
                                            {room.name}
                                        </span>
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                room.status === "available"
                                                    ? "bg-green-500"
                                                    : room.status === "occupied"
                                                    ? "bg-red-500"
                                                    : "bg-slate-400"
                                            }`}></div>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500">
                                        <p>{room.type}</p>
                                        <p>{room.capacity} seats</p>
                                    </div>
                                    <div className="mt-auto pt-2 text-xs font-semibold text-slate-600 flex justify-between">
                                        <span>${room.pricePerHour}/hr</span>
                                        {room.status === "occupied" && (
                                            <span className="text-red-600">
                                                Until 14:00
                                            </span>
                                        )}
                                        {room.status === "available" && (
                                            <span className="text-green-600">
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Recent Activity / Active Bookings List */}
                <div className="lg:col-span-1">
                    <Card title="Active Bookings">
                        <div className="space-y-4">
                            {activeBookings.length > 0 ? (
                                activeBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <h4 className="font-semibold text-slate-800 text-sm">
                                                {booking.customerName}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {booking.roomName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge color="green">Active</Badge>
                                            <p className="text-xs font-mono mt-1">
                                                {booking.startTime} -{" "}
                                                {booking.endTime}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">
                                    No active bookings.
                                </p>
                            )}

                            <div className="text-center pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full">
                                    View All Bookings
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;
