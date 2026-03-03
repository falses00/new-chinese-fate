import React from 'react';

interface ProgressProps {
    percentage: number; // 0 到 100
}

export const Progress: React.FC<ProgressProps> = ({ percentage }) => {
    const safePercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <div className="w-full h-1 bg-card rounded-sm overflow-hidden">
            <div
                className="h-full bg-secondary transition-all duration-500 ease-out"
                style={{ width: `${safePercentage}%` }}
            />
        </div>
    );
};
