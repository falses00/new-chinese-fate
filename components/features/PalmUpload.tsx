"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '@/components/ui/Button';
import { compressImage } from '@/lib/utils/image';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { Loading } from '@/components/ui/Loading';

export const PalmUpload = () => {
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const cropperRef = useRef<ReactCropperElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setErrorMsg('');
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const getCropData = async () => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            const cropper = cropperRef.current.cropper;
            // 将裁剪内容重新转为 base64, 并利用之前封装的 Canvas 方法进行压缩以满足 <=2MB
            const base64Crop = cropper.getCroppedCanvas().toDataURL('image/jpeg');

            // 我们也可以不将它转换为 File 重新 compress，直接因为 getCroppedCanvas(options) 已经可以限定长宽度
            // 但为了满足 "确保 <=2MB"，我们可以将其转成 base64 验证，超过再压。此处给简便安全使用 getCroppedCanvas()：
            const compressedDataUrl = cropper.getCroppedCanvas({
                maxWidth: 1024,
                maxHeight: 1024,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            }).toDataURL('image/jpeg', 0.8);

            await uploadAndAnalyze(compressedDataUrl);
        }
    };

    const uploadAndAnalyze = async (base64Data: string) => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('/api/palm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data })
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || '上传解析失败');

            localStorage.setItem('latest_palm_result', JSON.stringify({
                result: data.data || data
            }));
            router.push('/palm/result');
        } catch (err: any) {
            setErrorMsg(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="八卦阵倒转，灵析运线中..." type="bagua" />;
    }

    return (
        <div className="w-full">
            {!imageSrc ? (
                <div
                    className="w-full h-64 border-2 border-dashed border-primary rounded-sm flex flex-col items-center justify-center bg-[#F5F5F5]/50 hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileUpload')?.click()}
                >
                    <UploadCloud className="w-12 h-12 text-primary mb-4" />
                    <p className="font-body text-[#666666] tracking-widest text-center">
                        点击或拖拽手掌正面照片至此
                        <br />
                        <span className="text-sm opacity-80 mt-2 inline-block">请保证掌纹清晰、光线明亮</span>
                    </p>
                    <input
                        id="fileUpload"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <p className="text-center font-bold text-[#666666]">请拖拽截取想要解析的掌纹核心区域</p>
                    <Cropper
                        ref={cropperRef}
                        src={imageSrc}
                        style={{ height: 400, width: "100%" }}
                        aspectRatio={NaN}
                        guides={true}
                        viewMode={1}
                        dragMode="move"
                        background={false}
                        autoCropArea={0.8}
                        className="rounded-sm overflow-hidden border border-[#E8C490]"
                    />
                    <div className="flex gap-4">
                        <Button variant="outline" fullWidth onClick={() => setImageSrc(null)}>重新选择</Button>
                        <Button fullWidth onClick={getCropData}>确认截取并解析</Button>
                    </div>
                </div>
            )}
            {errorMsg && <p className="text-accent text-sm text-center font-bold tracking-wide mt-4">{errorMsg}</p>}
        </div>
    );
};
