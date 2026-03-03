import { NextResponse } from 'next/server';
import { deepseekChat, extractJson } from '@/lib/api/deepseek';
import { globalRateLimiter, getClientIp } from '@/lib/api/rateLimit';

// Vercel Serverless 函数最大执行时间（秒）
export const maxDuration = 60;

// 塔罗牌 22 张大阿尔卡那牌名
const MAJOR_ARCANA = [
    '愚者', '魔术师', '女祭司', '女皇', '皇帝',
    '教皇', '恋人', '战车', '力量', '隐者',
    '命运之轮', '正义', '倒吊人', '死神', '节制',
    '恶魔', '塔', '星星', '月亮', '太阳',
    '审判', '世界'
];

// 塔罗牌占卜 API（使用 DeepSeek，需要创意解读能力）
export async function POST(req: Request) {
    const ip = getClientIp(req);
    if (!globalRateLimiter.check(ip)) {
        return NextResponse.json({ error: '塔罗之灵需要休息，请稍后再来问卦' }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { question, spreadType } = body;

        if (!question) {
            return NextResponse.json({ error: '请先提出你的问题' }, { status: 400 });
        }

        // 随机抽取塔罗牌
        const cardCount = spreadType === 'three' ? 3 : 1;
        const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
        const drawnCards = shuffled.slice(0, cardCount).map(name => ({
            name,
            reversed: Math.random() > 0.5, // 50% 概率逆位
        }));

        const cardDescriptions = drawnCards.map((card, i) => {
            const posLabels = cardCount === 3 ? ['过去', '现在', '未来'] : ['指引'];
            return `第${i + 1}张（${posLabels[i]}）：${card.name}（${card.reversed ? '逆位' : '正位'}）`;
        }).join('\n');

        const systemPrompt = `你是资深塔罗牌解读师，擅长将牌面含义与提问者的具体问题结合，给出深刻且有建设性的解读。所有解读正向引导，即使是负面牌义也要给出积极的转化建议。`;

        const prompt = `
提问者的问题：${question}
抽牌方式：${spreadType === 'three' ? '时间之流（过去-现在-未来）' : '单牌指引'}

抽到的牌：
${cardDescriptions}

请直接返回JSON格式，不要包含代码块标记或其他多余文字：
{
  "status": "success",
  "data": {
    "question": "${question}",
    "spread_type": "${spreadType === 'three' ? '时间之流' : '单牌指引'}",
    "cards": [
      ${drawnCards.map((card, i) => {
            const posLabels = cardCount === 3 ? ['过去', '现在', '未来'] : ['指引'];
            return `{
        "name": "${card.name}",
        "reversed": ${card.reversed},
        "position": "${posLabels[i]}",
        "keywords": ["关键词1", "关键词2", "关键词3"],
        "interpretation": "结合问题的牌面解读（80字，有深度）"
      }`;
        }).join(',\n      ')}
    ],
    "overall": "综合解读，将所有牌面串联起来给出有洞见的分析（150字）",
    "advice": "对提问者的具体行动建议（80字，积极正向）",
    "affirmation": "一句鼓励性的肯定语（20字以内）"
  }
}
`;

        const result = await deepseekChat(prompt, systemPrompt);

        const jsonStr = extractJson(result.choices[0].message.content);
        const parsedData = JSON.parse(jsonStr);
        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error('Tarot API Error:', error);
        return NextResponse.json(
            { error: '塔罗之灵暂未回应，请稍后再试' },
            { status: 500 }
        );
    }
}
