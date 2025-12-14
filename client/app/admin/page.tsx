"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUser, FaSearch, FaHistory, FaCheck, FaTimes, FaBan, FaUnlock, FaWallet } from 'react-icons/fa';

const AdminPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'users'
    const [deposits, setDeposits] = useState<any[]>([]);

    // User Management State
    const [searchQuery, setSearchQuery] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) router.push('/');
        if (user && user.isAdmin) fetchPending();
    }, [user, loading]);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/wallet/admin/pending');
            setDeposits(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post('http://localhost:5000/api/wallet/admin/approve', { transactionId: id, action });
            fetchPending();
            alert(`Transaction ${action}ed`);
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleUserSearch = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/user/admin/search', { query: searchQuery });
            setFoundUser(res.data);
        } catch (err) {
            alert('User not found');
            setFoundUser(null);
        }
    };

    const handleBalanceUpdate = async (type: 'add' | 'deduct') => {
        if (!foundUser || !amount) return;
        try {
            const res = await axios.post('http://localhost:5000/api/user/admin/balance', {
                userId: foundUser._id,
                amount: parseFloat(amount),
                type
            });
            setFoundUser(res.data);
            alert(`Balance ${type === 'add' ? 'added' : 'deducted'} successfully`);
            setAmount('');
        } catch (err) {
            alert('Failed to update balance');
        }
    };

    const handleFreezeToggle = async () => {
        if (!foundUser) return;
        try {
            const res = await axios.post('http://localhost:5000/api/user/admin/freeze', { userId: foundUser._id });
            setFoundUser(res.data);
            alert(`User account ${res.data.isFrozen ? 'frozen' : 'activated'}`);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading || !user || !user.isAdmin) return <div>Access Denied</div>;

    return (
        <div className="min-h-screen bg-[#2a0e0e] pb-20 font-sans">
            <div className="bg-[#3d1212] p-4 text-[#f0c059] shadow-md border-b border-[#f0c059]/20 sticky top-0 z-20">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#3d1212] shadow-sm mb-4 border-b border-[#f0c059]/10">
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'transactions' ? 'border-b-2 border-[#f0c059] text-[#f0c059]' : 'text-gray-400 hover:text-[#f0c059]/70'}`}
                >
                    <FaHistory /> Transactions
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'users' ? 'border-b-2 border-[#f0c059] text-[#f0c059]' : 'text-gray-400 hover:text-[#f0c059]/70'}`}
                >
                    <FaUser /> User Management
                </button>
            </div>

            <div className="p-4 max-w-lg mx-auto">
                {activeTab === 'transactions' ? (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#f0c059] mb-2">Pending Requests</h2>
                        {deposits.length === 0 && <p className="text-gray-400 text-center py-8">No pending transactions.</p>}
                        {deposits.map((tx) => (
                            <div key={tx._id} className="bg-[#4a1818] p-4 rounded-xl shadow-lg border border-[#f0c059]/20">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-white">{tx.type === 'deposit' ? 'Depost Request' : 'Withdrawal Request'}</p>
                                        <p className="text-xs text-gray-400">User: {tx.user?.phone}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className={`text-right ${tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                                        <div className="text-lg font-bold flex items-center justify-end gap-1">
                                            <span>{tx.type === 'deposit' ? '+' : '-'}</span>
                                            {tx.amount} Coins
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {tx.type === 'deposit'
                                                ? `${(tx.amount / 100).toFixed(2)} USDT`
                                                : `${(tx.amount * 0.0097).toFixed(2)} USDT`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ≈ {tx.type === 'deposit'
                                                ? ((tx.amount / 100) * 92).toFixed(2)
                                                : ((tx.amount * 0.0097) * 92).toFixed(2)} INR
                                        </div>
                                    </div>
                                </div>

                                {tx.type === 'deposit' ? (
                                    <div className="bg-[#3d1212] p-2 rounded text-xs text-gray-300 mb-3 break-all border border-[#f0c059]/10">
                                        <strong className="text-[#f0c059]">Proof/Ref:</strong> {tx.proof}
                                    </div>
                                ) : (
                                    <div className="bg-[#3d1212] p-2 rounded text-xs text-gray-300 mb-3 break-all border border-[#f0c059]/10">
                                        <strong className="text-[#f0c059]">Bank Details:</strong> {tx.proof}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(tx._id, 'approve')} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold text-sm shadow-md hover:bg-green-600 flex items-center justify-center gap-1">
                                        <FaCheck /> Approve
                                    </button>
                                    <button onClick={() => handleAction(tx._id, 'reject')} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold text-sm shadow-md hover:bg-red-600 flex items-center justify-center gap-1">
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Search Box */}
                        <div className="bg-[#4a1818] p-4 rounded-xl shadow-lg border border-[#f0c059]/20">
                            <label className="text-xs font-bold text-[#f0c059] uppercase mb-2 block">Search User</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Phone Number or User ID"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-[#3d1212] border border-[#f0c059]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f0c059] placeholder-gray-500"
                                />
                                <button onClick={handleUserSearch} className="bg-[#f0c059] text-[#2a0e0e] p-2 rounded-lg shadow-md font-bold hover:bg-[#d9ab42]">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>

                        {/* User Details */}
                        {foundUser && (
                            <div className="bg-[#4a1818] p-5 rounded-xl shadow-lg border-t-4 border-[#f0c059]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">User Details</h3>
                                        <p className="text-gray-400 text-sm">ID: {foundUser._id}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${foundUser.isFrozen ? 'bg-red-900/50 text-red-400 border border-red-500/50' : 'bg-green-900/50 text-green-400 border border-green-500/50'}`}>
                                        {foundUser.isFrozen ? 'FROZEN' : 'ACTIVE'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#3d1212] p-3 rounded-lg text-center border border-[#f0c059]/10">
                                        <p className="text-xs text-gray-400 uppercase">Phone</p>
                                        <p className="font-bold text-white">{foundUser.phone}</p>
                                    </div>
                                    <div className="bg-[#3d1212] p-3 rounded-lg text-center border border-[#f0c059]/10">
                                        <p className="text-xs text-gray-400 uppercase">Balance</p>
                                        <p className="font-bold text-[#f0c059] text-xl flex items-center justify-center gap-1">
                                            <img src="/images/coin_icon.png" alt="Coin" className="w-4 h-4 object-contain" />
                                            {foundUser.balance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#f0c059] uppercase mb-2 block">Manage Balance</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="flex-1 bg-[#3d1212] border border-[#f0c059]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f0c059] placeholder-gray-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleBalanceUpdate('add')} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-600">
                                                + Add Money
                                            </button>
                                            <button onClick={() => handleBalanceUpdate('deduct')} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-orange-600">
                                                - Deduct Money
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#f0c059]/10">
                                        <button
                                            onClick={handleFreezeToggle}
                                            className={`w-full py-3 rounded-lg text-sm font-bold shadow flex items-center justify-center gap-2 ${foundUser.isFrozen ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                        >
                                            {foundUser.isFrozen ? <><FaUnlock /> Unfreeze Account</> : <><FaBan /> Freeze Account</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
