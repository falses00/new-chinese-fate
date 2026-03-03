import { NextResponse } from 'next/server';
import { qwen14bChat } from '@/lib/api/siliconFlow';
import { extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// Vercel Serverless 函数最大执行时间（秒）
export const maxDuration = 60;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!globalRateLimiter.check(ip)) {
    return NextResponse.json({ error: '天机不可多泄，请稍后再行叩问（频繁请求）' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, gender, calendarType, date, time } = body;

    if (!name || !gender || !calendarType || !date || !time) {
      return NextResponse.json({ error: '请填写完整的所有必填信息' }, { status: 400 });
    }

    const baziPrompt = `
你是精通子平八字的命理大师。请根据以下信息进行生辰八字排盘与解析。
姓名：${name}
性别：${gender}
历法：${calendarType}
出生日期：${date}
出生时辰：${time}

请直接返回JSON格式结果，无任何多余文字、Markdown、注释，严格遵循以下结构：
{
  "status": "success",
  "data": {
    "bazi": ["天干地支1", "天干地支2", "天干地支3", "天干地支4"],
    "wuxing": "五行分布描述，如：金2 木1 水2 火0 土3",
    "analysis": {
      "character": "性格解析（正向）",
      "career": "事业财运解析（正向）",
      "marriage": "婚姻感情解析（正向）"
    },
    "suggestion": "整体改善建议（100字左右）"
  }
}
`;

    const result = await qwen14bChat(baziPrompt);
    const jsonStr = extractJson(result.choices[0].message.content);
    const parsedData = JSON.parse(jsonStr);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Bazi API Error:', error?.message || error);
    return NextResponse.json(
      { error: '算命天机推演失败，请稍后再试' },
      { status: 500 }
    );
  }
}
