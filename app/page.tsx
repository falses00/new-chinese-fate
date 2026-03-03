"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Camera, Star, Type, Heart, Layers, ArrowRight, Quote } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// 收束后的 6 大功能模块
const FEATURES = [
  {
    title: "生辰八字",
    desc: "子平真诠，流年大运，精解先天命理密码。",
    icon: Compass,
    href: "/bazi",
    color: "text-[#8B4513]",
    hex: "#8B4513",
    bg: "bg-[#8B4513]/10",
    tag: "经典"
  },
  {
    title: "掌纹灵析",
    desc: "麻衣神相，AI 瞬时读掌，透视情感事业。",
    icon: Camera,
    href: "/palm",
    color: "text-[#9D2933]",
    hex: "#9D2933",
    bg: "bg-[#9D2933]/10",
    tag: "热门"
  },
  {
    title: "星盘运势",
    desc: "星辰逆行，本命盘转，十二星座时运全览。",
    icon: Star,
    href: "/constellation",
    color: "text-[#D4AF37]",
    hex: "#D4AF37",
    bg: "bg-[#D4AF37]/10",
  },
  {
    title: "姓名推演",
    desc: "三才五格，音律字义，探寻名字中的气场。",
    icon: Type,
    href: "/name",
    color: "text-[#2F4F4F]",
    hex: "#2F4F4F",
    bg: "bg-[#2F4F4F]/10",
  },
  {
    title: "三生合婚",
    desc: "八字合婚，五行契合度，预见六维姻缘。",
    icon: Heart,
    href: "/compatibility",
    color: "text-[#CD5C5C]",
    hex: "#CD5C5C",
    bg: "bg-[#CD5C5C]/10",
    tag: "新"
  },
  {
    title: "塔罗占卜",
    desc: "宇宙回响，时空映射，解答当下人生迷局。",
    icon: Layers,
    href: "/tarot",
    color: "text-[#483D8B]",
    hex: "#483D8B",
    bg: "bg-[#483D8B]/10",
  }
];

// 花瓣组件
const Petal = ({ delay, left, duration }: { delay: number; left: number; duration: number }) => (
  <div
    className="petal"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    🌸
  </div>
);

export default function Home() {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    // 客户端随机生成花瓣
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景花瓣 */}
      {petals.map(p => <Petal key={p.id} {...p} />)}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative z-10">
        {/* 英雄区：新中式留白与悬浮感 */}
        <div className="text-center py-20 lg:py-28 animate-fade-in-up flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>
            <span className="text-sm font-medium text-primary tracking-widest">传统命理与先锋 AI 的诗意遇合</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-title text-primary tracking-widest mb-6 drop-shadow-sm">
            知命无忧
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#666666] leading-relaxed mb-10 font-light px-4">
            宇宙之中，万物皆有其序。<br className="hidden md:block" />
            借大模型之慧眼，凝东方哲学之灵气，为您全方位洞察流年大势。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bazi">
              <Button size="lg" className="px-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                测算八字运势
              </Button>
            </Link>
            <Link href="/palm">
              <Button variant="outline" size="lg" className="px-8 bg-white/50 backdrop-blur-md hover:bg-white/80 transition-all duration-300">
                AI 掌纹解析
              </Button>
            </Link>
          </div>
        </div>

        {/* 功能矩阵区：毛玻璃卡片 */}
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-center mb-12">
            <div className="h-[1px] w-16 bg-primary/30"></div>
            <h2 className="text-3xl font-title text-primary mx-6">六合显命</h2>
            <div className="h-[1px] w-16 bg-primary/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href} className="group block">
                  <div className="h-full rounded-2xl p-8 transition-all duration-500 glass-card hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(139,69,19,0.15)] relative overflow-hidden group-hover:border-primary/40">
                    {/* 发光背景点 */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-3xl pointer-events-none" style={{ backgroundColor: feature.hex }}></div>

                    {feature.tag && (
                      <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                        {feature.tag}
                      </span>
                    )}
                    <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-title text-primary mb-3">{feature.title}</h3>
                    <p className="text-[#666666] leading-relaxed group-hover:text-[#333333] transition-colors">{feature.desc}</p>

                    <div className="mt-6 flex items-center text-primary text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span>即刻探索</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 社交证明 / 诗意留白区 */}
        <div className="mt-32 mb-10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card className="glass-card !border-none text-center py-16 px-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
            <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6 transform rotate-180" />
            <h2 className="text-3xl lg:text-4xl font-title text-primary mb-6">顺天应命，方得自在</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-loose italic">
              「已有数万有缘人在此参视天书。<br className="hidden md:block" />无论命盘吉凶，知命之本，在于知己趋吉，内心澄明。」
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
