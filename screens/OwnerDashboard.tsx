import React from "react";
import { StatCard, Card, Button } from "../components/Common";
import {
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Video,
    Briefcase,
    FileText,
    AlertCircle,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { MOCK_ROOMS } from "../constants";

const data = [
    { name: "Mon", revenue: 4000, bookings: 24 },
    { name: "Tue", revenue: 3000, bookings: 18 },
    { name: "Wed", revenue: 2000, bookings: 12 },
    { name: "Thu", revenue: 2780, bookings: 20 },
    { name: "Fri", revenue: 1890, bookings: 15 },
    { name: "Sat", revenue: 2390, bookings: 28 },
    { name: "Sun", revenue: 3490, bookings: 32 },
];

const OwnerDashboard: React.FC = () => {
    // Helper to simulate current occupancy since it's not in the mock model
    const getOccupancy = (room: (typeof MOCK_ROOMS)[0]) => {
        if (room.status === "available") return 0;
        if (room.status === "maintenance") return 0;
        // Simulate random occupancy for occupied/reserved rooms
        // Deterministic random based on ID char code
        const seed = room.id.charCodeAt(0);
        const percent = 0.5 + (seed % 50) / 100; // 0.5 to 1.0
        return Math.ceil(room.capacity * percent);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Revenue"
                    value="$1,240.50"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend="+8%"
                    trendUp={true}
                />
                <StatCard
                    title="Monthly Revenue"
                    value="$42,500"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+15%"
                    trendUp={true}
                />
                <StatCard
                    title="Occupancy Rate"
                    value="78%"
                    icon={<Activity className="w-6 h-6" />}
                    trend="-2%"
                    trendUp={false}
                />
                <StatCard
                    title="Total Customers"
                    value="1,204"
                    icon={<Users className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Revenue Analytics (Weekly)">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: "#f1f5f9" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                {/* Yellow Bars for Revenue */}
                                <Bar
                                    dataKey="revenue"
                                    fill="#fbb315"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Booking Trends">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#64748b" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                {/* Blue Line for Bookings */}
                                <Line
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#477fc1"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Room Filling Section */}
                <Card title="Live Room Occupancy" className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_ROOMS.map((room) => {
                            const current = getOccupancy(room);
                            const percentage = (current / room.capacity) * 100;

                            return (
                                <div
                                    key={room.id}
                                    className="p-4 border border-slate-200 rounded-lg hover:border-secondary-300 transition-colors bg-slate-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h4 className="font-bold text-secondary-900">
                                                {room.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {room.type}
                                            </p>
                                        </div>
                                        <div
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                room.status === "occupied"
                                                    ? "bg-red-100 text-red-700"
                                                    : room.status ===
                                                      "available"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-200 text-slate-700"
                                            }`}>
                                            {room.status === "available"
                                                ? "Empty"
                                                : `${current}/${room.capacity}`}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${
                                                room.status === "available"
                                                    ? "bg-green-500"
                                                    : room.status ===
                                                      "maintenance"
                                                    ? "bg-slate-400"
                                                    : percentage > 90
                                                    ? "bg-red-500"
                                                    : "bg-primary-500"
                                            }`}
                                            style={{
                                                width: `${percentage}%`,
                                            }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>0</span>
                                        <span>
                                            {Math.round(percentage)}% Full
                                        </span>
                                        <span>{room.capacity}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4">
                    <Card title="System Alerts">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <div>
                                    <span className="font-bold">
                                        Maintenance Required
                                    </span>
                                    <p className="text-xs mt-1">
                                        Zoom Pod 1 needs ventilation check.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-primary-50 text-yellow-800 rounded-md text-sm">
                                <Briefcase className="w-5 h-5 shrink-0" />
                                <div>
                                    <span className="font-bold">
                                        Staff Meeting
                                    </span>
                                    <p className="text-xs mt-1">
                                        Reviewing Q4 targets at 14:00.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-full flex-col gap-2 p-4 hover:border-primary-500 hover:bg-primary-50">
                            <Briefcase className="w-6 h-6 text-secondary-600" />
                            <span className="text-sm">Employees</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-full flex-col gap-2 p-4 hover:border-primary-500 hover:bg-primary-50">
                            <Video className="w-6 h-6 text-secondary-600" />
                            <span className="text-sm">Cameras</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-full flex-col gap-2 p-4 hover:border-primary-500 hover:bg-primary-50">
                            <FileText className="w-6 h-6 text-secondary-600" />
                            <span className="text-sm">Reports</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-full flex-col gap-2 p-4 hover:border-primary-500 hover:bg-primary-50">
                            <Activity className="w-6 h-6 text-secondary-600" />
                            <span className="text-sm">Health</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
