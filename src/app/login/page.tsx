"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification, NotificationProvider } from "@/components/Notification";
import Link from "next/link";


function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-center flex flex-col justify-center items-center">
      <h2 className="text-2xl font-extrabold mb-10">Log In</h2>
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
              className="w-full px-3 py-2 border rounded bg-gray-700"
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
              className="w-full px-3 py-2 border rounded bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-400"
          >
            Login
          </button>
        </form>
        <div className="mt-20 text-center flex flex-col justify-center">
        <p className="font-bold text-xl text-gray-300">Don't have an account ?</p>
        <Link
          href={"/register"}
          className="py-3 px-5 mt-10 bg-neutral-300 hover:bg-neutral-400 text-lg text-black transition-colors rounded-lg shadow-md"
          >
          Register
        </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login(){
    return (
        <NotificationProvider>
            <LoginForm />
        </NotificationProvider>
    );
}
