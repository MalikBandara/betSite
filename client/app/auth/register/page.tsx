"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const { register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(phone, password, inviteCode);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#2a0e0e]">
            <h1 className="text-3xl font-black italic text-[#f0c059] mb-8 tracking-tighter">RichWin</h1>
            <div className="w-full max-w-sm bg-[#4a1818] p-8 rounded-2xl shadow-xl border border-[#f0c059]/20">
                <h2 className="text-xl font-bold mb-6 text-center text-white">Register</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-900/20 p-2 rounded border border-red-500/50">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#f0c059] mb-1 font-medium">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#3d1212] text-white border border-[#f0c059]/30 focus:border-[#f0c059] focus:outline-none transition-colors"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#f0c059] mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#3d1212] text-white border border-[#f0c059]/30 focus:border-[#f0c059] focus:outline-none transition-colors"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#f0c059] mb-1 font-medium">Invite Code</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#3d1212] text-white border border-[#f0c059]/30 focus:border-[#f0c059] focus:outline-none transition-colors"
                            placeholder="Enter invite code"
                        />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#f0c059] to-[#bf953f] text-[#2a0e0e] font-black rounded-xl hover:opacity-90 shadow-lg mt-2 active:scale-95 transition-transform uppercase tracking-wider text-sm border border-[#fff5d6]/20">
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-400">Already have an account? <Link href="/auth/login" className="text-[#f0c059] font-bold hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
}
