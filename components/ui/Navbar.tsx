"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Star, Type, Heart, Layers, Camera } from 'lucide-react';

const NAV_LINKS = [
    { name: '生辰八字', path: '/bazi', icon: Compass },
    { name: '掌纹灵析', path: '/palm', icon: Camera },
    { name: '星盘运势', path: '/constellation', icon: Star },
    { name: '姓名推演', path: '/name', icon: Type },
    { name: '三生合婚', path: '/compatibility', icon: Heart },
    { name: '塔罗占卜', path: '/tarot', icon: Layers },
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 路由改变时关闭移动端菜单
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center bg-white/50 group-hover:bg-primary transition-colors">
                            <span className="font-title text-primary group-hover:text-white mt-1">☯</span>
                        </div>
                        <span className="font-title text-2xl text-primary tracking-widest mt-1">知命</span>
                    </Link>

                    {/* 桌面端导航 */}
                    <div className="hidden md:flex space-x-1 lg:space-x-2">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname.startsWith(link.path);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1.5
                                        ${isActive
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-[#666666] hover:bg-white/60 hover:text-primary hover:shadow-sm'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* 移动端菜单按钮 */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-primary hover:text-accent focus:outline-none p-1 bg-white/50 rounded-md"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 移动端菜单下拉 */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 glass-nav shadow-2xl transition-all duration-300 origin-top overflow-hidden bg-white/90 backdrop-blur-xl
                    ${mobileMenuOpen ? 'max-h-96 opacity-100 border-b border-[#E8C490]/50 py-2' : 'max-h-0 opacity-0 border-none'}`}
            >
                <div className="px-4 pt-2 pb-4 space-y-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname.startsWith(link.path);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                                    ${isActive
                                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                        : 'text-[#666666] hover:bg-white/60 hover:text-primary'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
