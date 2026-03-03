import { NextResponse } from 'next/server';
import { qwenVlPlus } from '@/lib/api/siliconFlow';
import { extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// 允许最高 60s 的 Serverless 延时
export const maxDuration = 60;

export async function POST(req: Request) {
    const ip = getClientIp(req);
    if (!globalRateLimiter.check(ip)) {
        return NextResponse.json({ error: '窥视天书需耗费海量真元，频率过高请少息片刻' }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: '机缘未至，请上传手掌照片' }, { status: 400 });
        }

        if (!image.startsWith('data:image')) {
            return NextResponse.json({ error: '无效格式。烦请上传正确的图像残片' }, { status: 400 });
        }

        const result = await qwenVlPlus(image);

        const jsonStr = extractJson(result.choices[0].message.content);
        let parsedData;
        try {
            parsedData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("解析硅基流动响应 JSON 失败:", jsonStr);
            throw new Error("模型灵光暂息，无法参透命盘");
        }

        if (parsedData.status === 'error') {
            return NextResponse.json({ error: parsedData.message || '手相模糊难辨，天机隐没，请重新清晰拍摄' }, { status: 400 });
        }

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error('Palm API Error:', error?.message || error);
        return NextResponse.json(
            { error: error.message || '灵视推演受阻，请检查网络或稍后再试' },
            { status: 500 }
        );
    }
}
