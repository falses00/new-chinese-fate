"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { isFutureDate } from '@/lib/utils/date';

interface BaziFormProps {
    onSubmitOverride?: (data: any) => void;
    externalError?: string;
}

export const BaziForm = ({ onSubmitOverride, externalError }: BaziFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '男',
        calendarType: '公历',
        date: '',
        time: '子时'
    });
    const [localError, setLocalError] = useState('');

    const errorMsg = externalError || localError;

    const timeOptions = [
        '子时 (23:00-01:00)', '丑时 (01:00-03:00)', '寅时 (03:00-05:00)',
        '卯时 (05:00-07:00)', '辰时 (07:00-09:00)', '巳时 (09:00-11:00)',
        '午时 (11:00-13:00)', '未时 (13:00-15:00)', '申时 (15:00-17:00)',
        '酉时 (17:00-19:00)', '戌时 (19:00-21:00)', '亥时 (21:00-23:00)'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.name || !formData.date) {
            setLocalError('天机不可泄露给无名无期之人，请填写完整信息');
            return;
        }

        if (isFutureDate(formData.date)) {
            setLocalError('时序未到，无从算起，出生日期不得为未来时间');
            return;
        }

        if (onSubmitOverride) {
            onSubmitOverride(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            {/* 姓名 */}
            <div className="space-y-2">
                <label className="block text-sm text-[#666666] tracking-wider">缘主姓名</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 bg-white/60 rounded-sm outline-none focus:ring-1 focus:ring-primary border border-[#E8C490]/50 transition-all font-bold text-[#333333] tracking-widest text-center"
                    placeholder="如：李明远"
                />
            </div>

            {/* 性别 */}
            <div className="space-y-2">
                <label className="block text-sm text-[#666666] tracking-wider mb-2">缘主性别</label>
                <div className="flex space-x-4">
                    {['男', '女'].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g })}
                            className={`flex-1 h-11 rounded-sm border transition-all text-center
                        ${formData.gender === g
                                    ? 'border-primary bg-primary text-white font-bold shadow-md'
                                    : 'border-[#E8C490]/50 bg-white/50 text-[#666666] hover:border-primary'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* 历法类型与日期 */}
            <div className="flex space-x-4">
                <div className="w-1/3 space-y-2">
                    <label className="block text-sm text-[#666666] tracking-wider">历法</label>
                    <select
                        value={formData.calendarType}
                        onChange={(e) => setFormData({ ...formData, calendarType: e.target.value })}
                        className="w-full h-11 px-2 bg-white/60 rounded-sm outline-none focus:ring-1 focus:ring-primary border border-[#E8C490]/50 transition-all text-center"
                    >
                        <option value="公历">公历</option>
                        <option value="农历">农历</option>
                    </select>
                </div>
                <div className="w-2/3 space-y-2">
                    <label className="block text-sm text-[#666666] tracking-wider">出生日期</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full h-11 px-4 bg-white/60 rounded-sm outline-none focus:ring-1 focus:ring-primary border border-[#E8C490]/50 transition-all"
                    />
                </div>
            </div>

            {/* 时辰 */}
            <div className="space-y-2">
                <label className="block text-sm text-[#666666] tracking-wider">出生时辰</label>
                <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full h-11 px-4 bg-white/60 rounded-sm outline-none focus:ring-1 focus:ring-primary border border-[#E8C490]/50 transition-all"
                >
                    {timeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            {errorMsg && <p className="text-accent text-sm text-center font-bold tracking-wide">{errorMsg}</p>}

            <div className="pt-4">
                <Button fullWidth size="lg" type="submit">开启排盘</Button>
            </div>
        </form>
    );
};
