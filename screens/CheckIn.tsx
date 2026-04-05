import React, { useState, useEffect } from "react";
import { Card, Input, Button, Badge } from "../components/Common";
import {
    User,
    Search,
    MapPin,
    CheckCircle,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { API } from "../services/api";
import { Customer, Room } from "../types";

const CheckIn: React.FC = () => {
    // State management
    const [step, setStep] = useState<1 | 2>(1);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [duration, setDuration] = useState<number>(2); // Default 2 Hours
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Load data
    useEffect(() => {
        const load = async () => {
            const [c, r] = await Promise.all([
                API.customers.getAll(),
                API.rooms.getAll(),
            ]);
            setCustomers(c);
            setRooms(r.filter((room) => room.status === "available"));
        };
        load();
    }, []);

    // Filter customers
    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
    );

    const handleCheckIn = async () => {
        if (!selectedCustomer || !selectedRoom) return;
        setIsSubmitting(true);

        const now = new Date();
        const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000);

        // Format time HH:MM
        const formatTime = (date: Date) =>
            date.getHours().toString().padStart(2, "0") +
            ":" +
            date.getMinutes().toString().padStart(2, "0");

        await API.bookings.create({
            roomId: selectedRoom.id,
            roomName: selectedRoom.name,
            customerName: selectedCustomer.name,
            startTime: formatTime(now),
            endTime: formatTime(endTime),
            totalAmount: selectedRoom.pricePerHour * duration,
        });

        setIsSubmitting(false);
        setCompleted(true);
    };

    const resetFlow = () => {
        setCompleted(false);
        setStep(1);
        setSelectedCustomer(null);
        setSelectedRoom(null);
        setSearchQuery("");
        setDuration(2);
        // Reload rooms to remove the one we just took
        const load = async () => {
            const r = await API.rooms.getAll();
            setRooms(r.filter((room) => room.status === "available"));
        };
        load();
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                    Check-In Successful
                </h2>
                <p className="text-slate-500 mb-8 max-w-md text-lg">
                    <span className="font-bold text-slate-800">
                        {selectedCustomer?.name}
                    </span>{" "}
                    is now checked into
                    <span className="font-bold text-secondary-600">
                        {" "}
                        {selectedRoom?.name}
                    </span>
                    .
                </p>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 w-full max-w-md mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500">Time In</span>
                        <span className="font-medium text-slate-900">Now</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-medium text-slate-900">
                            {duration} Hours
                        </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-700">
                            Total Charged
                        </span>
                        <span className="font-bold text-xl text-primary-600">
                            $
                            {(selectedRoom!.pricePerHour * duration).toFixed(2)}
                        </span>
                    </div>
                </div>

                <Button size="lg" onClick={resetFlow}>
                    Process Another Check-In
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900">
                        Guest Check-In
                    </h2>
                    <p className="text-slate-500">
                        Process immediate arrivals and walk-ins.
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    <span
                        className={`px-4 py-1.5 rounded-full transition-colors ${
                            step === 1
                                ? "bg-secondary-900 text-white font-bold"
                                : "text-slate-500"
                        }`}>
                        1. Customer
                    </span>
                    <span className="text-slate-300">→</span>
                    <span
                        className={`px-4 py-1.5 rounded-full transition-colors ${
                            step === 2
                                ? "bg-secondary-900 text-white font-bold"
                                : "text-slate-500"
                        }`}>
                        2. Room
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {step === 1 && (
                        <Card title="Select Customer" className="min-h-[400px]">
                            <div className="mb-4">
                                <Input
                                    placeholder="Search by name, phone or email..."
                                    icon={<Search className="w-4 h-4" />}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    autoFocus
                                    className="text-lg py-3"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 mt-4 max-h-[500px] overflow-y-auto pr-2">
                                {filteredCustomers.map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedCustomer(c)}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between group
                                            ${
                                                selectedCustomer?.id === c.id
                                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500 shadow-md"
                                                    : "border-slate-200 hover:border-primary-300 hover:bg-slate-50 hover:shadow-sm"
                                            }`}>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm
                                                ${
                                                    selectedCustomer?.id ===
                                                    c.id
                                                        ? "bg-primary-500"
                                                        : "bg-secondary-300 group-hover:bg-secondary-400"
                                                }`}>
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-secondary-900">
                                                    {c.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <span>{c.phone}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span>{c.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            color={
                                                c.membership === "Enterprise"
                                                    ? "blue"
                                                    : c.membership === "Premium"
                                                    ? "green"
                                                    : "gray"
                                            }>
                                            {c.membership}
                                        </Badge>
                                    </div>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium">
                                            No customers found.
                                        </p>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Try a different search term.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card title="Select Room">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                        className={`p-5 border rounded-xl cursor-pointer transition-all relative overflow-hidden
                                            ${
                                                selectedRoom?.id === room.id
                                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500 shadow-md"
                                                    : "border-slate-200 hover:border-primary-300 hover:bg-slate-50 hover:shadow-sm"
                                            }`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-secondary-900 text-lg">
                                                    {room.name}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    {room.type}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-secondary-600 text-lg">
                                                    ${room.pricePerHour}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    /hour
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100/50">
                                            <Badge color="green">
                                                Available
                                            </Badge>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {room.capacity} Seats
                                            </span>
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedRoom?.id === room.id && (
                                            <div className="absolute top-0 right-0 p-2 bg-primary-500 rounded-bl-xl">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {rooms.length === 0 && (
                                    <div className="col-span-2 p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="text-red-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">
                                            No rooms available right now.
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Check the dashboard for current
                                            occupancy.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <Card
                            title="Summary"
                            className="border-t-4 border-t-secondary-500 shadow-lg">
                            <div className="space-y-6">
                                {/* Selected Customer */}
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Customer
                                    </p>
                                    {selectedCustomer ? (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-800 font-bold text-xs">
                                                {selectedCustomer.name.charAt(
                                                    0
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-sm text-secondary-900 truncate">
                                                    {selectedCustomer.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {selectedCustomer.email}
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                <button
                                                    onClick={() => {
                                                        setStep(1);
                                                        setSelectedCustomer(
                                                            null
                                                        );
                                                    }}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-400 italic bg-slate-50">
                                            Step 1: Select Customer
                                        </div>
                                    )}
                                </div>

                                {/* Selected Room */}
                                <div
                                    className={`transition-opacity ${
                                        step === 1 && !selectedCustomer
                                            ? "opacity-50"
                                            : "opacity-100"
                                    }`}>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Room
                                    </p>
                                    {selectedRoom ? (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-secondary-900">
                                                    {selectedRoom.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    ${selectedRoom.pricePerHour}
                                                    /hr
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                <button
                                                    onClick={() => {
                                                        setStep(2);
                                                        setSelectedRoom(null);
                                                    }}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-400 italic bg-slate-50">
                                            Step 2: Select Room
                                        </div>
                                    )}
                                </div>

                                {/* Duration Selector (Only Step 2) */}
                                {step === 2 && (
                                    <div className="animate-in slide-in-from-top-4 fade-in">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Duration
                                        </p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 4, 8].map((h) => (
                                                <button
                                                    key={h}
                                                    onClick={() =>
                                                        setDuration(h)
                                                    }
                                                    className={`py-2 text-sm font-medium rounded-lg border transition-all shadow-sm
                                                        ${
                                                            duration === h
                                                                ? "bg-secondary-800 text-white border-secondary-800 shadow-md transform scale-105"
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-secondary-400 hover:bg-slate-50"
                                                        }`}>
                                                    {h}h
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-200 pt-6 mt-6">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-sm font-medium text-slate-600">
                                            Total Estimate
                                        </span>
                                        <div className="text-right">
                                            <span className="block text-3xl font-bold text-secondary-900 tracking-tight">
                                                $
                                                {selectedRoom
                                                    ? (selectedRoom.pricePerHour * duration).toFixed(2): "0.00"}
                                            </span>
                                            {selectedRoom && (
                                                <span className="text-xs text-slate-400">
                                                    Based on {duration} hours
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {step === 1 ? (
                                        <Button
                                            className="w-full justify-center h-12 text-lg shadow-md hover:shadow-lg transition-shadow"
                                            disabled={!selectedCustomer}
                                            onClick={() => setStep(2)}>
                                            Continue to Room{" "}
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    ) : (
                                        <div className="space-y-3">
                                            <Button
                                                className="w-full justify-center h-12 text-lg font-bold shadow-md hover:shadow-lg transition-shadow bg-primary-500 hover:bg-primary-400 text-secondary-900"
                                                disabled={
                                                    !selectedRoom ||
                                                    isSubmitting
                                                }
                                                onClick={handleCheckIn}>
                                                {isSubmitting ? (
                                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                )}
                                                {isSubmitting
                                                    ? "Processing..."
                                                    : "Confirm Check-In"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center text-slate-500 hover:text-slate-800"
                                                onClick={() => setStep(1)}
                                                disabled={isSubmitting}>
                                                Back to Customer
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckIn;
