"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';


export default function WalletPage() {
    const { user, loading } = useAuth();
    const router = useRouter();






    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) {

        }
    }, [user, loading]);



    if (loading || !user) return <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] text-white pb-24 font-sans">
            {/* Header */}
            <div className="p-4 pt-8 text-center sticky top-0 bg-[#2a0e0e] z-10">
                <h1 className="text-xl font-bold text-[#f0c059] tracking-wide">Wallet</h1>
            </div>

            <div className="px-5">
                {/* Balance Card */}
                <div className="mt-4 mb-8 relative">
                    <div className="border border-[#f0c059] rounded-xl p-8 bg-[#1f0505]/50 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(240,192,89,0.1)]">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <p className="text-sm font-medium text-white tracking-wide">Total Balance</p>
                            <span className="text-xs">↻</span>
                        </div>
                        <h2 className="text-4xl font-bold text-[#f0c059] mt-1 tracking-wider flex items-center justify-center gap-3">
                            <img src="/images/coin_icon.png" alt="Coin" className="w-12 h-12 object-contain" />
                            {user.balance.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>

                {/* Deposit & Withdraw Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => router.push('/wallet/deposit')}
                        className="flex-1 bg-gradient-to-b from-[#8b0000] to-[#5c0000] border border-red-900/50 rounded-2xl py-4 px-2 flex items-center justify-center gap-2 relative overflow-hidden group shadow-lg active:scale-95 transition-all"
                    >
                        <div className="bg-[#a81c1c] p-1.5 rounded-lg shadow-inner flex-shrink-0">
                            <img src="/images/deposit_icon.png" alt="Deposit" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="font-bold text-white text-base tracking-wide">Deposit</span>
                    </button>

                    <button
                        onClick={() => router.push('/wallet/withdraw')}
                        className="flex-1 bg-gradient-to-b from-[#8b0000] to-[#5c0000] border border-red-900/50 rounded-2xl py-4 px-2 flex items-center justify-center gap-2 relative overflow-hidden group shadow-lg active:scale-95 transition-all"
                    >
                        <div className="bg-[#a81c1c] p-1.5 rounded-lg shadow-inner flex-shrink-0">
                            <img src="/images/withdraw_icon.png" alt="Withdraw" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="font-bold text-white text-base tracking-wide whitespace-nowrap">Withdraw</span>
                    </button>
                </div>

                {/* Transaction Button */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/transactions')}
                        className="w-full bg-[#1f0505] border border-red-900/30 rounded-2xl p-4 flex items-center justify-between hover:bg-[#2f0a0a] transition-all active:scale-95 shadow-md group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#a81c1c] p-2 rounded-lg shadow-inner">
                                <span className="text-xl">📜</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-lg">Transaction</p>
                                <p className="text-xs text-gray-400">View your history</p>
                            </div>
                        </div>
                        <span className="text-gray-500 group-hover:translate-x-1 transition-transform">›</span>
                    </button>
                </div>

                {/* Promotional Banner */}
                <div className="rounded-xl overflow-hidden shadow-lg border border-[#f0c059]/20 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
                    <img
                        src="/images/deposit_banner.png"
                        alt="Deposit Rewards"
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-4 z-20">
                        <p className="text-white font-bold text-shadow-sm">Member Recharge Week</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
