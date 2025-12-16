"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ActivityPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [bets, setBets] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) fetchBets();
    }, [user, loading]);

    const fetchBets = async () => {
        try {
            const res = await axios.get('https://betsite-h7wh.onrender.com/api/game/my-bets');
            setBets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] pb-24 font-sans">
            {/* Header */}
            <div className="bg-[#3d1212] px-4 py-4 sticky top-0 z-10 shadow-md border-b border-[#f0c059]/20 flex items-center justify-center mb-4">
                <h1 className="text-lg font-bold text-[#f0c059]">Bet History</h1>
            </div>

            <div className="px-4 space-y-3">
                {bets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    bets.map((bet) => (
                        <div key={bet._id} className="bg-[#4a1818] p-4 rounded-xl shadow-lg border border-[#f0c059]/30 relative overflow-hidden">
                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${bet.status === 'win' ? 'bg-green-500' :
                                bet.status === 'loss' ? 'bg-red-500' : 'bg-yellow-400'
                                }`}></div>

                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Period</p>
                                    <p className="text-sm font-bold text-white font-mono">{bet.periodId}</p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${bet.status === 'win' ? 'bg-green-50 text-green-600 border border-green-100' :
                                    bet.status === 'loss' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                    }`}>
                                    {bet.status}
                                </div>
                            </div>

                            <div className="bg-[#3d1212] rounded-lg p-3 flex justify-between items-center mb-3 ml-2 border border-[#f0c059]/10">
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-1">Select</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${['green', 'red', 'violet'].includes(bet.selection?.toLowerCase())
                                            ? `bg-${bet.selection.toLowerCase()}-500`
                                            : 'bg-blue-500'
                                            }`}></div>
                                        <span className="font-bold text-gray-200 capitalize text-sm">{bet.selection}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 mb-1">Amount</p>
                                    <p className="font-bold text-white text-sm flex items-center justify-end gap-1">
                                        <img src="/images/coin_icon.png" alt="Coin" className="w-3 h-3 object-contain" />
                                        {bet.amount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pl-2 pt-1 border-t border-[#f0c059]/10">
                                <p className="text-xs text-gray-400">{new Date(bet.createdAt || Date.now()).toLocaleDateString()}</p>
                                <div className="text-right">
                                    {bet.status === 'win' ? (
                                        <p className="text-green-600 font-black text-lg flex items-center justify-end gap-1">
                                            +<img src="/images/coin_icon.png" alt="Coin" className="w-4 h-4 object-contain" />
                                            {bet.winAmount}
                                        </p>
                                    ) : bet.status === 'loss' ? (
                                        <p className="text-red-500 font-black text-lg flex items-center justify-end gap-1">
                                            -<img src="/images/coin_icon.png" alt="Coin" className="w-4 h-4 object-contain" />
                                            {bet.amount}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 font-bold text-sm">--</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
