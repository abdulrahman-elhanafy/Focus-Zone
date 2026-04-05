import React, { useState, useEffect } from "react";
import { Card, Button, Input, Badge } from "../components/Common";
import { Clock, Calendar, User, CheckCircle, Loader2 } from "lucide-react";
import { API } from "../services/api";
import { Customer, Room } from "../types";

const Booking: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [rooms, setRooms] = useState<Room[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [r, c] = await Promise.all([
            API.rooms.getAll(),
            API.customers.getAll(),
        ]);
        setRooms(r);
        setCustomers(c);
    };

    const handleBooking = async () => {
        if (!selectedRoom || !selectedCustomer) return;

        setIsSubmitting(true);
        const room = rooms.find((r) => r.id === selectedRoom);
        const cost = (room?.pricePerHour || 0) * 2; // Assuming 2 hour duration

        await API.bookings.create({
            roomId: selectedRoom,
            roomName: room?.name || "Unknown Room",
            customerName: selectedCustomer.name,
            startTime: "09:00", // Mock start time
            endTime: "11:00", // Mock end time
            totalAmount: cost,
        });

        setIsSubmitting(false);
        setSuccess(true);

        // Reset after delay
        setTimeout(() => {
            setSuccess(false);
            setSelectedRoom(null);
            setSelectedCustomer(null);
            loadData(); // Reload rooms to show updated status
        }, 2000);
    };

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase())
    );

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                    Booking Confirmed!
                </h2>
                <p className="text-slate-500">
                    The room has been reserved successfully.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                    New Booking
                </h2>
                <p className="text-slate-500">
                    Create a reservation for a customer.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="1. Select Customer">
                        <div className="relative">
                            <Input
                                placeholder="Search customer by name..."
                                icon={<User className="w-4 h-4" />}
                                value={customerSearch}
                                onChange={(e) =>
                                    setCustomerSearch(e.target.value)
                                }
                            />
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {filteredCustomers.slice(0, 4).map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedCustomer(c)}
                                        className={`border p-3 rounded-md cursor-pointer transition-colors ${
                                            selectedCustomer?.id === c.id
                                                ? "border-primary-500 bg-primary-50"
                                                : "hover:border-primary-300"
                                        }`}>
                                        <div className="font-medium text-secondary-900">
                                            {c.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {c.membership} Member
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card title="2. Select Room">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-1">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() =>
                                        room.status === "available" &&
                                        setSelectedRoom(room.id)
                                    }
                                    className={`p-4 rounded-lg border-2 transition-all relative
                                ${
                                    selectedRoom === room.id
                                        ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                        : "border-slate-200 bg-white"
                                }
                                ${
                                    room.status !== "available"
                                        ? "opacity-60 cursor-not-allowed bg-slate-50"
                                        : "cursor-pointer hover:border-primary-300"
                                }
                            `}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-secondary-900">
                                            {room.name}
                                        </span>
                                        <span className="text-secondary-600 font-semibold">
                                            ${room.pricePerHour}/hr
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <p>
                                            {room.type} • {room.capacity} seats
                                        </p>
                                        <Badge
                                            color={
                                                room.status === "available"
                                                    ? "green"
                                                    : "red"
                                            }>
                                            {room.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Summary */}
                <div className="lg:col-span-1">
                    <Card title="Booking Summary" className="sticky top-6">
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-slate-100">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Customer
                                </label>
                                {selectedCustomer ? (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-bold text-xs">
                                            {selectedCustomer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-secondary-900">
                                                {selectedCustomer.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {selectedCustomer.membership}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-400 italic">
                                        No customer selected
                                    </p>
                                )}
                            </div>

                            <div className="pb-4 border-b border-slate-100">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Date & Time
                                </label>
                                <div className="flex gap-2 mt-2">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            className="w-full text-sm border p-2 rounded bg-slate-50"
                                            defaultValue={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="time"
                                        className="w-1/2 text-sm border p-2 rounded bg-slate-50"
                                        defaultValue="09:00"
                                    />
                                    <input
                                        type="time"
                                        className="w-1/2 text-sm border p-2 rounded bg-slate-50"
                                        defaultValue="11:00"
                                    />
                                </div>
                            </div>

                            <div className="pb-4 border-b border-slate-100">
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Room Details
                                </label>
                                {selectedRoom ? (
                                    <div className="mt-2">
                                        <p className="font-medium text-secondary-900">
                                            {
                                                rooms.find(
                                                    (r) => r.id === selectedRoom
                                                )?.name
                                            }
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            $
                                            {
                                                rooms.find(
                                                    (r) => r.id === selectedRoom
                                                )?.pricePerHour
                                            }{" "}
                                            x 2 hours
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-400 italic">
                                        No room selected
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="font-bold text-lg text-secondary-900">
                                    Total
                                </span>
                                <span className="font-bold text-2xl text-secondary-700">
                                    $
                                    {selectedRoom
                                        ? (rooms.find(
                                            (r) => r.id === selectedRoom
                                          )?.pricePerHour || 0) * 2
                                        : "0.00"}
                                </span>
                            </div>

                            <Button
                                className="w-full flex items-center justify-center gap-2 mt-4 font-bold"
                                size="lg"
                                disabled={
                                    !selectedRoom ||
                                    !selectedCustomer ||
                                    isSubmitting
                                }
                                onClick={handleBooking}>
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <CheckCircle className="w-5 h-5" />
                                )}
                                {isSubmitting
                                    ? "Processing..."
                                    : "Confirm Booking"}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Booking;
