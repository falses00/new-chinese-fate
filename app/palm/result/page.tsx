"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function PalmResultPage() {
    const router = useRouter();
    const [resultData, setResultData] = useState<any>(null);

    useEffect(() => {
        const storageItem = localStorage.getItem('latest_palm_result');
        if (storageItem) {
            try {
                const parsed = JSON.parse(storageItem);
                setResultData(parsed.result);
            } catch (e) {
                console.error("解析结果失败", e);
            }
        } else {
            router.push('/palm');
        }
    }, [router]);

    if (!resultData) {
        return <div className="min-h-screen pt-32"><Loading text="正在展开命盘..." type="bagua" /></div>;
    }

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up">
            <div className="w-full flex justify-between items-center mb-8">
                <Link href="/palm" className="text-primary hover:text-accent transition-colors">
                    &larr; 重新截取
                </Link>
                <Link href="/" className="text-primary hover:text-accent transition-colors flex items-center">
                    <Home className="w-5 h-5 mr-1" />
                    返回首页
                </Link>
            </div>

            <ResultDisplay type="palm" data={resultData} />
        </div>
    );
}
