'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoOkft from '/public/logo-okft.png';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded.role;

        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'student') {
          router.push('/');
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsCheckingToken(false);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });

      if (!res.ok) {
        alert('Login gagal. Periksa NIM atau password Anda.');
        return;
      }

      const data = await res.json();
      const token = data.access_token;

      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'student') {
        router.push('/dashboard');
      } else {
        alert('Role tidak dikenali.');
        localStorage.removeItem('token');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat login.');
    }
  };

  if (isCheckingToken) {
    return <div>Loading...</div>;
  }


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-l from-red-700 to-black">
      <nav className="flex items-center justify-start px-12 py-6">
        <Image src={logoOkft} alt="OKFT Logo" className="h-14 w-auto" />
        <span className="ml-4 text-white font-extrabold text-2xl">OKFT-UH</span>
      </nav>
      <main className="flex-grow flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-gray-100 bg-opacity-10 backdrop-blur-md rounded-lg p-10 w-full max-w-md shadow-lg"
        >
          <h1 className="text-white text-4xl font-extrabold mb-8 text-center">
            Masuk ke Akun Anda
          </h1>
          <label className="block mb-4">
            <span className="text-white font-semibold mb-1 block">Student ID</span>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-md px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Masukkan Student ID"
            />
          </label>
          <label className="block mb-6">
            <span className="text-white font-semibold mb-1 block">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-3 rounded-md"
          >
            Masuk
          </button>
        </form>
      </main>
    </div>
  );
}
