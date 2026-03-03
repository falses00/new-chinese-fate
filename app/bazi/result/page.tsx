"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function BaziResultPage() {
    const router = useRouter();
    const [resultData, setResultData] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        // 从 localStorage 读取数据
        const storageItem = localStorage.getItem('latest_bazi_result');
        if (storageItem) {
            try {
                const parsed = JSON.parse(storageItem);
                setResultData(parsed.result);
                setUserInfo(parsed.userInfo);
            } catch (e) {
                console.error("解析结果失败", e);
            }
        } else {
            // 若无数据，重定向回表单页
            router.push('/bazi');
        }
    }, [router]);

    if (!resultData) {
        return <div className="min-h-screen pt-32"><Loading text="正在展开命盘..." /></div>;
    }

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up">
            <div className="w-full flex justify-between items-center mb-8">
                <Link href="/bazi" className="text-primary hover:text-accent transition-colors">
                    &larr; 重新测算
                </Link>
                <Link href="/" className="text-primary hover:text-accent transition-colors flex items-center">
                    <Home className="w-5 h-5 mr-1" />
                    返回首页
                </Link>
            </div>

            <ResultDisplay type="bazi" data={resultData} userInfo={userInfo} />
        </div>
    );
}
