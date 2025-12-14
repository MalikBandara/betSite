"use client";
import { useEffect, useState, useRef } from 'react';
import Timer from '@/components/Game/Timer';
import BettingGrid from '@/components/Game/BettingGrid';
import GameHistory from '@/components/Game/GameHistory';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaVolumeUp, FaDownload, FaEnvelope, FaFire, FaGamepad,
  FaPlane, FaDice, FaTrophy, FaSync, FaWallet, FaArrowDown,
  FaArrowUp, FaGift
} from 'react-icons/fa';

import ResultPopup from '@/components/Game/ResultPopup';
import SpinWheel from '@/components/Game/SpinWheel';
import MyBetsHistory from '@/components/Game/MyBetsHistory';
import RewardInfo from '@/components/Home/RewardInfo';
import GameRules from '@/components/Game/GameRules';

export default function Home() {
  const { user, loading, logout, refetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Needs import
  const [periodId, setPeriodId] = useState('');
  const [isBettingOpen, setIsBettingOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeTimeFrame, setActiveTimeFrame] = useState('3Min'); // New state for Win Go Time Frames

  // Win/Loss Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [showMyBets, setShowMyBets] = useState(false); // State to show My Bets History
  const [showRules, setShowRules] = useState(false); // State for Game Rules Modal
  const [popupData, setPopupData] = useState({ status: 'loss' as 'win' | 'loss', amount: 0 });
  const [currentBet, setCurrentBet] = useState<any>(null); // Store current bet to check result later
  // Independent Pool Amounts for each time frame
  const [poolAmounts, setPoolAmounts] = useState<any>({
    '30s': 14280,
    '1Min': 18500,
    '3Min': 25100,
    '5Min': 42000
  });
  const prevPeriodIds = useRef<any>({}); // Track period IDs to trigger resets

  // Multi-TimeFrame States
  const [gameStates, setGameStates] = useState<any>({
    '30s': { time: 30, periodId: '', isBettingOpen: true },
    '1Min': { time: 60, periodId: '', isBettingOpen: true },
    '3Min': { time: 180, periodId: '', isBettingOpen: true },
    '5Min': { time: 300, periodId: '', isBettingOpen: true },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    // Handle query param for game selection
    const gameParam = searchParams.get('game');
    if (gameParam) {
      setSelectedGame(gameParam);
    } else {
      // If no param (Home clicked), reset to dashboard
      setSelectedGame(null);
    }
  }, [user, loading, router, searchParams]);

  // Simulate Pool Amount Ticking (Independent per frame)
  useEffect(() => {
    const interval = setInterval(() => {
      setPoolAmounts((prev: any) => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] += Math.floor(Math.random() * 15 + 5);
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for Period Changes to Reset Pool
  useEffect(() => {
    Object.keys(gameStates).forEach(tf => {
      const updates = gameStates[tf];
      if (!updates) return;

      const lastId = prevPeriodIds.current[tf];
      if (lastId && lastId !== updates.periodId) {
        // Period Changed for this TF -> Reset Pool
        setPoolAmounts((prev: any) => ({
          ...prev,
          [tf]: 1000 + Math.floor(Math.random() * 500) // Reset base
        }));
      }
      prevPeriodIds.current[tf] = updates.periodId;
    });
  }, [gameStates]);

  // Check for result when period changes (Round Ended)
  useEffect(() => {
    if (currentBet && periodId && currentBet.periodId !== periodId) {
      checkResult(currentBet.periodId);
    }
  }, [periodId]);

  const checkResult = async (betPeriodId: string) => {
    try {
      // Wait a moment for server to settle
      await new Promise(r => setTimeout(r, 2000));
      const res = await axios.get('http://localhost:5000/api/game/history');
      const history = res.data;
      const result = history.find((h: any) => h.periodId.toString() === betPeriodId.toString());

      if (result) {
        let won = false;
        let winAmount = 0;

        // Simple Win Logic Check
        if (currentBet.type === 'color') {
          if (result.resultColor.includes(currentBet.selection)) {
            won = true;
            winAmount = currentBet.amount * (currentBet.selection === 'violet' ? 4.5 : 2);
          }
        } else if (currentBet.type === 'number') {
          if (parseInt(result.resultNumber) === parseInt(currentBet.selection)) {
            won = true;
            winAmount = currentBet.amount * 9;
          }
        }

        setPopupData({
          status: won ? 'win' : 'loss',
          amount: won ? winAmount : currentBet.amount
        });
        setShowPopup(true);
        setCurrentBet(null); // Clear bet
        // Refresh user balance
        if (refetchUser) await refetchUser();
      }
    } catch (err) {
      console.error("Error checking result:", err);
    }
  };

  const handleTimeUpdate = (data: any) => {
    // data = { timeFrame, time, periodId, isBettingOpen }
    setGameStates((prev: any) => ({
      ...prev,
      [data.timeFrame]: data
    }));
  };

  // Derived state for current view
  const activeGameState = gameStates[activeTimeFrame] || {};
  const currentPeriodId = activeGameState.periodId;
  const currentTimeLeft = activeGameState.time || 0;
  const currentIsBettingOpen = activeGameState.isBettingOpen;
  const handlePlaceBet = async (type: string, selection: string, amount: number) => {
    try {
      if (!user) return alert('Please login');
      if (user.balance < amount) return alert('Insufficient balance');

      await axios.post('http://localhost:5000/api/game/bet', {
        periodId: currentPeriodId,
        type,
        selection,
        amount,
        timeFrame: activeTimeFrame // Send selected time frame
      });

      // Store bet locally to track result
      setCurrentBet({ periodId: currentPeriodId, type, selection, amount });

      alert('Bet Placed Successfully! Wait for the result.');
      // window.location.reload(); // Removed to allow popup
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to place bet');
    }
  };

  if (loading || !user) return <div suppressHydrationWarning={true} className="min-h-screen flex items-center justify-center bg-gray-100 text-primary">Loading...</div>;

  // Game View (Color Prediction / Lottery)
  if (selectedGame === 'lottery') {
    return (
      <div className="min-h-screen pb-20 bg-[#2a0e0e]">
        <div className="bg-[#3d1212] p-4 text-white sticky top-0 z-10 shadow-md border-b border-[#f0c059]/20">
          <div className="flex items-center">

            <h1 className="text-lg font-bold text-[#f0c059]">Win Go</h1>
          </div>
        </div>
        <div className="p-4 max-w-lg mx-auto space-y-6">
          {/* Premium Balance Card */}
          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl group transition-transform hover:scale-[1.02] duration-300">
            <Image
              src="/images/balance_bg.png"
              alt="Balance Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/10"></div> {/* Mild overlay for text readability */}

            <div className="relative z-10 p-6 flex flex-col justify-between h-full items-center text-center">
              <div className="w-full">
                <p className="text-white/90 text-sm font-medium mb-1 flex items-center justify-center gap-2">
                  <FaWallet /> Total Balance
                </p>
                <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center justify-center gap-2">
                  <img src="/images/coin_icon.png" alt="Coin" className="w-8 h-8 object-contain" />
                  {user.balance.toFixed(2)}
                </h2>
              </div>
              <div className="flex gap-3 w-full justify-center">
                <button onClick={() => router.push('/wallet/deposit')} className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-6 rounded-full border border-white/30 backdrop-blur-md transition-all active:scale-95 shadow-lg min-w-[100px]">Deposit</button>
                <button onClick={() => router.push('/wallet/withdraw')} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-6 rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-95 min-w-[100px]">Withdraw</button>
              </div>
            </div>
          </div>

          {/* Marquee Notification */}
          <div className="bg-white/90 rounded-full py-2 px-4 shadow-sm flex items-center gap-2">
            <FaVolumeUp className="text-[#f0c059]" />
            <div className="text-xs text-[#2a0e0e] font-medium overflow-hidden whitespace-nowrap flex-1">
              <span className="animate-marquee inline-block">Join our Telegram groups for exclusive signals and predicted wins! Play responsibly.</span>
            </div>
          </div>

          {/* Time Frame Tabs */}
          <div className="bg-[#4a1818] p-2 rounded-xl flex justify-between items-center shadow-inner">
            {['30s', '1Min', '3Min', '5Min'].map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeFrame(tf)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${activeTimeFrame === tf ? 'bg-gradient-to-b from-[#f0c059] to-[#d4a030] text-[#2a0e0e] shadow-lg scale-105' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
              >
                <FaSync className={`mb-1 ${activeTimeFrame === tf ? 'animate-spin-slow' : ''}`} size={12} />
                <span className="text-xs font-bold leading-none">Win Go</span>
                <span className="text-[10px] font-medium leading-none mt-0.5">{tf}</span>
              </button>
            ))}
          </div>

          {/* Signal / Status Card */}
          <div className="bg-gradient-to-r from-[#d4a030] to-[#f0c059] rounded-xl p-4 shadow-lg text-[#2a0e0e] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><FaTrophy size={60} /></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-70">Period</p>
                <p className="text-xl font-black">{currentPeriodId || 'Loading...'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-70">Amount</p>
                <p className="text-xl font-black">{(poolAmounts[activeTimeFrame] || 0).toLocaleString()}</p>
              </div>

            </div>
            <div className="flex gap-3 mt-4 relative z-10">
              <button className="flex-1 bg-[#2a0e0e] text-[#f0c059] font-bold py-2 rounded-full shadow-lg active:scale-95 transition-transform text-sm">Follow</button>
              <button onClick={() => setShowMyBets(true)} className="flex-1 bg-white text-[#2a0e0e] font-bold py-2 rounded-full shadow-lg active:scale-95 transition-transform text-sm">Record</button>
            </div>
          </div>

          {/* Timer Section */}
          <div className="flex gap-3">
            <div onClick={() => setShowRules(true)} className="flex-1 bg-[#e0d0b0] rounded-xl p-3 flex flex-col justify-center border border-[#f0c059] cursor-pointer active:scale-95 transition-transform">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-[#2a0e0e]/70 font-bold uppercase">How to play</span>
              </div>
              <p className="text-xs text-[#2a0e0e] font-bold">Win Go {activeTimeFrame}</p>
              <div className="flex gap-1 mt-2">
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">P</div>
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">G</div>
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">R</div>
              </div>
            </div>
            <div className="flex-1 bg-[#e0d0b0] rounded-xl p-3 flex flex-col items-end justify-center border border-[#f0c059] relative overflow-hidden">
              <p className="text-[10px] text-[#2a0e0e]/70 font-bold uppercase mb-1">Time Remaining</p>
              <div className="flex gap-1 text-2xl font-black text-[#2a0e0e]">
                <div className="bg-white px-1.5 py-0.5 rounded shadow-sm">0</div>
                <div className="bg-white px-1.5 py-0.5 rounded shadow-sm">{Math.floor(currentTimeLeft / 60)}</div>
                <span className="text-[#2a0e0e]">:</span>
                <div className="bg-white px-1.5 py-0.5 rounded shadow-sm">{Math.floor((currentTimeLeft % 60) / 10)}</div>
                <div className="bg-white px-1.5 py-0.5 rounded shadow-sm">{currentTimeLeft % 10}</div>
              </div>
              <p className="text-[10px] text-[#2a0e0e]/60 font-mono mt-1 tracking-wider">{currentPeriodId}</p>
            </div>
          </div>

          {/* Betting Grid */}
          <div className="relative">
            {/* Note: We keep the Logic component but hide its default visual if necessary. 
                 The current BettingGrid component is pure UI, so we can just use it. 
                 However, we also need the socket connection from the Timer component.
                 I will render the Timer component HIDDEN to keep the socket connection alive 
                 and updating the state via onTimeUpdate. */}
            <div className="hidden">
              <Timer onTimeUpdate={handleTimeUpdate} />
            </div>

            <BettingGrid onPlaceBet={handlePlaceBet} disabled={!isBettingOpen} />
          </div>

          <GameHistory timeFrame={activeTimeFrame} />
        </div>

        {/* Modals */}
        {showMyBets && <MyBetsHistory onClose={() => setShowMyBets(false)} />}
        {showRules && <GameRules onClose={() => setShowRules(false)} />}
      </div>
    );
  }



  // Spin Wheel View (Slots)
  if (selectedGame === 'slots') {
    return <SpinWheel onBack={() => setSelectedGame(null)} />;
  }

  // Lobby View
  return (
    <div className="min-h-screen pb-24 font-sans text-white bg-[#2a0e0e]">
      {/* Header */}
      {/* Header */}
      <header className="bg-[#3d1212] px-4 py-3 sticky top-0 z-40 flex justify-between items-center shadow-md border-b border-[#f0c059]/20">
        <h1 className="text-2xl font-black text-[#f0c059] italic tracking-tighter">RichWin</h1>
        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer">
            <FaEnvelope className="text-[#f0c059] text-xl" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#3d1212]">1</span>
          </div>
          <FaDownload className="text-[#f0c059] text-xl cursor-pointer" />
        </div>
      </header>

      {/* Banner */}
      <div className="p-3">
        <div className="p-3">
          <div className="w-full h-44 rounded-xl relative overflow-hidden shadow-lg">
            <Image
              src="/images/banner.png"
              alt="Promotional Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Ticker */}
      {/* Ticker */}
      <div className="px-3 mb-2">
        <div className="bg-[#4a1818] rounded-full py-2 px-3 flex items-center shadow-sm text-sm border border-[#f0c059]/30">
          <FaVolumeUp className="text-[#f0c059] mr-2 flex-shrink-0" />
          <div className="flex-1 overflow-hidden whitespace-nowrap text-gray-300 text-xs">
            <span className="animate-marquee inline-block">Our customer service will never send links to affiliates if you received a link from unknown sources please report it immediately.</span>
          </div>
          <button className="bg-[#f0c059] text-[#2a0e0e] text-[10px] px-3 py-1 rounded-full ml-2 flex items-center gap-1 font-bold shadow-sm flex-shrink-0 hover:bg-[#ffe082]">
            <FaFire className="text-[10px]" /> Detail
          </button>
        </div>
      </div>

      {/* Balance Section */}
      {/* Balance Section */}
      <div className="m-3 bg-[#4a1818] rounded-xl p-4 shadow-lg border border-[#f0c059]/30">

        <div className="flex gap-3">
          <Link href="/wallet" className="flex-1">
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-200 active:scale-95 transition-transform">Wallet</button>
          </Link>
          <Link href="/wallet" className="flex-1">
            <button className="w-full bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2.5 rounded-full font-bold text-sm shadow-md shadow-orange-200 active:scale-95 transition-transform">Withdraw</button>
          </Link>
          <Link href="/wallet" className="flex-1">
            <button className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-2.5 rounded-full font-bold text-sm shadow-md shadow-red-200 active:scale-95 transition-transform">Deposit</button>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-3 px-3">
        {/* Sidebar Menu */}
        {/* Sidebar Menu */}
        <div className="w-[80px] flex flex-col gap-3 flex-shrink-0">
          <button className="bg-gradient-to-b from-red-600 to-red-800 text-white p-2 rounded-xl flex flex-col items-center justify-center h-20 shadow-lg transform scale-105 border border-[#f0c059]/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            <FaFire className="text-2xl mb-1 drop-shadow-sm z-10 text-[#f0c059]" />
            <span className="text-[10px] font-bold z-10">Hot</span>
          </button>
          <button
            onClick={() => setSelectedGame('lottery')}
            className="bg-[#4a1818] p-1 rounded-xl flex flex-col items-center justify-center h-20 shadow-md border border-[#f0c059]/20 hover:border-[#f0c059] transition-colors relative overflow-hidden group"
          >
            <Image src="/images/lottery.png" alt="Lottery" fill className="object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm border border-[#f0c059]/30">Lottery</span>
          </button>
          <button
            onClick={() => setSelectedGame('slots')}
            className="bg-[#4a1818] p-1 rounded-xl flex flex-col items-center justify-center h-20 shadow-md border border-[#f0c059]/20 hover:border-[#f0c059] transition-colors relative overflow-hidden group"
          >
            <Image src="/images/slots.png" alt="Slots" fill className="object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm border border-[#f0c059]/30">Slots</span>
          </button>
          <button className="bg-[#4a1818] p-1 rounded-xl flex flex-col items-center justify-center h-20 shadow-md border border-[#f0c059]/20 hover:border-[#f0c059] transition-colors relative overflow-hidden group">
            <Image src="/images/sports.png" alt="Sports" fill className="object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm border border-[#f0c059]/30">Sports</span>
          </button>
        </div>

        {/* Main Game Cards Area */}
        <div className="flex-1 grid grid-cols-1 gap-3">

          {/* Aviator & Vortex Row */}
          {/* Aviator & Vortex Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1 bg-[#1a0b2e] rounded-xl relative overflow-hidden h-40 flex items-center justify-center group cursor-pointer shadow-lg border border-purple-900/50" onClick={() => setSelectedGame('aviator')}>
              <Image src="/images/aviator.png" alt="Aviator" fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm z-20 font-bold tracking-wider">10 SEC</div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-center">
                <h3 className="text-white font-black text-lg italic uppercase leading-none mb-1 drop-shadow-md">AVIATOR</h3>
                <p className="text-gray-300 text-[8px] tracking-widest uppercase">Take Off</p>
              </div>
            </div>

            <div className="col-span-1 bg-[#0d0d25] rounded-xl relative overflow-hidden h-40 flex items-center justify-center group cursor-pointer shadow-lg border border-blue-900/50">
              <Image src="/images/vortex.png" alt="Vortex" fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-center">
                <h3 className="text-white font-black text-lg uppercase leading-none mb-1 drop-shadow-md">VORTEX</h3>
                <p className="text-gray-300 text-[8px] tracking-widest uppercase">Spin Now</p>
              </div>
            </div>
          </div>

          {/* Download App Banner */}
          <div className="relative overflow-hidden rounded-xl h-24 bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between p-4 shadow-lg text-white group cursor-pointer">
            <div className="z-10 flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm border border-white/20">
                <h4 className="font-black text-xs uppercase leading-tight text-center">Rich<br />Win</h4>
              </div>
              <div>
                <h3 className="font-bold text-base">Download APP</h3>
                <p className="text-[10px] text-white/80">Get the best experience</p>
              </div>
            </div>
            <div className="z-10 bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-md group-hover:bg-blue-50 transition-colors">
              <FaArrowDown />
            </div>

            {/* Decorative background icons */}
            <div className="absolute right-[-10px] bottom-[-15px] opacity-10 transform -rotate-12">
              <FaDownload className="text-8xl" />
            </div>
            <div className="absolute left-[20%] top-[-20px] opacity-10">
              <FaPlane className="text-6xl text-white" />
            </div>
          </div>

          {/* Quick Refer Banner */}
          <div className="bg-primary rounded-xl p-4 flex items-center justify-between text-white overflow-hidden relative shadow-md">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-20 text-6xl rotate-12">
              <FaGift />
            </div>
            <div className="z-10">
              <h3 className="font-bold text-sm">Refer & Earn</h3>
              <p className="text-[10px] text-blue-200">Invite friends and earn huge rewards</p>
            </div>
            <button className="bg-white text-primary px-3 py-1.5 rounded-lg font-bold text-xs z-10 shadow-sm active:scale-95 transition-transform">Invite</button>
          </div>

        </div>
      </div>

      {/* Full Width Sections */}
      <div className="px-3">
        <RewardInfo />
      </div>
    </div>
  );
}
