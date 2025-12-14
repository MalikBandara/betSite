"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const Timer = ({ onTimeUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(180);
    const [periodId, setPeriodId] = useState('');

    useEffect(() => {
        socket = io('http://localhost:5000');

        socket.on('timer_update', (data) => {
            // data = { timeFrame, time, periodId, isBettingOpen }
            // Only update local display if it matches a "default" priority or just bubble up
            if (data.timeFrame === '3Min') { // Default fallback for local display if needed
                setTimeLeft(data.time);
                setPeriodId(data.periodId);
            }
            if (onTimeUpdate) onTimeUpdate(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-4 shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Period ID: {periodId}</h3>
            <div className="text-5xl font-mono font-bold text-primary tracking-widest drop-shadow-sm">
                {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
                {timeLeft <= 30 ? <span className="text-red-500 font-bold">Betting Closed</span> : "Betting Open"}
            </div>
        </div>
    );
};

export default Timer;
