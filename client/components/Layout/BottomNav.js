"use client";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaHome, FaListAlt, FaWallet, FaUser, FaGem, FaGamepad } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const BottomNav = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const navItems = [
        { name: 'Home', href: '/', icon: FaHome },
        { name: 'Win Go', href: '/?game=lottery', icon: FaGamepad },
        { name: 'Promotion', href: '/promotion', icon: FaGem },
        { name: 'Wallet', href: '/wallet', icon: FaWallet },
        { name: 'Account', href: '/account', icon: FaUser },
    ];

    if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) return null;

    return (
        <div suppressHydrationWarning={true} className="fixed bottom-0 left-0 right-0 bg-[#3d1212] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] h-16 flex justify-around items-end z-50 pb-2 border-t border-[#f0c059]/20">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                let isActive = pathname === item.href;

                // Special handling for Win Go and Home distinction
                if (item.name === 'Win Go') {
                    isActive = pathname === '/' && searchParams.get('game') === 'lottery';
                } else if (item.name === 'Home') {
                    isActive = pathname === '/' && !searchParams.get('game');
                }

                const isCenter = index === 2; // Promotion is center

                if (isCenter) {
                    return (
                        <Link key={item.name} href={item.href} className="relative -top-5">
                            <div suppressHydrationWarning={true} className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-[#2a0e0e] text-white">
                                <Icon className="text-2xl" />
                            </div>
                            <span className="text-[10px] text-[#f0c059] font-bold block text-center mt-1">{item.name}</span>
                        </Link>
                    )
                }

                return (
                    <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center w-full pb-1">
                        <Icon className={cn("text-xl mb-1", isActive ? "text-[#f0c059]" : "text-gray-400")} />
                        <span className={cn("text-[10px] font-medium", isActive ? "text-[#f0c059]" : "text-gray-400")}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
