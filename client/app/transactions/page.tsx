"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function TransactionsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (user) {
            fetchTransactions();
        }
    }, [user, loading]);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/wallet/history');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] text-white pb-24">
            {/* Header */}
            <div className="flex items-center p-4 bg-[#3d1212] shadow-md sticky top-0 z-10">
                <button onClick={() => router.back()} className="mr-4 text-white hover:text-gray-200 transition-colors">
                    <FaArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold flex-1 text-center mr-8 text-[#f0c059]">Transaction History</h1>
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="text-center text-gray-400 py-10">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No transactions found</div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map(tx => (
                            <div key={tx._id} className="bg-[#4a1818] p-4 rounded-xl flex justify-between items-center border border-[#f0c059]/30 shadow-md">
                                <div>
                                    <p className={`font-bold uppercase text-sm text-gray-200`}>{tx.type}</p>
                                    <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}</p>
                                    {tx.proof && <p className="text-[10px] text-gray-500 font-mono mt-1 w-32 truncate">{tx.proof}</p>}
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center justify-end gap-1 font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                                        <span>{tx.type === 'deposit' ? '+' : '-'}</span>
                                        <img src="/images/coin_icon.png" alt="Coin" className="w-4 h-4 object-contain" />
                                        <span>{tx.amount}</span>
                                    </div>

                                    <p className={`text-xs capitalize font-bold ${tx.status === 'approved' ? 'text-green-500' :
                                        tx.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                                        }`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
