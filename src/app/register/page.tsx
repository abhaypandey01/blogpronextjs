"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useNotification,
    NotificationProvider,
} from "@/components/Notification";

function RegisterForm() {
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [confirmPassword, setConfirmPassword] = useState<string | null>("");
    const { showNotification } = useNotification();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = res.json();
            console.log(data);

            if (!res.ok) {
                throw new Error("Registration failed");
            }
            showNotification("Registration successful! Please log in.", "success");
            router.push("/login");
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : "Registration failed",
                "error"
            );
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-4">Register</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
            </div>
            <div>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Register(){
    return (
        <NotificationProvider>
            <RegisterForm />
        </NotificationProvider>
    )
};
