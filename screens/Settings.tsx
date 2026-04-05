import React, { useState } from "react";
import { Card, Button, Input } from "../components/Common";
import { Save, Shield, CreditCard, Building, Mail, Bell } from "lucide-react";

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        "general" | "pricing" | "security"
    >("general");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                    System Settings
                </h2>
                <p className="text-slate-500">
                    Manage your workspace configuration and preferences.
                </p>
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
                {["general", "pricing", "security"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                            activeTab === tab
                                ? "bg-white text-secondary-900 shadow-sm text-primary-600"
                                : "text-slate-500 hover:text-slate-700"
                        }`}>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "general" && (
                <Card title="General Information">
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-secondary-900 rounded-lg flex items-center justify-center text-primary-500">
                                <Building size={32} />
                            </div>
                            <div>
                                <Button variant="outline" size="sm">
                                    Change Logo
                                </Button>
                            </div>
                        </div>
                        <Input
                            label="Workspace Name"
                            defaultValue="FocusZone Co-working"
                        />
                        <Input
                            label="Business Email"
                            defaultValue="admin@focuszone.com"
                            icon={<Mail size={16} />}
                        />
                        <Input
                            label="Address"
                            defaultValue="123 Startup Blvd, Tech City, EG"
                        />

                        <div className="pt-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">
                                Regional Settings
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Currency"
                                    defaultValue="USD ($)"
                                />
                                <Input
                                    label="Timezone"
                                    defaultValue="(GMT+02:00) Cairo"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button>
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === "pricing" && (
                <Card title="Default Pricing Configuration">
                    <p className="text-sm text-slate-500 mb-6">
                        Set the base hourly rates for different room types.
                        These can be overridden per room.
                    </p>
                    <div className="space-y-4 max-w-lg">
                        <div className="grid grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-900">
                                    Hot Desk
                                </label>
                                <span className="text-xs text-slate-500">
                                    Per person / hour
                                </span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500"
                                    defaultValue="5.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-900">
                                    Private Office
                                </label>
                                <span className="text-xs text-slate-500">
                                    Per room / hour
                                </span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500"
                                    defaultValue="40.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-900">
                                    Meeting Room
                                </label>
                                <span className="text-xs text-slate-500">
                                    Standard 6-8 pax
                                </span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500"
                                    defaultValue="25.00"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button>
                                <CreditCard className="w-4 h-4 mr-2" /> Update
                                Rates
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === "security" && (
                <div className="space-y-6">
                    <Card title="Access Control">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        Require Check-in Approval
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Reception must approve every check-in
                                        manually.
                                    </p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle1"
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-primary-500 checked:bg-primary-500"
                                    />
                                    <label
                                        htmlFor="toggle1"
                                        className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        Two-Factor Authentication (Staff)
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Enforce 2FA for Owner and Accountant
                                        accounts.
                                    </p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle2"
                                        defaultChecked
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-primary-500 checked:bg-primary-500"
                                    />
                                    <label
                                        htmlFor="toggle2"
                                        className="toggle-label block overflow-hidden h-6 rounded-full bg-primary-200 cursor-pointer"></label>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Notifications">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 rounded"
                                    defaultChecked
                                />
                                <span className="text-sm text-slate-700">
                                    Email me when daily revenue exceeds $1,000
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 rounded"
                                    defaultChecked
                                />
                                <span className="text-sm text-slate-700">
                                    Alert me for low stock on Service items
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 rounded"
                                />
                                <span className="text-sm text-slate-700">
                                    Weekly PDF report digest
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="secondary">
                                <Bell className="w-4 h-4 mr-2" /> Save
                                Preferences
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Toggle Switch Styles helper */}
            <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #fbb315;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #ffe685;
        }
        .toggle-checkbox {
            right: 50%;
            transition: all 0.3s;
        }
      `}</style>
        </div>
    );
};

export default Settings;
