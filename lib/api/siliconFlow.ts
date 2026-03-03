import axios from 'axios';
import { withRetry } from './retry';
import { extractJson } from './deepseek';

// 只在服务端使用，安全隔离
const apiClient = axios.create({
  baseURL: process.env.SILICON_FLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
  timeout: 60000, // AI 推理需要较长时间
  headers: {
    'Authorization': `Bearer ${process.env.SILICON_FLOW_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const PALM_ANALYSIS_PROMPT = `
你是拥有20年经验的资深手相大师，精通麻衣神相，仅基于手掌图片解析，不编造信息。
解析规则：
1. 仅返回JSON格式，无任何多余文字、Markdown、注释；
2. 正向引导，禁用「血光之灾、破财、克妻、短命」等负面词汇，用中性/正向表述替代；
3. 必须包含感情线、智慧线、生命线、事业线、财运线5个维度；
4. 图片模糊/无效时，返回对应错误状态，不强行解析。

必须严格遵循以下JSON格式：
{
  "status": "success" | "error",
  "message": "成功/错误提示",
  "data": {
    "palm_quality": "清晰" | "模糊" | "无效",
    "lines": {
      "emotion": {"feature": "纹路特征描述", "analysis": "正向解析"},
      "wisdom": {"feature": "纹路特征描述", "analysis": "正向解析"},
      "life": {"feature": "纹路特征描述", "analysis": "正向解析"},
      "career": {"feature": "纹路特征描述", "analysis": "正向解析"},
      "wealth": {"feature": "纹路特征描述", "analysis": "正向解析"}
    },
    "summary": "100字左右整体正向总结",
    "suggestion": ["建议1（30字）", "建议2（30字）", "建议3（30字）"]
  }
}
`;

export const qwen14bChat = async (prompt: string) => {
  return withRetry(async () => {
    const res = await apiClient.post('/chat/completions', {
      model: 'Qwen/Qwen2.5-14B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });
    return res.data;
  });
};

export const qwenVlPlus = async (base64Image: string, systemPrompt: string = PALM_ANALYSIS_PROMPT) => {
  return withRetry(async () => {
    const base64Url = base64Image.startsWith('data:image') ? base64Image : `data:image/jpeg;base64,${base64Image}`;

    const res = await apiClient.post('/chat/completions', {
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
      max_tokens: 1500,
    });
    return res.data;
  });
};

// 重导出 extractJson，方便其他路由直接从 siliconFlow 引入
export { extractJson };
