import React, { useState, useEffect } from "react";
import { Customer } from "../types";
import { Card, Input, Button, Badge, Modal } from "../components/Common";
import {
    Search,
    Plus,
    Filter,
    FileText,
    User,
    Phone,
    Clock,
    Loader2,
    Save,
} from "lucide-react";
import { API } from "../services/api";

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Customer Form State
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        age: 25,
        gender: "Male",
        membership: "Basic",
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        const data = await API.customers.getAll();
        setCustomers(data);
        setLoading(false);
    };

    const handleCreateCustomer = async () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
            alert("Please provide the customer's name, email, and phone number.");
            return;
        }
        try {
            await API.customers.create(newCustomer as any);
            setIsAddModalOpen(false);
            setNewCustomer({
                name: "",
                phone: "",
                email: "",
                age: 25,
                gender: "Male",
                membership: "Basic",
            }); // Reset
            loadCustomers(); // Reload list
        } catch (error: any) {
            alert("Failed to create customer: " + error.message);
        }
    };

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Customer Database
                    </h2>
                    <p className="text-slate-500">
                        Manage client profiles and view visit history.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Customer
                    </Button>
                </div>
            </div>

            <Card>
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by name, phone..."
                            icon={<Search className="w-4 h-4" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-0"
                        />
                    </div>
                    <Button variant="secondary">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Demographics
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Membership
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Balance
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredCustomers.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {c.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        ID: {c.id.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900 flex items-center gap-1">
                                                <Phone className="w-3 h-3 text-slate-400" />{" "}
                                                {c.phone}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {c.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-700">
                                                {c.gender}, {c.age}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                color={
                                                    c.membership ===
                                                    "Enterprise"
                                                        ? "blue"
                                                        : c.membership ===
                                                          "Premium"
                                                        ? "green"
                                                        : "gray"
                                                }>
                                                {c.membership}
                                            </Badge>
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                c.balance > 0
                                                    ? "text-red-600"
                                                    : "text-slate-700"
                                            }`}>
                                            ${c.balance.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    setSelectedCustomer(c)
                                                }
                                                className="text-primary-600 hover:text-primary-900 hover:bg-primary-50 px-3 py-1 rounded-md transition-colors">
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCustomers.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No customers found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Add Customer Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Customer">
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        value={newCustomer.name}
                        onChange={(e) =>
                            setNewCustomer({
                                ...newCustomer,
                                name: e.target.value,
                            })
                        }
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone"
                            value={newCustomer.phone}
                            onChange={(e) =>
                                setNewCustomer({
                                    ...newCustomer,
                                    phone: e.target.value,
                                })
                            }
                        />
                        <Input
                            label="Email"
                            value={newCustomer.email}
                            onChange={(e) =>
                                setNewCustomer({
                                    ...newCustomer,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Gender
                            </label>
                            <select
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm"
                                value={newCustomer.gender}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        gender: e.target.value as any,
                                    })
                                }>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Age
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm"
                                value={newCustomer.age}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        age: parseInt(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Membership
                        </label>
                        <select
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm"
                            value={newCustomer.membership}
                            onChange={(e) =>
                                setNewCustomer({
                                    ...newCustomer,
                                    membership: e.target.value as any,
                                })
                            }>
                            <option>Basic</option>
                            <option>Premium</option>
                            <option>Enterprise</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCustomer}>
                            <Save className="w-4 h-4 mr-2" /> Save Customer
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Customer Detail Modal */}
            <Modal
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                title="Customer Profile"
                width="max-w-2xl">
                {selectedCustomer && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-bold">
                                {selectedCustomer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {selectedCustomer.name}
                                </h3>
                                <p className="text-slate-500 flex items-center gap-2 text-sm mt-1">
                                    <User className="w-3 h-3" />{" "}
                                    {selectedCustomer.gender},{" "}
                                    {selectedCustomer.age} years old
                                </p>
                                <p className="text-slate-500 flex items-center gap-2 text-sm">
                                    <Phone className="w-3 h-3" />{" "}
                                    {selectedCustomer.phone}
                                </p>
                                <div className="mt-2">
                                    <Badge
                                        color={
                                            selectedCustomer.membership ===
                                            "Enterprise"
                                                ? "blue"
                                                : selectedCustomer.membership ===
                                                  "Premium"
                                                ? "green"
                                                : "gray"
                                        }>
                                        {selectedCustomer.membership} Member
                                    </Badge>
                                </div>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-xs text-slate-500">
                                    Current Balance
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        selectedCustomer.balance > 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}>
                                    ${selectedCustomer.balance.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Visit History
                            </h4>
                            {selectedCustomer.history.length > 0 ? (
                                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-slate-500 font-medium">
                                                    Date
                                                </th>
                                                <th className="px-4 py-2 text-left text-slate-500 font-medium">
                                                    Activity
                                                </th>
                                                <th className="px-4 py-2 text-left text-slate-500 font-medium">
                                                    Duration
                                                </th>
                                                <th className="px-4 py-2 text-right text-slate-500 font-medium">
                                                    Cost
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {selectedCustomer.history.map(
                                                (h, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-2 text-slate-700">
                                                            {h.date}
                                                        </td>
                                                        <td className="px-4 py-2 text-slate-700">
                                                            {h.action}
                                                        </td>
                                                        <td className="px-4 py-2 text-slate-500">
                                                            {h.duration || "-"}
                                                        </td>
                                                        <td className="px-4 py-2 text-right font-medium text-slate-700">
                                                            ${h.cost}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">
                                    No visit history recorded.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedCustomer(null)}>
                                Close
                            </Button>
                            <Button>Edit Profile</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Customers;
