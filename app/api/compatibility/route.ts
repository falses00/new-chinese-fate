import { NextResponse } from 'next/server';
import { deepseekChat, extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// 合婚配对 API（使用 DeepSeek，需要复杂推理能力）
export async function POST(req: Request) {
    const ip = getClientIp(req);
    if (!globalRateLimiter.check(ip)) {
        return NextResponse.json({ error: '缘分天定不可急，请稍后再行合婚' }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { male, female } = body;

        if (!male?.name || !male?.date || !male?.time || !female?.name || !female?.date || !female?.time) {
            return NextResponse.json({ error: '请填写双方完整的出生信息' }, { status: 400 });
        }

        const systemPrompt = `你是精通合婚命理的大师，擅长根据双方生辰八字进行配对分析。所有结论正向引导，即使不太匹配也要给出积极的改善建议，禁用"克妻""克夫""不合"等负面表述。`;

        const prompt = `
请对以下两人进行合婚配对分析：

男方：
  姓名：${male.name}
  出生日期：${male.date}
  出生时辰：${male.time}

女方：
  姓名：${female.name}
  出生日期：${female.date}
  出生时辰：${female.time}

请直接返回JSON格式，不要包含代码块标记或其他多余文字：
{
  "status": "success",
  "data": {
    "overall_score": 88,
    "dimensions": {
      "character": { "score": 85, "label": "性格契合", "analysis": "性格匹配分析（60字）" },
      "emotion": { "score": 90, "label": "情感共鸣", "analysis": "情感匹配分析（60字）" },
      "career": { "score": 80, "label": "事业互助", "analysis": "事业互助分析（60字）" },
      "wealth": { "score": 82, "label": "财运互补", "analysis": "财运互补分析（60字）" },
      "family": { "score": 88, "label": "家庭和睦", "analysis": "家庭和谐程度分析（60字）" },
      "health": { "score": 86, "label": "健康守护", "analysis": "健康方面互相影响分析（60字）" }
    },
    "male_bazi": "男方八字简述",
    "female_bazi": "女方八字简述",
    "wuxing_match": "双方五行互补分析（80字）",
    "summary": "合婚总评（150字，正向积极，给出有建设性的意见）",
    "suggestions": ["相处建议1（30字）", "相处建议2（30字）", "相处建议3（30字）"],
    "lucky": {
      "wedding_direction": "适宜婚礼方位",
      "wedding_season": "适宜婚期时节",
      "lucky_color": "双方幸运色"
    }
  }
}

注意：所有分数为0-100整数。内容保持正向积极的态度。
`;

        const result = await deepseekChat(prompt, systemPrompt);

        const jsonStr = extractJson(result.choices[0].message.content);
        const parsedData = JSON.parse(jsonStr);
        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error('Compatibility API Error:', error);
        return NextResponse.json(
            { error: '姻缘天机推演受阻，请稍后再试' },
            { status: 500 }
        );
    }
}
