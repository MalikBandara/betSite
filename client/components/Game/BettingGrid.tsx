"use client";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FaCheckCircle } from 'react-icons/fa';

const BettingGrid = ({ onPlaceBet, disabled }) => {
    const [selected, setSelected] = useState(null);
    const [amount, setAmount] = useState(10);

    const handleSelect = (type, value) => {
        if (disabled) return;
        setSelected({ type, value });
    };

    const handleBet = () => {
        if (selected && amount > 0) {
            onPlaceBet(selected.type, selected.value, amount);
            setSelected(null);
        }
    };

    const colors = [
        { name: 'Green', value: 'green', color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', shadow: 'shadow-emerald-200' },
        { name: 'Violet', value: 'violet', color: 'bg-violet-500', hover: 'hover:bg-violet-600', shadow: 'shadow-violet-200' },
        { name: 'Red', value: 'red', color: 'bg-red-500', hover: 'hover:bg-red-600', shadow: 'shadow-red-200' },
    ];

    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="p-5 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* 1. Color Selection - Rectangular Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {colors.map((c) => (
                    <button
                        key={c.value}
                        disabled={disabled}
                        onClick={() => handleSelect('color', c.value)}
                        className={cn(
                            "h-14 rounded-xl font-bold text-white text-lg tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center relative shadow-md",
                            c.color, c.hover,
                            selected?.value === c.value ? "ring-4 ring-offset-2 ring-gray-300 scale-105 z-10" : "opacity-100"
                        )}
                    >
                        {c.name}
                        {selected?.value === c.value && <FaCheckCircle className="absolute top-1 right-1 text-white text-xs drop-shadow-md" />}
                    </button>
                ))}
            </div>

            {/* 2. Number Grid - Glossy Balls */}
            <div className="grid grid-cols-5 gap-y-4 gap-x-2 mb-8 px-2">
                {numbers.map((num) => {
                    let bg = '';
                    if (num === 0) bg = 'bg-gradient-to-br from-red-500 to-violet-500';
                    else if (num === 5) bg = 'bg-gradient-to-br from-emerald-500 to-violet-500';
                    else if ([1, 3, 7, 9].includes(num)) bg = 'bg-emerald-500';
                    else bg = 'bg-red-500';

                    return (
                        <button
                            key={num}
                            disabled={disabled}
                            onClick={() => handleSelect('number', num.toString())}
                            className={cn(
                                "aspect-square rounded-full font-black text-white text-2xl transition-all transform active:scale-90 shadow-lg relative flex items-center justify-center border-2 border-white/20",
                                bg,
                                // Inner shadow for glossy 3D ball effect
                                "shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_4px_rgba(0,0,0,0.2)]",
                                selected?.value === num.toString() ? "ring-4 ring-offset-2 ring-gray-300 scale-110 z-10 brightness-110" : "hover:brightness-110"
                            )}
                        >
                            <span className="drop-shadow-sm">{num}</span>
                        </button>
                    );
                })}
            </div>

            {/* 3. Betting Amounts - Clean Row */}
            <div className="mb-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Bet Amount</p>
                <div className="flex gap-2 justify-between">
                    {[10, 100, 500, 1000].map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setAmount(amt)}
                            className={cn(
                                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border",
                                amount === amt
                                    ? "bg-[#003366] text-white border-[#003366] shadow-md transform scale-105" // Deep Blue Selected
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            {amt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <button
                disabled={!selected || disabled}
                onClick={handleBet}
                className={cn(
                    "w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all shadow-xl",
                    !selected || disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-500 hover:to-blue-700 active:scale-[0.98] shadow-blue-900/20"
                )}
            >
                {disabled ? "Wait for next round" : `Confirm Bet`}
            </button>
        </div>
    );
};

export default BettingGrid;
