import { PalmUpload } from '@/components/features/PalmUpload';
import { Card } from '@/components/ui/Card';
import { Hand } from 'lucide-react';
import Link from 'next/link';

export default function PalmPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative">
            <Link href="/" className="absolute top-8 left-4 md:left-8 text-primary hover:underline tracking-wide">
                &larr; 归返山道
            </Link>
            <div className="w-full max-w-2xl animate-fade-in-up">
                <div className="flex flex-col items-center text-center mb-8">
                    <Hand className="w-12 h-12 text-primary mb-4" />
                    <h1 className="text-4xl md:text-5xl font-title text-primary mb-2">掌纹天机灵析</h1>
                    <p className="text-[#666666] tracking-widest mt-2">玄宗秘术，慧眼阅尽掌中万象</p>
                </div>
                <Card className="p-8">
                    <PalmUpload />
                </Card>
            </div>
        </div>
    );
}
