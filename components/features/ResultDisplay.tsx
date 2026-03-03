"use client";
import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download } from 'lucide-react';

interface BaziData {
    bazi: string[];
    wuxing: string;
    analysis: {
        character: string;
        career: string;
        marriage: string;
    };
    suggestion: string;
}

interface ResultDisplayProps {
    type: 'bazi' | 'palm' | 'constellation';
    data: any;
    userInfo?: any;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ type, data, userInfo }) => {
    const resultRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!resultRef.current) return;
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                backgroundColor: '#FFFFFF',
                useCORS: true,
            });
            const imgUrl = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.download = `知命_${type === 'bazi' ? '八字' : '手相'}解析_${new Date().getTime()}.jpg`;
            link.href = imgUrl;
            link.click();
        } catch (error) {
            console.error('保存图片失败:', error);
            alert('保存图片失败，请稍后重试');
        }
    };

    const renderBazi = (bData: BaziData) => {
        return (
            <div className="flex flex-col md:flex-row gap-8">
                {/* 左侧文字解析 */}
                <div className="flex-1 space-y-6 text-[#333333] leading-[1.8]">
                    {userInfo && (
                        <div className="pb-4 border-b border-[#E8C490]/30">
                            <h3 className="font-title text-xl text-primary mb-2">缘主信息</h3>
                            <p>姓名：{userInfo.name} | 性别：{userInfo.gender}</p>
                            <p>出生：{userInfo.date} ({userInfo.calendarType}) {userInfo.time}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            命局总览
                        </h3>
                        <p className="mb-2"><span className="font-bold text-accent">五行分布：</span>{bData.wuxing}</p>
                    </div>

                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            性格特质
                        </h3>
                        <p>{bData.analysis?.character}</p>
                    </div>

                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            事业财运
                        </h3>
                        <p>{bData.analysis?.career}</p>
                    </div>

                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            婚姻感情
                        </h3>
                        <p>{bData.analysis?.marriage}</p>
                    </div>

                    <div className="bg-[#F5F5F5] p-4 rounded-sm border-l-4 border-secondary mt-4">
                        <h4 className="font-bold text-primary mb-1">知命真言：</h4>
                        <p className="text-sm">{bData.suggestion}</p>
                    </div>
                </div>

                {/* 右侧可视化八字排盘 */}
                <div className="w-full md:w-64 shrink-0 flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-[#E8C490]/30 pt-8 md:pt-0 pl-0 md:pl-8 mt-6 md:mt-0">
                    <h3 className="font-title text-2xl text-primary mb-6">先天八字排盘</h3>
                    <div className="grid grid-cols-4 gap-2 w-full text-center">
                        <div className="font-bold text-[#666666] mb-2 border-b border-[#E8C490]/50 pb-1">年柱</div>
                        <div className="font-bold text-[#666666] mb-2 border-b border-[#E8C490]/50 pb-1">月柱</div>
                        <div className="font-bold text-[#666666] mb-2 border-b border-[#E8C490]/50 pb-1">日柱</div>
                        <div className="font-bold text-[#666666] mb-2 border-b border-[#E8C490]/50 pb-1">时柱</div>

                        {bData.bazi?.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {/* 提取天干 */}
                                <div className="text-2xl font-title text-primary bg-[#F5F5F5] py-3 rounded-sm">
                                    {item.charAt(0)}
                                </div>
                            </React.Fragment>
                        ))}

                        {bData.bazi?.map((item, idx) => (
                            <React.Fragment key={idx + 'dz'}>
                                {/* 提取地支 */}
                                <div className="text-2xl font-title text-primary bg-[#F5F5F5] py-3 rounded-sm mt-1">
                                    {item.charAt(1)}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mt-12 text-center text-[#666666] text-xs">
                        <p>※ 命理测算仅供参考</p>
                        <p>一切造化皆在自身</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderPalm = (pData: any) => {
        // 手相排版将在手相模块具体实现
        return (
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6 text-[#333333] leading-[1.8]">
                    {/* ... 左侧解析 */}
                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            掌纹总览
                        </h3>
                        <p className="mb-2"><span className="font-bold text-accent">图像质量：</span>{pData.palm_quality}</p>
                        <p>{pData.summary}</p>
                    </div>

                    {['emotion', 'wisdom', 'life', 'career', 'wealth'].map((lineKey) => {
                        const lineNameMap: Record<string, string> = {
                            emotion: '感情线', wisdom: '智慧线', life: '生命线', career: '事业线', wealth: '财运线'
                        };
                        const lineData = pData.lines?.[lineKey];
                        if (!lineData) return null;
                        return (
                            <div key={lineKey}>
                                <h3 className="font-title text-xl text-primary mb-2 mt-4">{lineNameMap[lineKey]}</h3>
                                <p className="text-sm mb-1 text-[#666666]">特征：{lineData.feature}</p>
                                <p>{lineData.analysis}</p>
                            </div>
                        );
                    })}

                    <div className="bg-[#F5F5F5] p-4 rounded-sm border-l-4 border-secondary mt-4">
                        <h4 className="font-bold text-primary mb-2">知命真言：</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {pData.suggestion?.map((sugg: string, i: number) => (
                                <li key={i}>{sugg}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 右侧可视化 */}
                <div className="w-full md:w-64 shrink-0 flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-[#E8C490]/30 pt-8 md:pt-0 pl-0 md:pl-8 mt-6 md:mt-0">
                    <h3 className="font-title text-2xl text-primary mb-6">掌纹灵析</h3>
                    <div className="w-48 h-64 border border-[#8B4513] border-dashed flex items-center justify-center opacity-50 relative">
                        <span className="font-title text-xl writing-vertical-rl tracking-widest text-[#8B4513]">先天罗网蕴天机</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderConstellation = (cData: any) => {
        return (
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6 text-[#333333] leading-[1.8]">
                    {userInfo && (
                        <div className="pb-4 border-b border-[#E8C490]/30">
                            <h3 className="font-title text-xl text-primary mb-2">星盘客座</h3>
                            <p>星座：{userInfo.sign} | 周期：{userInfo.timeSpan}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="font-title text-2xl text-primary mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary mr-2 block rounded-sm"></span>
                            星运总览
                        </h3>
                        <p>{cData.overall}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-title text-xl text-primary mb-2">命定良缘</h3>
                            <p className="text-sm">{cData.love}</p>
                        </div>
                        <div>
                            <h3 className="font-title text-xl text-primary mb-2">事业青云</h3>
                            <p className="text-sm">{cData.career}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-title text-xl text-primary mb-2">流年财富</h3>
                        <p className="text-sm">{cData.wealth}</p>
                    </div>

                    <div className="bg-[#F5F5F5] p-4 rounded-sm border-l-4 border-secondary mt-4">
                        <h4 className="font-bold text-primary mb-1">星语忠告：</h4>
                        <p className="text-sm">{cData.suggestion}</p>
                    </div>
                </div>

                {/* 右侧可视化提示 */}
                <div className="w-full md:w-64 shrink-0 flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-[#E8C490]/30 pt-8 md:pt-0 pl-0 md:pl-8 mt-6 md:mt-0">
                    <h3 className="font-title text-2xl text-primary mb-6">天地共鸣</h3>
                    <div className="space-y-4 w-full">
                        <div className="bg-[#F5F5F5] p-3 text-center rounded-sm">
                            <span className="text-[#666666] text-sm block mb-1">幸运色彩</span>
                            <span className="font-bold text-primary text-lg">{cData.luckyAttrs?.color}</span>
                        </div>
                        <div className="bg-[#F5F5F5] p-3 text-center rounded-sm">
                            <span className="text-[#666666] text-sm block mb-1">灵息数字</span>
                            <span className="font-bold text-primary text-lg">{cData.luckyAttrs?.number}</span>
                        </div>
                        <div className="bg-[#F5F5F5] p-3 text-center rounded-sm">
                            <span className="text-[#666666] text-sm block mb-1">吉利方位</span>
                            <span className="font-bold text-primary text-lg">{cData.luckyAttrs?.direction}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* 包裹需要截图的区域 */}
            <div
                ref={resultRef}
                className="bg-white p-6 md:p-10 rounded-sm relative"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620803566129-37f0e9b977a4?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
                <div className="text-center mb-8 border-b-2 border-primary/20 pb-4">
                    <h2 className="text-4xl font-title text-primary tracking-widest">
                        {type === 'bazi' ? '先天命局批断' : type === 'palm' ? '掌纹天机灵析' : '周天星盘运势'}
                    </h2>
                </div>

                {type === 'bazi' && data ? renderBazi(data) : null}
                {type === 'palm' && data ? renderPalm(data) : null}
                {type === 'constellation' && data ? renderConstellation(data) : null}
            </div>

            {/* 底部操作区（不参与截图） */}
            <div className="mt-8 flex justify-center">
                <Button onClick={handleSaveImage} className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>保存批断灵签</span>
                </Button>
            </div>
        </div>
    );
};
