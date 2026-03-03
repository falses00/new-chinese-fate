import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-sm font-title transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-primary text-white hover:bg-[#A0522D] shadow-md hover:shadow-lg",
            outline: "border border-primary text-primary hover:bg-primary hover:text-white",
            ghost: "text-primary hover:bg-[#F5F5F5]",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base md:text-lg", // 适配移动端高度规范 >= 44px
            lg: "h-14 px-8 text-lg md:text-xl",
        };

        const width = fullWidth ? "w-full" : "";

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
