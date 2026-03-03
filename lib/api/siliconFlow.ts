import axios from 'axios';
import { withRetry } from './retry';
import { extractJson } from './deepseek';

// 延迟创建客户端，确保 Vercel Serverless 环境变量已注入
function getApiClient() {
  return axios.create({
    baseURL: process.env.SILICON_FLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
    timeout: 55000, // 略低于 Vercel maxDuration 60s，避免函数级超时
    headers: {
      'Authorization': `Bearer ${process.env.SILICON_FLOW_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
}

export const PALM_ANALYSIS_PROMPT = `
你是精通麻衣神相的手相大师，仅基于手掌图片解析。
规则：仅返回JSON，无多余文字；正向引导，禁用负面词汇；必须包含感情线、智慧线、生命线、事业线、财运线5个维度。

JSON格式：
{
  "status": "success",
  "data": {
    "palm_quality": "清晰|模糊|无效",
    "lines": {
      "emotion": {"feature": "特征", "analysis": "解析"},
      "wisdom": {"feature": "特征", "analysis": "解析"},
      "life": {"feature": "特征", "analysis": "解析"},
      "career": {"feature": "特征", "analysis": "解析"},
      "wealth": {"feature": "特征", "analysis": "解析"}
    },
    "summary": "整体总结(80字)",
    "suggestion": ["建议1", "建议2", "建议3"]
  }
}
`;

export const qwen14bChat = async (prompt: string) => {
  return withRetry(async () => {
    const client = getApiClient();
    const res = await client.post('/chat/completions', {
      model: 'Qwen/Qwen2.5-14B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });
    return res.data;
  });
};

export const qwenVlPlus = async (base64Image: string, systemPrompt: string = PALM_ANALYSIS_PROMPT) => {
  return withRetry(async () => {
    const client = getApiClient();
    const base64Url = base64Image.startsWith('data:image') ? base64Image : `data:image/jpeg;base64,${base64Image}`;

    const res = await client.post('/chat/completions', {
      model: 'Qwen/Qwen-VL-Plus',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'image_url', image_url: { url: base64Url } }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });
    return res.data;
  });
};

export { extractJson };
