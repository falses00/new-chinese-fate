import React from 'react';
import { Compass } from 'lucide-react';

interface LoadingProps {
    text?: string;
    type?: 'compass' | 'bagua';
}

export const Loading: React.FC<LoadingProps> = ({ text = '测算中...', type = 'compass' }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
            {type === 'compass' ? (
                <Compass className="w-10 h-10 text-primary animate-rotate" />
            ) : (
                <div className="w-10 h-10 text-primary animate-rotate">
                    {/* SVG 八卦阵图标由于无直接依赖库，使用组合或简单SVG替代 */}
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        {/* 外圈 */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
                        {/* 阴阳鱼简易版 */}
                        <path d="M50 5 a45 45 0 0 1 0 90 a22.5 22.5 0 0 0 0 -45 a22.5 22.5 0 0 1 0 -45" fill="currentColor" />
                        <path d="M50 5 a45 45 0 0 0 0 90 a22.5 22.5 0 0 0 0 -45 a22.5 22.5 0 0 1 0 -45" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="27.5" r="5" fill="#fff" />
                        <circle cx="50" cy="72.5" r="5" fill="currentColor" />
                    </svg>
                </div>
            )}
            <p className="font-title text-primary tracking-widest animate-breath">{text}</p>
        </div>
    );
};
