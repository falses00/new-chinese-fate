"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Compass } from 'lucide-react';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { BaziForm } from '@/components/features/BaziForm';

export default function BaziPage() {
    const [resultData, setResultData] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFormSubmit = async (formData: any) => {
        setLoading(true);
        setErrorMsg('');
        setResultData(null);

        try {
            const res = await fetch('/api/bazi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || '请求失败');

            setUserInfo(formData);
            setResultData(data.data || data);

            // 仍保留在 localStorage 借以备用
            localStorage.setItem('latest_bazi_result', JSON.stringify({
                userInfo: formData,
                result: data.data || data
            }));
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* 页面标题 */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <Compass className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">生辰八字排盘</h1>
                    <p className="text-[#666666] tracking-widest">顺天应人，探寻先天命局密码</p>
                </div>

                {!resultData && !loading && (
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <Card className="glass-card border-none shadow-lg max-w-2xl mx-auto">
                            <BaziForm onSubmitOverride={handleFormSubmit} externalError={errorMsg} />
                        </Card>
                    </div>
                )}

                {loading && <Loading text="理清四柱，流年运演中..." type="compass" />}

                {resultData && !loading && (
                    <div className="animate-fade-in-up">
                        <div className="mb-6 flex justify-between">
                            <button
                                onClick={() => setResultData(null)}
                                className="text-primary hover:text-accent font-bold"
                            >
                                &larr; 重新测算
                            </button>
                        </div>
                        <ResultDisplay type="bazi" data={resultData} userInfo={userInfo} />
                    </div>
                )}
            </div>
        </div>
    );
}
