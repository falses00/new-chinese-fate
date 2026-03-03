"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Heart, ChevronRight } from 'lucide-react';
import axios from 'axios';

// 时辰选项
const TIME_OPTIONS = [
    '子时 (23:00-01:00)', '丑时 (01:00-03:00)', '寅时 (03:00-05:00)', '卯时 (05:00-07:00)',
    '辰时 (07:00-09:00)', '巳时 (09:00-11:00)', '午时 (11:00-13:00)', '未时 (13:00-15:00)',
    '申时 (15:00-17:00)', '酉时 (17:00-19:00)', '戌时 (19:00-21:00)', '亥时 (21:00-23:00)',
];

// 雷达图 SVG 组件
function RadarChart({ dimensions }: { dimensions: Record<string, any> }) {
    const entries = Object.values(dimensions);
    const n = entries.length;
    const cx = 120, cy = 120, r = 90;

    // 计算各点坐标
    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
        const ratio = value / 100;
        return {
            x: cx + r * ratio * Math.cos(angle),
            y: cy + r * ratio * Math.sin(angle),
        };
    };

    // 网格环
    const gridLevels = [0.25, 0.5, 0.75, 1];

    // 数据多边形
    const dataPoints = entries.map((e: any, i) => getPoint(i, e.score));
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
        <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
            {/* 网格 */}
            {gridLevels.map((level) => {
                const points = Array.from({ length: n }, (_, i) => getPoint(i, level * 100));
                const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                return <path key={level} d={path} fill="none" stroke="#E8C490" strokeWidth="0.5" opacity={0.4} />;
            })}

            {/* 轴线 */}
            {entries.map((_: any, i: number) => {
                const p = getPoint(i, 100);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E8C490" strokeWidth="0.5" opacity={0.3} />;
            })}

            {/* 数据区域 */}
            <path d={dataPath} fill="#8B4513" fillOpacity={0.15} stroke="#8B4513" strokeWidth="2" />

            {/* 数据点 */}
            {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#8B4513" />
            ))}

            {/* 标签 */}
            {entries.map((e: any, i: number) => {
                const labelPoint = getPoint(i, 125);
                return (
                    <text
                        key={i}
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] fill-[#666666]"
                    >
                        {e.label}
                    </text>
                );
            })}
        </svg>
    );
}

export default function CompatibilityPage() {
    const [male, setMale] = useState({ name: '', date: '', time: '' });
    const [female, setFemale] = useState({ name: '', date: '', time: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!male.name || !male.date || !male.time || !female.name || !female.date || !female.time) {
            setError('请填写双方完整信息');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.post('/api/compatibility', { male, female });
            const data = res.data?.data || res.data;
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || '合婚推演失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 个人信息表单块
    const PersonForm = ({ label, emoji, value, onChange }: { label: string; emoji: string; value: typeof male; onChange: (v: typeof male) => void }) => (
        <div className="space-y-4">
            <h3 className="font-title text-xl text-primary flex items-center">
                <span className="text-2xl mr-2">{emoji}</span>{label}
            </h3>
            <div>
                <label className="block text-sm text-[#666666] mb-1">姓名</label>
                <input
                    type="text"
                    value={value.name}
                    onChange={(e) => onChange({ ...value, name: e.target.value })}
                    placeholder="请输入姓名"
                    className="w-full h-11 px-4 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
            focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-sm text-[#666666] mb-1">出生日期</label>
                <input
                    type="date"
                    value={value.date}
                    onChange={(e) => onChange({ ...value, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 px-4 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
            focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-sm text-[#666666] mb-1">出生时辰</label>
                <select
                    value={value.time}
                    onChange={(e) => onChange({ ...value, time: e.target.value })}
                    className="w-full h-11 px-4 border border-[#E8C490]/50 rounded-sm bg-[#F5F5F5] text-[#333333]
            focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                >
                    <option value="">请选择时辰</option>
                    {TIME_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 标题 */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">合婚配对</h1>
                    <p className="text-[#666666] tracking-widest">缘定三生，看你们的前世今生</p>
                </div>

                {/* 表单 */}
                {!result && !loading && (
                    <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <PersonForm label="男方信息" emoji="🤵" value={male} onChange={setMale} />
                                <PersonForm label="女方信息" emoji="👰" value={female} onChange={setFemale} />
                            </div>

                            {error && <p className="text-accent text-sm text-center mt-4">{error}</p>}

                            <div className="mt-8">
                                <Button type="submit" fullWidth size="lg">
                                    <Heart className="w-5 h-5 mr-2" />
                                    开始合婚
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* 加载 */}
                {loading && <Loading text="缘分天机推演中..." />}

                {/* 结果 */}
                {result && !loading && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* 总分 */}
                        <Card className="text-center">
                            <div className="flex justify-center items-center space-x-6 mb-4">
                                <div>
                                    <span className="text-2xl">🤵</span>
                                    <p className="font-title text-primary text-lg">{male.name}</p>
                                </div>
                                <div className="relative">
                                    <Heart className="w-16 h-16 text-accent animate-breath" />
                                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                                        {result.overall_score}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl">👰</span>
                                    <p className="font-title text-primary text-lg">{female.name}</p>
                                </div>
                            </div>
                            <p className="text-[#666666] text-sm">合婚契合度</p>
                        </Card>

                        {/* 雷达图 */}
                        {result.dimensions && (
                            <Card>
                                <h3 className="font-title text-xl text-primary mb-4 text-center">六维匹配度</h3>
                                <RadarChart dimensions={result.dimensions} />
                            </Card>
                        )}

                        {/* 维度详细分析 */}
                        {result.dimensions && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(result.dimensions).map(([key, val]: [string, any]) => (
                                    <Card key={key}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-title text-lg text-primary">{val.label}</h4>
                                            <span className="font-bold text-primary text-xl">{val.score}</span>
                                        </div>
                                        <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden mb-3">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${val.score}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-[#333333] leading-relaxed">{val.analysis}</p>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* 五行互补 */}
                        {result.wuxing_match && (
                            <Card>
                                <h3 className="font-title text-xl text-primary mb-3 flex items-center">
                                    <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>五行互补
                                </h3>
                                <p className="text-[#333333] leading-[1.8]">{result.wuxing_match}</p>
                            </Card>
                        )}

                        {/* 总评 + 建议 */}
                        <Card className="bg-primary/5">
                            <h3 className="font-title text-xl text-primary mb-3">💝 合婚总评</h3>
                            <p className="text-[#333333] leading-[1.8] mb-4">{result.summary}</p>
                            {result.suggestions && (
                                <div className="space-y-1 mb-4">
                                    {result.suggestions.map((s: string, i: number) => (
                                        <p key={i} className="text-sm text-[#333333] flex items-start">
                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />{s}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {result.lucky && (
                                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E8C490]/30">
                                    <div className="text-center">
                                        <span className="text-sm text-[#666666]">宜婚方位</span>
                                        <p className="font-bold text-primary">{result.lucky.wedding_direction}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm text-[#666666]">宜婚时节</span>
                                        <p className="font-bold text-primary">{result.lucky.wedding_season}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm text-[#666666]">幸运色</span>
                                        <p className="font-bold text-primary">{result.lucky.lucky_color}</p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <div className="text-center">
                            <Button variant="outline" onClick={() => { setResult(null); setError(''); }}>
                                重新配对
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
