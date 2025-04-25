'use client'
import React,{useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { POST } from '../api/videos/route';


function Register() {
    const [email, setEmail] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [confirmPasssword, setconfirmPassword] = useState<string | null>("");
    const [error, setError] = useState<string | null>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPasssword){
            setError("Confirm password mismatch.");
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });
            const data = res.json();
            if(!res.ok){
                setError("Registration failed.");
            }
            router.push("/login");
        } catch (error) {
            setError("Problem while registering the user.")
        }
    }

  return (
    <div>Register</div>
  )
}

export default Register