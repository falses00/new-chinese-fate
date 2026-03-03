import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    animate?: boolean; // 是否启用进场动画
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', animate = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
          bg-card rounded-md border border-transparent 
          transition-all duration-300 ease-out 
          hover:scale-[1.02] hover:shadow-lg hover:shadow-black/15 hover:border-primary/50
          p-6 md:p-8
          ${animate ? 'animate-fade-in-up' : ''}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
