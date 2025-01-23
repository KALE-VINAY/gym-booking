// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      router.push('/dashboard'); // Redirect to the dashboard after login
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white p-6 rounded shadow-md space-y-4"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
