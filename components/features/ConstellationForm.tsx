"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';

const SIGNS = [
    '白羊座', '金牛座', '双子座', '巨蟹座',
    '狮子座', '处女座', '天秤座', '天蝎座',
    '射手座', '摩羯座', '水瓶座', '双鱼座'
];

export const ConstellationForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ sign: '白羊座', timeSpan: '今日' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const res = await fetch('/api/constellation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || '请求失败');

            localStorage.setItem('latest_constellation_result', JSON.stringify({
                userInfo: formData,
                result: data.data
            }));
            router.push('/constellation/result');
        } catch (err: any) {
            setErrorMsg(err.message);
            setLoading(false);
        }
    };

    if (loading) return <Loading text="星轴旋转，观溯星盘..." type="compass" />;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            <div className="space-y-2">
                <label className="block text-sm text-[#666666] tracking-wider">本命星位</label>
                <div className="grid grid-cols-3 gap-3">
                    {SIGNS.map(sign => (
                        <div
                            key={sign}
                            onClick={() => setFormData({ ...formData, sign })}
                            className={`border rounded-sm py-2 text-center cursor-pointer transition-all ${formData.sign === sign ? 'bg-primary text-white border-primary shadow-md' : 'border-[#E8C490]/50 hover:bg-[#F5F5F5] text-primary'}`}
                        >
                            {sign}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm text-[#666666] tracking-wider">测算天时</label>
                <div className="flex space-x-3">
                    {['今日', '明日', '本周', '本月'].map(ts => (
                        <div
                            key={ts}
                            onClick={() => setFormData({ ...formData, timeSpan: ts })}
                            className={`flex-1 border rounded-sm py-2 text-center cursor-pointer transition-all ${formData.timeSpan === ts ? 'bg-secondary text-primary border-secondary font-bold' : 'border-[#E8C490]/50 hover:bg-[#F5F5F5] text-primary'}`}
                        >
                            {ts}
                        </div>
                    ))}
                </div>
            </div>
            {errorMsg && <p className="text-accent text-sm text-center font-bold">{errorMsg}</p>}
            <div className="pt-4">
                <Button fullWidth type="submit" disabled={loading}>解析星盘天机</Button>
            </div>
        </form>
    );
};
