"use client";
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FaTimes } from 'react-icons/fa';

interface ResultPopupProps {
    status: 'win' | 'loss';
    amount: number;
    onClose: () => void;
}

const ResultPopup: React.FC<ResultPopupProps> = ({ status, amount, onClose }) => {
    const isWin = status === 'win';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transform scale-100">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 bg-white/30 hover:bg-white/50 text-white rounded-full p-1 transition-colors"
                >
                    <FaTimes />
                </button>

                {/* Header Image */}
                <div className="relative h-48 w-full bg-gray-100">
                    <Image
                        src={isWin ? "/images/victory_header.png" : "/images/defeat_header.png"}
                        alt={isWin ? "You Win" : "Try Again"}
                        fill
                        className="object-cover"
                    />
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90",
                        isWin ? "via-yellow-500/10" : "via-blue-900/10"
                    )}></div>
                </div>

                {/* Content */}
                <div className="px-6 pb-8 pt-2 text-center relative z-10 -mt-6">
                    <div className={cn(
                        "w-20 h-2 bg-gray-200 mx-auto rounded-full mb-4",
                        isWin ? "bg-yellow-400" : "bg-gray-300"
                    )}></div>

                    <h2 className={cn(
                        "text-3xl font-black uppercase tracking-tight mb-2",
                        isWin ? "text-yellow-600 drop-shadow-sm" : "text-gray-500"
                    )}>
                        {isWin ? "Congratulations!" : "So Sorry!"}
                    </h2>

                    <p className="text-gray-500 text-sm mb-6 px-4 leading-relaxed">
                        {isWin
                            ? "Luck is on your side today! Keep playing to win more."
                            : "Don't give up! The next round could be your big win."}
                    </p>

                    {/* Amount Display */}
                    <div className={cn(
                        "py-4 rounded-xl border-2 border-dashed mb-6",
                        isWin ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                    )}>
                        <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
                            {isWin ? "You Won" : "Result"}
                        </p>
                        <p className={cn(
                            "text-4xl font-black tracking-tighter",
                            isWin ? "text-yellow-600" : "text-gray-400"
                        )}>
                            {isWin ? "+" : ""}₹{amount.toFixed(2)}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className={cn(
                            "w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform uppercase tracking-wider",
                            isWin ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-orange-200" : "bg-gray-800 shadow-gray-300"
                        )}
                    >
                        {isWin ? "Awesome" : "Try Again"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPopup;
