"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Layers, Sparkles, RotateCcw } from 'lucide-react';
import axios from 'axios';

// 大阿尔卡那牌背景色映射
const CARD_COLORS: Record<string, string> = {
    '愚者': '#5B9BD5', '魔术师': '#FF6B6B', '女祭司': '#7B68EE', '女皇': '#20B2AA',
    '皇帝': '#CD853F', '教皇': '#DAA520', '恋人': '#FF69B4', '战车': '#4169E1',
    '力量': '#FF8C00', '隐者': '#708090', '命运之轮': '#9370DB', '正义': '#B8860B',
    '倒吊人': '#6A5ACD', '死神': '#2F4F4F', '节制': '#3CB371', '恶魔': '#8B0000',
    '塔': '#696969', '星星': '#4682B4', '月亮': '#483D8B', '太阳': '#FFD700',
    '审判': '#CD5C5C', '世界': '#2E8B57',
};

// 单张塔罗牌组件
function TarotCard({
    card,
    flipped,
    onClick,
    delay = 0,
}: {
    card?: { name: string; reversed: boolean; position?: string };
    flipped: boolean;
    onClick?: () => void;
    delay?: number;
}) {
    const bgColor = card ? (CARD_COLORS[card.name] || '#8B4513') : '#8B4513';

    return (
        <div
            className="perspective-1000 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
            onClick={onClick}
        >
            <div
                className={`relative w-36 h-56 md:w-44 md:h-64 transition-transform duration-700 transform-style-3d
          ${flipped ? 'rotate-y-180' : ''}`}
            >
                {/* 牌背面 */}
                <div className="absolute inset-0 backface-hidden rounded-lg border-2 border-[#E8C490] bg-gradient-to-br from-[#8B4513] to-[#5C2E0A]
          flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-24 h-24 border border-[#E8C490]/50 rounded-full flex items-center justify-center mb-3">
                        <span className="font-title text-[#E8C490] text-3xl">☯</span>
                    </div>
                    <span className="font-title text-[#E8C490] text-sm tracking-widest">知命塔罗</span>
                </div>

                {/* 牌正面 */}
                <div
                    className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg border-2 border-[#E8C490] shadow-lg
            flex flex-col items-center justify-center p-4 text-center"
                    style={{ backgroundColor: bgColor }}
                >
                    {card && (
                        <>
                            {card.position && (
                                <span className="absolute top-2 left-3 text-white/70 text-xs font-bold">{card.position}</span>
                            )}
                            <span className="text-white text-5xl mb-3">
                                {card.reversed ? '🔮' : '✨'}
                            </span>
                            <h3 className={`font-title text-white text-xl mb-1 ${card.reversed ? 'rotate-180' : ''}`}>
                                {card.name}
                            </h3>
                            <span className="text-white/70 text-xs">
                                {card.reversed ? '逆位' : '正位'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TarotPage() {
    const [question, setQuestion] = useState('');
    const [spreadType, setSpreadType] = useState<'single' | 'three'>('single');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
    const [allFlipped, setAllFlipped] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('请先说出你的问题');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setFlippedCards(new Set());
        setAllFlipped(false);

        try {
            const res = await axios.post('/api/tarot', { question: question.trim(), spreadType });
            const data = res.data?.data || res.data;
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || '塔罗之灵暂未回应，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const flipCard = (index: number) => {
        const newFlipped = new Set(flippedCards);
        newFlipped.add(index);
        setFlippedCards(newFlipped);

        // 检查是否全部翻开
        if (result?.cards && newFlipped.size === result.cards.length) {
            setTimeout(() => setAllFlipped(true), 800);
        }
    };

    const resetAll = () => {
        setResult(null);
        setFlippedCards(new Set());
        setAllFlipped(false);
        setError('');
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 标题 */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <Layers className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">塔罗牌占卜</h1>
                    <p className="text-[#666666] tracking-widest">翻开命运之牌，聆听宇宙的回响</p>
                </div>

                {/* 问题表单 */}
                {!result && !loading && (
                    <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm text-[#666666] mb-2">请说出你的问题</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="例如：我下个月的事业发展如何？"
                                    rows={3}
                                    maxLength={200}
                                    className="w-full px-4 py-3 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
                    focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none"
                                />
                                <p className="text-xs text-[#999999] mt-1 text-right">{question.length}/200</p>
                            </div>

                            <div>
                                <label className="block text-sm text-[#666666] mb-2">抽牌方式</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setSpreadType('single')}
                                        className={`flex-1 py-4 rounded-sm border transition-all text-center
                      ${spreadType === 'single'
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-[#E8C490]/50 text-[#666666] hover:border-primary'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">🃏</span>
                                        <span className="text-sm font-bold">单牌指引</span>
                                        <span className="text-xs block opacity-70">抽一张，聚焦当下</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSpreadType('three')}
                                        className={`flex-1 py-4 rounded-sm border transition-all text-center
                      ${spreadType === 'three'
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-[#E8C490]/50 text-[#666666] hover:border-primary'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">🃏🃏🃏</span>
                                        <span className="text-sm font-bold">时间之流</span>
                                        <span className="text-xs block opacity-70">三张：过去 · 现在 · 未来</span>
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-accent text-sm text-center">{error}</p>}

                            <Button type="submit" fullWidth size="lg">
                                <Sparkles className="w-5 h-5 mr-2" />
                                开始占卜
                            </Button>
                        </form>
                    </Card>
                )}

                {/* 加载 */}
                {loading && <Loading text="塔罗之灵感应中..." type="bagua" />}

                {/* 翻牌区域 */}
                {result && !loading && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* 问题回显 */}
                        <Card className="text-center">
                            <p className="text-[#666666] text-sm mb-1">你的问题</p>
                            <p className="font-title text-xl text-primary">「{result.question}」</p>
                            <p className="text-xs text-[#999999] mt-2">{result.spread_type}</p>
                        </Card>

                        {/* 牌面展示 */}
                        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-stretch space-y-8 sm:space-y-0 sm:space-x-8 lg:space-x-12 mx-auto">
                            {result.cards?.map((card: any, i: number) => (
                                <TarotCard
                                    key={i}
                                    card={card}
                                    flipped={flippedCards.has(i)}
                                    onClick={() => flipCard(i)}
                                    delay={i * 200}
                                />
                            ))}
                        </div>

                        {!allFlipped && (
                            <p className="text-center text-[#666666] text-sm animate-breath">
                                ✨ 点击卡牌翻开，感受命运的指引...
                            </p>
                        )}

                        {/* 解读区域（翻开所有牌后展示） */}
                        {allFlipped && (
                            <div className="space-y-6 animate-fade-in-up">
                                {/* 单牌解读 */}
                                {result.cards?.map((card: any, i: number) => (
                                    <Card key={i}>
                                        <div className="flex items-start space-x-4">
                                            <div className="text-center shrink-0" style={{ color: CARD_COLORS[card.name] || '#8B4513' }}>
                                                <span className="text-3xl block">{card.reversed ? '🔮' : '✨'}</span>
                                                <span className="font-title text-lg block">{card.name}</span>
                                                <span className="text-xs opacity-70">{card.reversed ? '逆位' : '正位'}</span>
                                                {card.position && <span className="text-xs block mt-1 text-[#666666]">· {card.position} ·</span>}
                                            </div>
                                            <div className="flex-1">
                                                {card.keywords && (
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {card.keywords.map((kw: string, j: number) => (
                                                            <span key={j} className="text-xs px-2 py-1 bg-[#F5F5F5] rounded-full text-[#666666]">{kw}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-[#333333] leading-relaxed text-sm">{card.interpretation}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {/* 综合解读 */}
                                <Card className="bg-primary/5">
                                    <h3 className="font-title text-xl text-primary mb-3">🌟 综合解读</h3>
                                    <p className="text-[#333333] leading-[1.8]">{result.overall}</p>
                                </Card>

                                {/* 行动建议 */}
                                <Card>
                                    <h3 className="font-title text-xl text-primary mb-3">💡 行动建议</h3>
                                    <p className="text-[#333333] leading-[1.8]">{result.advice}</p>
                                </Card>

                                {/* 肯定语 */}
                                {result.affirmation && (
                                    <div className="text-center py-4">
                                        <p className="font-title text-2xl text-primary tracking-widest">「{result.affirmation}」</p>
                                    </div>
                                )}

                                <div className="text-center">
                                    <Button variant="outline" onClick={resetAll}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        重新占卜
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
