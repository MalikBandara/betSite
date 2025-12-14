"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaWallet, FaHistory, FaUserCog, FaChevronRight, FaSignOutAlt, FaCopy } from 'react-icons/fa';

const AccountPage = () => {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) return null;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#2a0e0e] pb-24 font-sans">
            {/* Header / Profile Card */}
            <div className="bg-gradient-to-br from-[#3d1212] to-[#2a0e0e] p-6 pt-10 pb-16 rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b border-[#f0c059]/20">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0c059]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="flex flex-col items-center relative z-10">
                    <div className="w-24 h-24 bg-[#4a1818] backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold text-[#f0c059] mb-4 border-4 border-[#f0c059]/30 shadow-lg">
                        {user.phone?.[0]?.toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-[#f0c059] mb-1 shadow-sm">{user.phone}</h2>
                    <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
                        <span className="text-xs text-gray-200">ID: {user._id?.substring(0, 8)}...</span>
                    </div>
                    <div className="mt-4 flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                        <span className="text-sm font-medium text-yellow-100">Invite Code:</span>
                        <span className="text-lg font-bold text-yellow-300 tracking-wider">{user.inviteCode}</span>
                        <FaCopy className="text-yellow-200 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* Menu List */}
            <div className="px-4 -mt-8 relative z-20">
                <div className="bg-[#4a1818] rounded-2xl shadow-lg border border-[#f0c059]/20 overflow-hidden">
                    <Link href="/wallet" className="flex items-center justify-between p-4 hover:bg-[#3d1212] transition-colors border-b border-[#f0c059]/10 group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#3d1212] flex items-center justify-center text-[#f0c059] group-hover:bg-[#f0c059] group-hover:text-[#2a0e0e] transition-colors shadow-sm border border-[#f0c059]/20">
                                <FaWallet className="text-lg" />
                            </div>
                            <span className="font-semibold text-gray-200">Wallet</span>
                        </div>
                        <FaChevronRight className="text-gray-500 group-hover:text-[#f0c059] transition-colors text-sm" />
                    </Link>

                    <Link href="/activity" className="flex items-center justify-between p-4 hover:bg-[#3d1212] transition-colors border-b border-[#f0c059]/10 group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#3d1212] flex items-center justify-center text-[#f0c059] group-hover:bg-[#f0c059] group-hover:text-[#2a0e0e] transition-colors shadow-sm border border-[#f0c059]/20">
                                <FaHistory className="text-lg" />
                            </div>
                            <span className="font-semibold text-gray-200">Bet History</span>
                        </div>
                        <FaChevronRight className="text-gray-500 group-hover:text-[#f0c059] transition-colors text-sm" />
                    </Link>

                    {user.isAdmin && (
                        <Link href="/admin" className="flex items-center justify-between p-4 hover:bg-[#3d1212] transition-colors border-b border-[#f0c059]/10 group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-[#3d1212] flex items-center justify-center text-[#f0c059] group-hover:bg-[#f0c059] group-hover:text-[#2a0e0e] transition-colors shadow-sm border border-[#f0c059]/20">
                                    <FaUserCog className="text-lg" />
                                </div>
                                <span className="font-semibold text-gray-200">Admin Dashboard</span>
                            </div>
                            <FaChevronRight className="text-gray-500 group-hover:text-[#f0c059] transition-colors text-sm" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 mt-6">
                <button
                    onClick={logout}
                    className="w-full bg-[#4a1818] border border-[#f0c059]/30 p-4 rounded-xl shadow-lg hover:bg-red-900 hover:border-[#f0c059] hover:text-[#f0c059] transition-all duration-200 flex items-center justify-center space-x-2 group text-gray-300 font-bold"
                >
                    <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                    <span>Logout</span>
                </button>
                <div className="text-center mt-6 text-xs text-gray-400">
                    v1.0.0
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
