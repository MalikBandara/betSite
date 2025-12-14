"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FaArrowLeft } from 'react-icons/fa';

interface SpinWheelProps {
    onBack: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onBack }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    const spin = () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        // Random rotation: at least 5 full spins (1800 deg) + random segment
        const newRotation = rotation + 1800 + Math.floor(Math.random() * 360);
        setRotation(newRotation);

        // Wait for animation to finish (e.g., 3 seconds)
        setTimeout(() => {
            setSpinning(false);
            // In a real app, calculate result based on angle
            // For now, simple random mock result
            const outcomes = ['10x', '50x', 'Try Again', '2x', '5x', 'Big Win', 'Jackpot', 'Free Spin'];
            setResult(outcomes[Math.floor(Math.random() * outcomes.length)]);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#1a0b2e] flex flex-col items-center relative overflow-hidden pb-10">
            {/* Header */}
            <div className="w-full p-4 flex items-center z-10">
                <button onClick={onBack} className="text-white bg-white/10 p-2 rounded-full backdrop-blur-md">
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-black text-white italic ml-4 drop-shadow-lg tracking-wider">LUCKY SLOTS</h1>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-[#1a0b2e] pointer-events-none"></div>

            {/* Wheel Container */}
            <div className="relative mt-10 mb-8">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-16 z-20 drop-shadow-xl">
                    <Image src="/images/wheel_pointer.png" alt="Pointer" fill className="object-contain" />
                </div>

                {/* The Wheel */}
                <div
                    className="w-80 h-80 relative rounded-full shadow-2xl border-4 border-yellow-500/30"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? 'transform 3s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                    }}
                >
                    <Image
                        src="/images/lucky_wheel.png"
                        alt="Lucky Wheel"
                        fill
                        className="object-cover rounded-full"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="z-10 text-center space-y-4 px-6 w-full max-w-sm">
                {result && !spinning && (
                    <div className="animate-in zoom-in duration-300 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                        <p className="text-gray-300 text-sm uppercase tracking-widest mb-1">Result</p>
                        <h2 className="text-3xl font-black text-yellow-400 drop-shadow-sm">{result}</h2>
                    </div>
                )}

                <button
                    onClick={spin}
                    disabled={spinning}
                    className={cn(
                        "w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_4px_0_rgb(0,0,0,0.2)] transition-all transform active:translate-y-1 active:shadow-none",
                        spinning
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 shadow-orange-700/50 scale-100 hover:scale-[1.02]"
                    )}
                >
                    {spinning ? "Spinning..." : "SPIN NOW"}
                </button>

                <p className="text-xs text-gray-500 font-medium">Cost per spin: ₹10.00</p>
            </div>
        </div>
    );
};

export default SpinWheel;
