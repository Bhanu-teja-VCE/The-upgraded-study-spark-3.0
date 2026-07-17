import React from 'react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#818CF8]/30 border-t-[#818CF8] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-[#818CF8] rounded-full animate-pulse opacity-50"></div>
                </div>
            </div>
        </div>
    );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-[3px]',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`${sizes[size]} border-[#818CF8]/30 border-t-[#818CF8] rounded-full animate-spin`}></div>
    );
}
