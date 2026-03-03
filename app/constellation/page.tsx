"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Star, TrendingUp, Heart, Briefcase, DollarSign, Activity, ChevronRight } from 'lucide-react';
import axios from 'axios';

// 12 星座列表
const SIGNS = [
    '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
    '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
];

// 星座图标映射（使用 emoji）
const SIGN_EMOJIS: Record<string, string> = {
    '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
    '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
    '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
};

// 分数条组件
function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
    const color = score >= 80 ? '#8B4513' : score >= 60 ? '#E8C490' : '#9D2933';
    return (
        <div className="flex items-center space-x-3">
            <div className="text-primary w-5">{icon}</div>
            <span className="text-sm text-[#666666] w-12 shrink-0">{label}</span>
            <div className="flex-1 h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${score}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-sm font-bold text-primary w-8 text-right">{score}</span>
        </div>
    );
}

export default function ConstellationPage() {
    const [selectedSign, setSelectedSign] = useState<string>('白羊座');
    const [timeSpan, setTimeSpan] = useState<string>('今日');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleQuery = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.post('/api/constellation', { sign: selectedSign, timeSpan });
            const data = res.data?.data || res.data;
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || '星象推演失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 页面标题 */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">星盘运势</h1>
                    <p className="text-[#666666] tracking-widest">观周天星宿，知流年吉凶</p>
                </div>

                {/* 控制面板 */}
                {!result && !loading && (
                    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <Card className="glass-card border-none shadow-lg">
                            <div className="space-y-6">
                                {/* 星座选择网格 */}
                                <div>
                                    <label className="block text-sm text-[#666666] tracking-wider mb-3">本命星位</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {SIGNS.map((sign) => (
                                            <button
                                                type="button"
                                                key={sign}
                                                onClick={() => setSelectedSign(sign)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all duration-200 text-center
                                                ${selectedSign === sign
                                                        ? 'border-primary bg-primary text-white shadow-md'
                                                        : 'border-[#E8C490]/30 bg-white/50 hover:border-primary hover:bg-primary/5 text-primary'
                                                    }
                                                `}
                                            >
                                                <span className="text-2xl mb-1">{SIGN_EMOJIS[sign]}</span>
                                                <span className={`text-sm ${selectedSign === sign ? 'font-bold' : ''}`}>
                                                    {sign}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 测算天时 */}
                                <div>
                                    <label className="block text-sm text-[#666666] tracking-wider mb-3">测算天时</label>
                                    <div className="flex space-x-3">
                                        {['今日', '明日', '本周', '本月'].map(ts => (
                                            <button
                                                type="button"
                                                key={ts}
                                                onClick={() => setTimeSpan(ts)}
                                                className={`flex-1 rounded-sm py-3 text-center cursor-pointer transition-all border
                                                ${timeSpan === ts
                                                        ? 'bg-secondary text-primary border-secondary font-bold shadow-md'
                                                        : 'border-[#E8C490]/30 bg-white/50 hover:bg-[#F5F5F5] text-primary hover:border-primary'
                                                    }`}
                                            >
                                                {ts}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && <p className="text-accent text-sm text-center font-bold">{error}</p>}

                                <div className="pt-2">
                                    <Button fullWidth size="lg" onClick={handleQuery}>解析星盘天机</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* 加载状态 */}
                {loading && <Loading text="星轴旋转，观溯星盘..." type="compass" />}

                {/* 结果展示 */}
                {result && !loading && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setResult(null)}
                                className="text-primary hover:text-accent font-bold"
                            >
                                &larr; 重新测算
                            </button>
                        </div>

                        {/* 总览卡片 */}
                        <Card className="text-center glass-card border-none shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                            <div className="text-5xl mb-3">{SIGN_EMOJIS[result.sign || selectedSign]}</div>
                            <h2 className="text-3xl font-title text-primary mb-1">{result.sign || selectedSign}</h2>
                            <p className="text-[#666666] text-sm mb-4">
                                {result.period}运势 &bull; {result.date}
                            </p>
                            <div className="inline-flex items-center bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                                <span className="text-primary font-bold text-3xl">{result.overall_score}</span>
                                <span className="text-[#666666] text-sm ml-2">综合评定</span>
                            </div>
                            <p className="mt-5 text-[#333333] leading-relaxed max-w-2xl mx-auto">
                                {result.overall}
                            </p>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* 左侧：评分与运势 */}
                            <div className="md:col-span-8 space-y-6">
                                {/* 运势评分条 */}
                                <Card className="glass-card border-none">
                                    <h3 className="font-title text-xl text-primary mb-5 flex items-center border-b border-[#E8C490]/30 pb-2">
                                        <TrendingUp className="w-5 h-5 mr-2" />星运雷达
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <ScoreBar label="感情" score={result.love_score} icon={<Heart className="w-4 h-4" />} />
                                        <ScoreBar label="事业" score={result.career_score} icon={<Briefcase className="w-4 h-4" />} />
                                        <ScoreBar label="财运" score={result.wealth_score} icon={<DollarSign className="w-4 h-4" />} />
                                        <ScoreBar label="健康" score={result.health_score} icon={<Activity className="w-4 h-4" />} />
                                    </div>
                                </Card>

                                {/* 详细运势 */}
                                <Card className="glass-card border-none">
                                    <h3 className="font-title text-xl text-primary mb-5 flex items-center border-b border-[#E8C490]/30 pb-2">
                                        <Star className="w-5 h-5 mr-2" />命局指引
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-primary font-bold mb-1 flex justify-between">
                                                <span>💕 感情运势</span>
                                            </h4>
                                            <p className="text-sm text-[#333333] leading-relaxed">{result.love}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-primary font-bold mb-1 flex justify-between">
                                                <span>💼 事业学业</span>
                                            </h4>
                                            <p className="text-sm text-[#333333] leading-relaxed">{result.career}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-primary font-bold mb-1 flex justify-between">
                                                <span>💰 财富运势</span>
                                            </h4>
                                            <p className="text-sm text-[#333333] leading-relaxed">{result.wealth}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* 右侧：幸运与提示 */}
                            <div className="md:col-span-4 space-y-6">
                                {/* 幸运属性 */}
                                <Card className="glass-card border-none bg-primary/5">
                                    <h3 className="font-title text-lg text-primary mb-4">🍀 幸运罗盘</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white/60 p-3 rounded-md flex justify-between items-center shadow-sm">
                                            <span className="text-[#666666] text-sm">幸运色彩</span>
                                            <span className="font-bold text-primary">{result.lucky_color}</span>
                                        </div>
                                        <div className="bg-white/60 p-3 rounded-md flex justify-between items-center shadow-sm">
                                            <span className="text-[#666666] text-sm">灵息数字</span>
                                            <span className="font-bold text-primary">{result.lucky_number}</span>
                                        </div>
                                        <div className="bg-white/60 p-3 rounded-md flex justify-between items-center shadow-sm">
                                            <span className="text-[#666666] text-sm">吉利方位</span>
                                            <span className="font-bold text-primary">{result.lucky_direction}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* 宜忌 */}
                                {result.do_list && result.dont_list && (
                                    <Card className="glass-card border-none">
                                        <h3 className="font-title text-lg text-primary mb-3">📋 行事宜忌</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded shadow-sm">宜</span>
                                                <div className="mt-2 space-y-1">
                                                    {result.do_list?.map((item: string, i: number) => (
                                                        <p key={i} className="text-xs text-[#333333] flex items-center">
                                                            <ChevronRight className="w-3 h-3 text-green-600 mr-1 shrink-0" />{item}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-[#E8C490]/20">
                                                <span className="inline-block bg-accent/10 text-accent text-xs px-2 py-0.5 rounded shadow-sm">忌</span>
                                                <div className="mt-2 space-y-1">
                                                    {result.dont_list?.map((item: string, i: number) => (
                                                        <p key={i} className="text-xs text-[#666666] flex items-center">
                                                            <ChevronRight className="w-3 h-3 text-accent/50 mr-1 shrink-0" />{item}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* 箴言与建议 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="glass-card border-none bg-gradient-to-br from-secondary/20 to-transparent">
                                <h3 className="font-title text-lg text-primary mb-2 flex items-center">
                                    <span className="w-1.5 h-4 bg-primary mr-2 block rounded-sm"></span>星语忠告
                                </h3>
                                <p className="text-sm text-[#333333] leading-relaxed">{result.suggestion}</p>
                            </Card>

                            {result.tip && (
                                <Card className="glass-card border-none bg-primary text-white flex flex-col justify-center items-center text-center py-6">
                                    <Star className="w-6 h-6 text-secondary mb-2 opacity-80" />
                                    <p className="font-title text-xl tracking-widest text-secondary">「{result.tip}」</p>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
