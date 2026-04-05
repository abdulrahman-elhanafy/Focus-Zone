import React from "react";
import { Card, Button, Badge } from "../components/Common";
import { Download, Calendar, Filter } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const data = [
    { name: "Jan", income: 12500, expense: 8400 },
    { name: "Feb", income: 15000, expense: 9100 },
    { name: "Mar", income: 14200, expense: 8800 },
    { name: "Apr", income: 16800, expense: 9500 },
    { name: "May", income: 18900, expense: 10200 },
    { name: "Jun", income: 21000, expense: 11000 },
];

const expenseBreakdown = [
    { name: "Rent & Utilities", value: 4500 },
    { name: "Salaries", value: 3800 },
    { name: "Maintenance", value: 1200 },
    { name: "Supplies", value: 800 },
    { name: "Marketing", value: 700 },
];

// Palette using Primary Yellow and Secondary Blue for the mix
const PIE_COLORS = ["#fbb315", "#477fc1", "#3462a4", "#ffc51f", "#2a4e83"];

const Reports: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900">
                        Financial Reports
                    </h2>
                    <p className="text-slate-500">
                        Detailed breakdown of revenue, expenses, and
                        profitability.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        <Calendar className="w-4 h-4 mr-2" /> This Year
                    </Button>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">
                        Net Profit (YTD)
                    </p>
                    <h3 className="text-3xl font-bold text-secondary-900 mt-2">
                        $42,850.00
                    </h3>
                    <Badge color="green">+12.5% vs last year</Badge>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">
                        Total Revenue (YTD)
                    </p>
                    <h3 className="text-3xl font-bold text-secondary-900 mt-2">
                        $98,400.00
                    </h3>
                    <Badge color="blue">On target</Badge>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">
                        Total Expenses (YTD)
                    </p>
                    <h3 className="text-3xl font-bold text-secondary-900 mt-2">
                        $55,550.00
                    </h3>
                    <Badge color="yellow">-2.4% vs projected</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Income vs Expenses">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                    tick={{ fill: "#64748b" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    }}
                                    cursor={{ fill: "#f8fafc" }}
                                />
                                <Legend />
                                {/* Income = Yellow, Expense = Blue */}
                                <Bar
                                    dataKey="income"
                                    fill="#fbb315"
                                    radius={[4, 4, 0, 0]}
                                    name="Income"
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="#477fc1"
                                    radius={[4, 4, 0, 0]}
                                    name="Expenses"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Expense Breakdown">
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value">
                                    {expenseBreakdown.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                PIE_COLORS[
                                                    index % PIE_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Profit & Loss Statement">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-secondary-700">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-right font-semibold text-secondary-700">
                                    Jun 2024
                                </th>
                                <th className="px-6 py-3 text-right font-semibold text-secondary-700">
                                    % of Rev
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="bg-slate-50/50">
                                <td
                                    className="px-6 py-2 font-bold text-secondary-800"
                                    colSpan={3}>
                                    Revenue
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Membership Fees
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $14,500.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    69.0%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Meeting Room Bookings
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $5,200.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    24.7%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Services & Amenities
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $1,300.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    6.1%
                                </td>
                            </tr>
                            <tr className="bg-green-50">
                                <td className="px-6 py-3 font-bold text-secondary-900">
                                    Total Revenue
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-secondary-900">
                                    $21,000.00
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-secondary-900">
                                    100%
                                </td>
                            </tr>

                            <tr className="bg-slate-50/50">
                                <td
                                    className="px-6 py-2 font-bold text-secondary-800"
                                    colSpan={3}>
                                    Expenses
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Rent & Utilities
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $4,500.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    21.4%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Salaries & Wages
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $3,800.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    18.0%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-2 text-slate-600 pl-10">
                                    Maintenance
                                </td>
                                <td className="px-6 py-2 text-right font-medium">
                                    $1,200.00
                                </td>
                                <td className="px-6 py-2 text-right text-slate-500">
                                    5.7%
                                </td>
                            </tr>
                            <tr className="bg-red-50">
                                <td className="px-6 py-3 font-bold text-secondary-900">
                                    Total Expenses
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-secondary-900">
                                    $11,000.00
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-secondary-900">
                                    52.3%
                                </td>
                            </tr>

                            <tr className="bg-primary-50 border-t-2 border-primary-200">
                                <td className="px-6 py-4 font-bold text-secondary-900 text-lg">
                                    Net Profit
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-700 text-lg">
                                    $10,000.00
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-700 text-lg">
                                    47.6%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
