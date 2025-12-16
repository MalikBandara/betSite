"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const MyBetsHistory = ({ onClose }: { onClose: () => void }) => {
    const [bets, setBets] = useState<any[]>([]);
    const { user } = useAuth();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (token) {
            fetchMyBets();
        }
    }, [token]);

    const fetchMyBets = async () => {
        try {
            const res = await axios.get('https://betsite-h7wh.onrender.com/api/game/my-bets', {
                headers: { 'x-auth-token': token }
            });
            setBets(res.data);
        } catch (err) {
            console.error("Failed to fetch bets", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full sm:w-[480px] h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="bg-[#3d1212] p-4 flex items-center justify-between text-white shrink-0">
                    <h2 className="text-lg font-bold text-[#f0c059]">My Betting Record</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {bets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                            <span className="text-4xl mb-2"></span>
                            <p>No records found</p>
                        </div>
                    ) : (
                        bets.map((bet, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-gray-800">{bet.periodId}</span>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 uppercase font-bold">
                                                {bet.timeFrame || '3Min'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(bet.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-xs font-bold capitalize ${bet.status === 'win' ? 'bg-green-100 text-green-600' :
                                        bet.status === 'loss' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {bet.status}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Selection</span>
                                            <span className={`font-bold capitalize ${bet.type === 'color' ? (
                                                bet.selection === 'green' ? 'text-green-500' :
                                                    bet.selection === 'red' ? 'text-red-500' : 'text-violet-500'
                                            ) : 'text-gray-800'
                                                }`}>
                                                {bet.selection}
                                            </span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-100"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Amount</span>
                                            <span className="font-bold text-gray-800">
                                                {bet.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {bet.status === 'win' && (
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Win</span>
                                            <p className="font-bold text-green-500">+{bet.winAmount.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyBetsHistory;
