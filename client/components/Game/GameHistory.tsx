"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const GameHistory = ({ timeFrame }: { timeFrame: string }) => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchHistory();
        // Poll every 10 seconds or listen to socket
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, [timeFrame]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`https://betsite-h7wh.onrender.com/api/game/history?timeFrame=${timeFrame}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-bold">Game Record</h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3">Period</th>
                            <th className="px-4 py-3 text-center">Number</th>
                            <th className="px-4 py-3 text-right">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((game, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-gray-600">{game.periodId}</td>
                                <td className={cn(
                                    "px-4 py-3 text-center font-bold text-lg",
                                    game.resultNumber === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-violet-500" :
                                        game.resultNumber === 5 ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500" :
                                            [1, 3, 7, 9].includes(game.resultNumber) ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {game.resultNumber}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-1">
                                        {game.resultColor.includes('green') && <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>}
                                        {game.resultColor.includes('violet') && <div className="w-3 h-3 rounded-full bg-violet-500 shadow-sm"></div>}
                                        {game.resultColor.includes('red') && <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameHistory;
