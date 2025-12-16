"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function WithdrawPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
    }, [user, loading]);

    const USDT_TO_INR_RATE = 92;

    const handleWithdraw = async (e: any) => {
        e.preventDefault();
        if (!amount || !walletAddress) return alert('Please fill all fields');
        if (parseFloat(amount) > user.balance) return alert('Insufficient Balance');

        try {
            await axios.post('https://betsite-h7wh.onrender.com/api/wallet/withdraw', {
                amount: parseFloat(amount),
                bankDetails: walletAddress
            });
            alert('Withdrawal Request Submitted!');
            setAmount('');
            setWalletAddress('');
            router.push('/transactions');
        } catch (err: any) {
            alert(err.response?.data?.msg || 'Failed to submit withdrawal');
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] text-white pb-20 font-sans">
            {/* Header */}
            <div className="flex items-center p-4 bg-[#3d1212] shadow-md sticky top-0 z-10">
                <button onClick={() => router.back()} className="mr-4 text-white hover:text-gray-200 transition-colors">
                    <FaArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold flex-1 text-center mr-8 text-[#f0c059]">Withdraw</h1>
            </div>

            <div className="p-5">
                {/* Available Balance */}

                <div className="mt-4 mb-8 relative">
                    <div className="border border-[#f0c059] rounded-xl p-8 bg-[#1f0505]/50 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(240,192,89,0.1)]">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <p className="text-sm font-medium text-white tracking-wide">Available Balance</p>
                            <span className="text-xs">↻</span>
                        </div>
                        <h2 className="text-4xl font-bold text-[#f0c059] mt-1 tracking-wider flex items-center justify-center gap-3">
                            <img src="/images/coin_icon.png" alt="Coin" className="w-12 h-12 object-contain" />
                            {user.balance.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                    {/* Amount Input */}
                    {/* Amount Input Section */}
                    <div>
                        <label className="text-sm font-bold text-white mb-2 block">Withdrawal Amount</label>
                        <div className="flex items-center gap-2">
                            {/* Coins Input */}
                            <div className="flex-1 border border-[#f0c059] rounded-lg bg-[#3d1212] p-3 flex items-center justify-between shadow-inner">
                                <span className="text-[#f0c059] font-bold text-sm mr-2">Coins</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full bg-transparent text-white font-bold text-right outline-none placeholder-gray-500"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            {/* Equal Sign */}
                            <div className="text-[#f0c059] font-bold text-xl">=</div>

                            {/* USDT Display */}
                            <div className="flex-1 border border-[#f0c059] rounded-lg bg-[#3d1212] p-3 flex items-center justify-between shadow-inner">
                                <span className="text-[#f0c059] font-bold text-sm mr-2">USDT</span>
                                <div className="text-white font-bold text-right w-full">
                                    {amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * 0.0097).toFixed(2) : "0.00"}
                                </div>
                            </div>
                        </div>

                        {/* Fee Display */}
                        {amount && !isNaN(parseFloat(amount)) && (
                            <p className="text-xs text-red-500 mt-2 font-medium">
                                Fee: {(parseFloat(amount) * 0.05).toFixed(0)}, to account {(parseFloat(amount) * 0.95).toFixed(0)}
                            </p>
                        )}
                    </div>

                    {/* Wallet Address Input */}
                    <div>
                        <label className="text-xs text-gray-400 font-medium mb-1.5 block">Wallet Address (USDT TRC20)</label>
                        <div className="bg-[#4a1818] rounded-xl border border-[#f0c059]/30 overflow-hidden">
                            <input
                                type="text"
                                value={walletAddress}
                                onChange={e => setWalletAddress(e.target.value)}
                                className="w-full p-4 bg-transparent text-white focus:outline-none placeholder-gray-500 font-medium"
                                placeholder="Enter wallet address"
                                required
                            />
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="bg-[#3d1212]/80 p-4 rounded-xl border border-red-900/50 backdrop-blur-sm">
                        <div className="flex gap-3">
                            <div className="text-[#f0c059] text-xl">ⓘ</div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Please ensure the wallet address is correct. Withdrawals are processed within 24 hours. The minimum withdrawal amount is ₹500.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-full shadow-lg shadow-red-900/50 hover:opacity-95 active:scale-95 transition-all uppercase tracking-wider text-sm mt-4">
                        Confirm Withdrawal
                    </button>
                </form>
            </div>
        </div>
    );
}
