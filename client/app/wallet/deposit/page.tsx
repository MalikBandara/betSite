"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { FaArrowLeft } from 'react-icons/fa';

export default function DepositPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [proof, setProof] = useState('');
    const [qrUrl, setQrUrl] = useState('');

    const WALLET_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // Example TRX Address

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) {
            generateQR();
        }
    }, [user, loading]);

    const generateQR = async () => {
        try {
            const url = await QRCode.toDataURL(WALLET_ADDRESS);
            setQrUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    const USDT_TO_INR_RATE = 92;

    const handleDeposit = async (e: any) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/wallet/deposit', { amount, proof });
            alert('Deposit Request Submitted!');
            setAmount('');
            setProof('');
            router.push('/transactions');
        } catch (err) {
            alert('Failed to submit deposit');
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] text-white pb-20">
            {/* Header */}
            <div className="flex items-center p-4 bg-[#3d1212] shadow-md sticky top-0 z-10">
                <button onClick={() => router.back()} className="mr-4 text-white hover:text-gray-200 transition-colors">
                    <FaArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold flex-1 text-center mr-8 text-[#f0c059]">Deposit</h1>
            </div>

            <div className="p-5">
                {/* Currency and Network */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-2 font-medium">Deposit Currency</p>
                        <div className="bg-[#4a1818] p-3 rounded-lg border border-[#f0c059]/30 flex items-center gap-2 shadow-inner">
                            <span className="bg-green-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">T</span>
                            <span className="font-bold text-sm">USDT</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-2 font-medium">Choose Network</p>
                        <div className="bg-[#4a1818] p-3 rounded-lg border border-[#f0c059]/30 flex items-center gap-2 shadow-inner">
                            <span className="bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">T</span>
                            <span className="font-bold text-sm">TRC20</span>
                        </div>
                    </div>
                </div>

                {/* Recharge Address */}
                <div className="mb-8">
                    <p className="text-xs text-gray-400 mb-2 font-medium">Recharge Address</p>
                    <div className="bg-[#4a1818] p-4 rounded-xl border border-[#f0c059]/50 flex items-center justify-between mb-4 shadow-lg relative overflow-hidden group">
                        <p className="text-xs text-gray-300 font-mono truncate mr-2 select-all">{WALLET_ADDRESS}</p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(WALLET_ADDRESS);
                                alert("Address copied!");
                            }}
                            className="text-[#f0c059] hover:text-white transition-colors"
                        >
                            <span className="text-xl">📋</span>
                        </button>
                    </div>

                    {/* QR Code (Optional display) */}
                    {qrUrl && (
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-2 rounded-xl">
                                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Amount and Proof Form */}
                <form onSubmit={handleDeposit} className="space-y-5 mb-8">
                    <div>
                        <label className="text-xs text-gray-400 font-medium mb-1.5 block">Deposit Amount (Coins)</label>
                        <div className="bg-[#4a1818] rounded-xl border border-[#f0c059]/30 overflow-hidden">
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full p-4 bg-transparent text-white focus:outline-none placeholder-gray-500 font-medium"
                                placeholder="Enter coins (e.g. 1000)"
                                required
                            />
                        </div>
                        {amount && !isNaN(parseFloat(amount)) && (
                            <div className="mt-2 text-right">
                                <p className="text-xs text-gray-400">Payment Required:</p>
                                <div className="flex flex-col items-end">
                                    <p className="text-xl font-bold text-[#f0c059]">{(parseFloat(amount) / 100).toFixed(2)} USDT</p>

                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 font-medium mb-1.5 block">Transaction Hash (UTR)</label>
                        <div className="bg-[#4a1818] rounded-xl border border-[#f0c059]/30 overflow-hidden">
                            <input
                                type="text"
                                value={proof}
                                onChange={e => setProof(e.target.value)}
                                className="w-full p-4 bg-transparent text-white focus:outline-none placeholder-gray-500 font-medium"
                                placeholder="Paste transaction hash"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-full shadow-lg shadow-red-900/50 hover:opacity-95 active:scale-95 transition-all uppercase tracking-wider text-sm mt-4">
                        Confirm Deposit
                    </button>
                </form>

                {/* Recharge Tips */}
                <div className="bg-[#3d1212]/80 p-5 rounded-xl border border-red-900/50 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-3 text-sm">Recharge Tips</h3>
                    <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                        <li>1. The USDT recharge amount must be greater than or equal to: <span className="text-[#f0c059]">10 USDT</span> (1000 Coins).</li>
                        <li>2. The recharge address will be valid for 30mins. If you cannot recharge successfully in 30mins, the wallet address will be invalid.</li>
                        <li>3. If you have any other questions, please contact us at: <span className="text-red-500">support@colourbet.com</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
