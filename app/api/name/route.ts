import { NextResponse } from 'next/server';
import { deepseekChat, extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// 姓名测算 API（使用 DeepSeek，需要深度中文文化理解）
export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!globalRateLimiter.check(ip)) {
    return NextResponse.json({ error: '天机不可多泄，请稍后再行叩问' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { surname, givenName, gender } = body;

    if (!surname || !givenName) {
      return NextResponse.json({ error: '请输入完整的姓名' }, { status: 400 });
    }

    const fullName = surname + givenName;

    const systemPrompt = `你是精通姓名学、五格剖象法、字义解析的命名大师。分析时要结合汉字的五行属性、笔画数理、音韵声调、字义内涵进行综合判断。所有结论正向引导，用中性或积极的表述。请直接返回JSON格式，不要包含代码块标记或其他多余文字。`;

    const prompt = `
请对以下姓名进行全面解析：
姓名：${fullName}（姓氏：${surname}，名字：${givenName}）
性别：${gender || '未知'}

请直接返回以下JSON格式结果：
{
  "status": "success",
  "data": {
    "name": "${fullName}",
    "total_score": 88,
    "strokes": {
      "surname": { "char": "${surname}", "strokes": 8, "wuxing": "五行属性" },
      "given": [
        { "char": "第一个字", "strokes": 10, "wuxing": "五行属性" }
      ]
    },
    "wuge": {
      "tiange": { "value": 9, "luck": "吉", "meaning": "天格解析" },
      "renge": { "value": 18, "luck": "半吉", "meaning": "人格解析" },
      "dige": { "value": 20, "luck": "吉", "meaning": "地格解析" },
      "waige": { "value": 11, "luck": "吉", "meaning": "外格解析" },
      "zongge": { "value": 28, "luck": "吉", "meaning": "总格解析" }
    },
    "character_analysis": "字义深度解析（100字，分析每个字的含义、意境）",
    "sound_analysis": "音韵分析（50字，声调搭配是否和谐悦耳）",
    "personality": "此名暗示的性格特质（80字）",
    "career": "事业发展暗示（60字）",
    "relationship": "人际情感暗示（60字）",
    "summary": "综合评语（100字正向总结）",
    "suggestions": ["改善建议1", "改善建议2", "改善建议3"]
  }
}

注意：笔画数请按康熙字典笔画计算。总分0-100整数。所有内容正向积极。给名字中每个字分别列出笔画和五行。
`;

    const result = await deepseekChat(prompt, systemPrompt);

    const jsonStr = extractJson(result.choices[0].message.content);
    const parsedData = JSON.parse(jsonStr);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Name Analysis API Error:', error?.message || error);
    return NextResponse.json(
      { error: '姓名天机推演受阻，请稍后再试' },
      { status: 500 }
    );
  }
}
