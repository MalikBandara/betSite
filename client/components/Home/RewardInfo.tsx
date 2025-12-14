import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTrophy, FaGamepad } from 'react-icons/fa';

const RewardInfo = () => {
    // Mock data for recent winners
    // Function to generate random winners
    const generateWinners = () => {
        const avatars = [
            '/images/avatar1.png', // You might not have these, so I'll use placeholders or generic icons
            '/images/avatar2.png',
            '/images/avatar3.png',
            '/images/avatar4.png'
        ];

        // Fallback if images don't exist, we can use avatars from a CDN or just initials
        // For now, I'll assume we might not have these specific images and use a UI placeholder

        const names = ['Me***', 'Al***', 'Jo***', 'Ki***', 'Ra***', 'Sa***', 'Da***', 'Li***'];
        const newWinners = [];

        for (let i = 0; i < 4; i++) {
            newWinners.push({
                id: i,
                name: names[Math.floor(Math.random() * names.length)],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`, // playful avatars
                amount: (Math.random() * 1000 + 100).toFixed(2),
                game: 'Win Go 3Min'
            });
        }
        return newWinners;
    };

    const [winners, setWinners] = useState(generateWinners());

    useEffect(() => {
        const interval = setInterval(() => {
            setWinners(generateWinners());
        }, 5000); // Update every 5 seconds to simulate live activity
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full mt-6">
            <div className="flex items-center gap-2 mb-3 px-1">
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" />
                    Reward Information
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {winners.map((winner, idx) => (
                    <div key={idx} className="bg-[#4a1818] rounded-xl p-2 relative overflow-hidden shadow-lg border border-[#f0c059]/10 animate-fade-in">

                        {/* Header: Avatar & Name */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden border border-[#f0c059]/50">
                                <img src={winner.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold text-white">{winner.name}</span>
                        </div>

                        {/* Content: Game Icon & Stats */}
                        <div className="flex items-center gap-2">
                            {/* Game Icon Box */}
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex flex-col items-center justify-center p-1 shadow-inner border border-white/10 shrink-0">
                                <span className="text-white text-lg"><FaGamepad /></span>
                                <span className="text-[6px] text-white font-bold leading-tight text-center mt-0.5">{winner.game}</span>
                            </div>

                            {/* Amount Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] text-gray-400 leading-tight">Receive Amount</p>
                                <p className="text-sm font-black text-[#f0c059] leading-tight my-0.5 truncate">${winner.amount}</p>
                                <p className="text-[8px] text-gray-500 leading-tight">Winning amount</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RewardInfo;
