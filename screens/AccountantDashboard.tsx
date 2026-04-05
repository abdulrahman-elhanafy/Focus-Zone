import React from "react";
import { MOCK_TRANSACTIONS } from "../constants";
import { Card, Button, Badge, StatCard } from "../components/Common";
import {
    Download,
    PlusCircle,
    Wallet,
    CreditCard,
    PieChart,
} from "lucide-react";

const AccountantDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Financial Overview
                    </h2>
                    <p className="text-slate-500">
                        Track income, expenses, and cash flow.
                    </p>
                </div>
                <div className="space-x-2">
                    <Button variant="secondary" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button size="sm">
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Expense
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Income (Oct)"
                    value="$12,450"
                    icon={<Wallet className="w-6 h-6" />}
                    trend="+5%"
                    trendUp={true}
                />
                <StatCard
                    title="Total Expenses (Oct)"
                    value="$4,200"
                    icon={<CreditCard className="w-6 h-6" />}
                    trend="-1%"
                    trendUp={true}
                />
                <StatCard
                    title="Net Profit"
                    value="$8,250"
                    icon={<PieChart className="w-6 h-6" />}
                    trend="+8%"
                    trendUp={true}
                />
            </div>

            <Card title="Recent Transactions">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_TRANSACTIONS.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {t.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {t.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Badge
                                            color={
                                                t.category === "Income"
                                                    ? "green"
                                                    : "red"
                                            }>
                                            {t.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {t.method}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                                            t.category === "Income"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}>
                                        {t.category === "Income" ? "+" : ""}$
                                        {Math.abs(t.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AccountantDashboard;
