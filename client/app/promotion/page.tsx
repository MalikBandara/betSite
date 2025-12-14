"use client";
import { FaChevronRight, FaCopy, FaUser, FaUsers, FaFileAlt, FaHeadset, FaChartBar, FaGift, FaClipboardList, FaPercentage } from 'react-icons/fa';
import { MdOutlineDescription } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";

export default function PromotionPage() {
    return (
        <div className="min-h-screen bg-[#2a0e0e] pb-24 font-sans text-white">
            {/* Header */}
            <header className="bg-[#3d1212] sticky top-0 z-40 flex justify-center items-center py-4 shadow-md border-b border-[#f0c059]/20 relative">
                <h1 className="text-lg font-bold text-[#f0c059]">Agency</h1>
                <button className="absolute right-4 text-[#f0c059] text-xl">
                    <RiFileList3Line />
                </button>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#3d1212] to-[#2a0e0e] pt-8 pb-12 px-4 rounded-b-[2rem] relative border-b border-[#f0c059]/10">
                <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-2 text-[#f0c059]">0</h2>
                    <div className="bg-[#f0c059]/20 inline-block px-4 py-1 rounded-full text-xs mb-2 backdrop-blur-sm border border-[#f0c059]/30 text-[#f0c059]">
                        Yesterday's total commission
                    </div>
                    <p className="text-xs opacity-90 text-gray-400">Upgrade the level to increase commission income</p>
                </div>
            </div>

            {/* Subordinates Stats Card */}
            <div className="mx-4 -mt-8 relative z-10 bg-[#4a1818] rounded-xl shadow-lg border border-[#f0c059]/20 p-4">
                <div className="grid grid-cols-2 divide-x divide-[#f0c059]/20">
                    {/* Direct Subordinates */}
                    <div className="flex flex-col items-center px-2">
                        <div className="flex items-center gap-1 mb-4 text-[#f0c059] font-bold text-sm">
                            <FaUser className="text-[#f0c059]" /> Direct subordinates
                        </div>
                        <div className="w-full text-center space-y-3">
                            <div>
                                <p className="text-lg font-bold text-white leading-none">0</p>
                                <p className="text-[10px] text-gray-400">number of register</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-400 leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Deposit number</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#f0c059] leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Deposit amount</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Number of people making first deposit</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Subordinates */}
                    <div className="flex flex-col items-center px-2">
                        <div className="flex items-center gap-1 mb-4 text-[#f0c059] font-bold text-sm">
                            <FaUsers className="text-[#f0c059]" /> Team subordinates
                        </div>
                        <div className="w-full text-center space-y-3">
                            <div>
                                <p className="text-lg font-bold text-white leading-none">0</p>
                                <p className="text-[10px] text-gray-400">number of register</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-400 leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Deposit number</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#f0c059] leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Deposit amount</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white leading-none">0</p>
                                <p className="text-[10px] text-gray-400">Number of people making first deposit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invitation Button */}
            <div className="px-4 mt-6">
                <button className="w-full bg-gradient-to-r from-[#f0c059] to-[#bf953f] text-[#2a0e0e] font-black py-3.5 rounded-full shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm border-2 border-[#fff5d6]/20">
                    INVITATION LINK
                </button>
            </div>

            {/* Action List */}
            <div className="px-4 mt-6 space-y-3">
                {/* Deposit Bonus */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <FaGift className="text-[#f0c059] text-xl" />
                        <span className="text-sm font-medium text-gray-200">Deposit bonus</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>

                {/* Copy Invitation Code */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <FaCopy className="text-[#f0c059] text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">Copy invitation code</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">65875131947</span>
                        <FaChevronRight className="text-gray-500 text-sm" />
                    </div>
                </div>

                {/* Subordinate Data */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <FaChartBar className="text-[#f0c059] text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">Subordinate data</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>

                {/* Commission Detail */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <MdOutlineDescription className="text-[#f0c059] text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">Commission detail</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>

                {/* Invitation Rules */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <FaFileAlt className="text-[#f0c059] text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">Invitation rules</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>

                {/* Agent Line Customer Service */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <FaHeadset className="text-[#f0c059] text-xl" />
                        <span className="text-sm font-medium text-gray-200">Agent line customer service</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>
                {/* Rebate Ratio */}
                <div className="bg-[#4a1818] rounded-xl p-4 flex items-center justify-between shadow-md border border-[#f0c059]/10 cursor-pointer hover:bg-[#3d1212]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <FaPercentage className="text-[#f0c059] text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">Rebate ratio</span>
                    </div>
                    <FaChevronRight className="text-gray-500 text-sm" />
                </div>
            </div>

            {/* Promotion Data Bottom Section */}
            <div className="px-4 mt-6">
                <div className="bg-[#4a1818] rounded-xl p-4 shadow-lg border border-[#f0c059]/10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-[#3d1212] p-1 rounded border border-[#f0c059]/20">
                            <FaClipboardList className="text-[#f0c059]" />
                        </div>
                        <h3 className="font-bold text-white">promotion data</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 text-center">
                        <div>
                            <p className="text-lg font-bold text-white">0</p>
                            <p className="text-xs text-gray-400">This Week</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">0</p>
                            <p className="text-xs text-gray-400">Total commission</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">0</p>
                            <p className="text-xs text-gray-400">direct subordinate</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">0</p>
                            <p className="text-xs text-gray-400">Total number of<br />subordinates in the team</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
