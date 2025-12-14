import React from 'react';

interface GameRulesProps {
    onClose: () => void;
}

const GameRules: React.FC<GameRulesProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden relative shadow-2xl animate-scale-in">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#d4a030] to-[#f0c059] p-4 text-center relative">
                    <h2 className="text-[#2a0e0e] text-lg font-bold uppercase tracking-wide">Rule of Guess</h2>
                </div>

                {/* Content */}
                <div className="p-6 text-[#2a0e0e] text-sm leading-relaxed h-[60vh] overflow-y-auto scrollbar-hide">
                    <p className="mb-4 font-medium text-gray-700">
                        If you spend 100 to trade, after deducting 2 service fee, your contract amount is 98:
                    </p>

                    <div className="space-y-4">
                        <div>
                            <p className="font-bold mb-1">1. JOIN GREEN:</p>
                            <p className="text-gray-600">if the result shows 1,3,7,9, you will get (98*2) 196</p>
                            <p className="text-gray-600">If the result shows 5, you will get (98*1.5) 147</p>
                        </div>

                        <div>
                            <p className="font-bold mb-1">2. JOIN RED:</p>
                            <p className="text-gray-600">if the result shows 2,4,6,8, you will get (98*2) 196; If the result shows 0, you will get (98*1.5) 147</p>
                        </div>

                        <div>
                            <p className="font-bold mb-1">3. JOIN VIOLET:</p>
                            <p className="text-gray-600">if the result shows 0 or 5, you will get (98*4.5) 441</p>
                        </div>

                        <div>
                            <p className="font-bold mb-1">4. SELECT NUMBER:</p>
                            <p className="text-gray-600">if the result is the same as the number you selected, you will get (98*9) 882</p>
                        </div>

                        <div>
                            <p className="font-bold mb-1">5. JOIN BIG:</p>
                            <p className="text-gray-600">if the result shows 5,6,7,8,9, you will get (98*2) 196</p>
                        </div>

                        <div>
                            <p className="font-bold mb-1">6. JOIN SMALL:</p>
                            <p className="text-gray-600">if the result shows 0,1,2,3,4, you will get (98*2) 196</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#d4a030] to-[#f0c059] text-[#2a0e0e] font-bold py-2 px-10 rounded-full shadow-lg active:scale-95 transition-transform"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameRules;
