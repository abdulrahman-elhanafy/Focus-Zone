import React, { useState } from "react";
import { User, Role } from "../types";
import { Button, Input, Card } from "../components/Common";
import { Building2, KeyRound, User as UserIcon, Loader2 } from "lucide-react";
import { API } from "../services/api";

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const user = await API.auth.login(username, password);
            onLogin(user);
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                {/* Blue container with Yellow Icon */}
                <div className="bg-secondary-900 p-3 rounded-xl inline-flex mb-4 shadow-lg">
                    <Building2 className="w-8 h-8 text-primary-500" />
                </div>
                <h1 className="text-3xl font-bold text-secondary-900">
                    FocusZone
                </h1>
                <p className="text-secondary-500 mt-2">Co-Work Space System</p>
            </div>

            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary-500">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-secondary-800">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-slate-500">
                            Please sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<UserIcon size={18} />}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<KeyRound size={18} />}
                    />

                    <Button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full font-bold"
                        size="lg">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                Signing In...
                            </>
                        ) : (
                            "Login to Dashboard"
                        )}
                    </Button>

                    <div className="mt-6 p-4 bg-secondary-50 rounded-md text-xs text-secondary-600">
                        <p className="font-semibold mb-1 text-secondary-800">
                            Demo Credentials:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <span
                                onClick={() => {
                                    setUsername("recep");
                                    setPassword("123");
                                }}
                                className="cursor-pointer hover:text-primary-600">
                                Reception: <strong>recep</strong>
                            </span>
                            <span
                                onClick={() => {
                                    setUsername("owner");
                                    setPassword("123");
                                }}
                                className="cursor-pointer hover:text-primary-600">
                                Owner: <strong>owner</strong>
                            </span>
                            <span
                                onClick={() => {
                                    setUsername("acct");
                                    setPassword("123");
                                }}
                                className="cursor-pointer hover:text-primary-600">
                                Acct: <strong>acct</strong>
                            </span>
                        </div>
                    </div>
                </form>
            </Card>

            <p className="mt-8 text-slate-400 text-sm">
                © 2025 FocusZone Inc. v1.1.0 (Local Backend)
            </p>
        </div>
    );
};

export default Login;
