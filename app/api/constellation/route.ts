import { NextResponse } from 'next/server';
import { qwen14bChat } from '@/lib/api/siliconFlow';
import { extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// Vercel Serverless 函数最大执行时间（秒）
export const maxDuration = 60;

// 综合星座运势 API（合并原 daily + constellation）
export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!globalRateLimiter.check(ip)) {
    return NextResponse.json({ error: '星盘流转受限，请稍候再参悟运势' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { sign, timeSpan } = body;

    if (!sign) {
      return NextResponse.json({ error: '请选择星座' }, { status: 400 });
    }

    const period = timeSpan || '今日';
    const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `
你是兼具东方命理玄学与西方星相学的占星大师。
今天是 ${today}，请基于当前时空能量场，为十二星座中的【${sign}】进行【${period}】运势推演。

请直接返回JSON格式，不要包含任何代码块标记、思考过程或其他多余文字：
{
  "status": "success",
  "data": {
    "sign": "${sign}",
    "period": "${period}",
    "date": "${today}",
    "overall_score": 85,
    "love_score": 80,
    "career_score": 90,
    "wealth_score": 75,
    "health_score": 88,
    "overall": "综合运势解析（80字左右，正向积极）",
    "love": "感情运势（50字，正向解读）",
    "career": "事业学业运势（50字，正向解读）",
    "wealth": "财富运势（50字，正向解读）",
    "health": "健康运势（30字）",
    "lucky_color": "幸运颜色",
    "lucky_number": "幸运数字",
    "lucky_direction": "吉利方位",
    "do_list": ["宜做事项1", "宜做事项2", "宜做事项3"],
    "dont_list": ["忌做事项1", "忌做事项2"],
    "tip": "运势箴言（20字左右，富有哲理）",
    "suggestion": "化解与提升的建议（50字简断）"
  }
}

注意：所有评分为0-100整数。内容正向引导，积极乐观。
`;

    const result = await qwen14bChat(prompt);
    const jsonStr = extractJson(result.choices[0].message.content);
    const parsedData = JSON.parse(jsonStr);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Constellation API Error:', error?.message || error);
    return NextResponse.json(
      { error: '星盘能量接收受阻，请稍后再试' },
      { status: 500 }
    );
  }
}
