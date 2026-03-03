"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Type, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function NamePage() {
    const [surname, setSurname] = useState('');
    const [givenName, setGivenName] = useState('');
    const [gender, setGender] = useState('男');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!surname.trim() || !givenName.trim()) {
            setError('请输入完整的姓名');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.post('/api/name', { surname: surname.trim(), givenName: givenName.trim(), gender });
            const data = res.data?.data || res.data;
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || '姓名测算失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 五格运势颜色
    const luckColor = (luck: string) => {
        if (luck?.includes('吉')) return 'text-green-600 bg-green-50';
        if (luck?.includes('凶')) return 'text-red-500 bg-red-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* 页面标题 */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <Type className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">姓名测算</h1>
                    <p className="text-[#666666] tracking-widest">名以定命，字蕴乾坤</p>
                </div>

                {/* 输入表单 */}
                {!result && !loading && (
                    <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#666666] mb-2">姓氏</label>
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        placeholder="如：李"
                                        maxLength={2}
                                        className="w-full h-12 px-4 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
                      focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-lg font-title text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#666666] mb-2">名字</label>
                                    <input
                                        type="text"
                                        value={givenName}
                                        onChange={(e) => setGivenName(e.target.value)}
                                        placeholder="如：明远"
                                        maxLength={3}
                                        className="w-full h-12 px-4 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
                      focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-lg font-title text-center"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#666666] mb-2">性别</label>
                                <div className="flex space-x-4">
                                    {['男', '女'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`flex-1 h-11 rounded-sm border transition-all text-center
                        ${gender === g
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-[#E8C490]/50 text-[#666666] hover:border-primary'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-accent text-sm text-center">{error}</p>}

                            <Button type="submit" fullWidth size="lg">
                                <Star className="w-5 h-5 mr-2" />
                                开始测算
                            </Button>
                        </form>
                    </Card>
                )}

                {/* 加载状态 */}
                {loading && <Loading text="姓名天机推演中..." />}

                {/* 结果展示 */}
                {result && !loading && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* 总分 */}
                        <Card className="text-center">
                            <h2 className="text-4xl font-title text-primary mb-2">{result.name}</h2>
                            <p className="text-[#666666] text-sm mb-4">{gender}</p>
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F5F5F5" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="42" fill="none" stroke="#8B4513" strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(result.total_score / 100) * 264} 264`}
                                        transform="rotate(-90 50 50)"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-primary">{result.total_score}</span>
                                    <span className="text-xs text-[#666666]">综合评分</span>
                                </div>
                            </div>
                        </Card>

                        {/* 五格分析 */}
                        {result.wuge && (
                            <Card>
                                <h3 className="font-title text-xl text-primary mb-4 flex items-center">
                                    <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                                    五格剖象
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(result.wuge).map(([key, val]: [string, any]) => {
                                        const labelMap: Record<string, string> = {
                                            tiange: '天格', renge: '人格', dige: '地格', waige: '外格', zongge: '总格'
                                        };
                                        return (
                                            <div key={key} className="flex items-start space-x-3 p-3 bg-[#F5F5F5] rounded-sm">
                                                <div className="text-center shrink-0">
                                                    <span className="block text-xs text-[#666666]">{labelMap[key]}</span>
                                                    <span className="block text-2xl font-title text-primary">{val.value}</span>
                                                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${luckColor(val.luck)}`}>{val.luck}</span>
                                                </div>
                                                <p className="text-sm text-[#333333] leading-relaxed">{val.meaning}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        {/* 字义解析 */}
                        {result.character_analysis && (
                            <Card>
                                <h3 className="font-title text-xl text-primary mb-3 flex items-center">
                                    <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                                    字义深解
                                </h3>
                                <p className="text-[#333333] leading-[1.8]">{result.character_analysis}</p>
                            </Card>
                        )}

                        {/* 音韵分析 */}
                        {result.sound_analysis && (
                            <Card>
                                <h3 className="font-title text-xl text-primary mb-3 flex items-center">
                                    <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                                    音韵调和
                                </h3>
                                <p className="text-[#333333] leading-[1.8]">{result.sound_analysis}</p>
                            </Card>
                        )}

                        {/* 性格/事业/人际 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <h3 className="font-title text-lg text-primary mb-3">🧠 性格暗示</h3>
                                <p className="text-sm text-[#333333] leading-relaxed">{result.personality}</p>
                            </Card>
                            <Card>
                                <h3 className="font-title text-lg text-primary mb-3">💼 事业暗示</h3>
                                <p className="text-sm text-[#333333] leading-relaxed">{result.career}</p>
                            </Card>
                            <Card>
                                <h3 className="font-title text-lg text-primary mb-3">💕 情感暗示</h3>
                                <p className="text-sm text-[#333333] leading-relaxed">{result.relationship}</p>
                            </Card>
                        </div>

                        {/* 综合评语 + 建议 */}
                        <Card className="bg-primary/5">
                            <h3 className="font-title text-xl text-primary mb-3">📜 综合评语</h3>
                            <p className="text-[#333333] leading-[1.8] mb-4">{result.summary}</p>
                            {result.suggestions && (
                                <div>
                                    <h4 className="font-bold text-primary text-sm mb-2">改善建议：</h4>
                                    <ul className="space-y-1">
                                        {result.suggestions.map((s: string, i: number) => (
                                            <li key={i} className="text-sm text-[#333333] flex items-start">
                                                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Card>

                        {/* 重新测算 */}
                        <div className="text-center">
                            <Button variant="outline" onClick={() => { setResult(null); setError(''); }}>
                                重新测算
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
