import axios from 'axios';
import { withRetry } from './retry';

// DeepSeek API 客户端（仅服务端使用）
const deepseekClient = axios.create({
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    timeout: 90000, // DeepSeek 推理较深，给足超时时间
    headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
    },
});

/**
 * DeepSeek Chat 通用调用
 * 适用于：姓名测算、合婚配对、塔罗解读等需要深度中文文化理解的场景
 */
export const deepseekChat = async (prompt: string, systemPrompt?: string) => {
    return withRetry(async () => {
        const messages: Array<{ role: string; content: string }> = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        messages.push({ role: 'user', content: prompt });

        const res = await deepseekClient.post('/v1/chat/completions', {
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 3000,
        });
        return res.data;
    });
};

/**
 * 从 AI 返回内容中提取 JSON
 * 兼容包含 markdown 代码块、思考过程、多余文本等各种返回格式
 */
export function extractJson(content: string): string {
    // 先尝试去除 markdown 代码块
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        content = codeBlockMatch[1].trim();
    }

    // 提取第一个完整的 JSON 对象（支持嵌套花括号）
    const startIdx = content.indexOf('{');
    if (startIdx === -1) return content;

    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') {
            depth--;
            if (depth === 0) {
                endIdx = i;
                break;
            }
        }
    }

    if (endIdx !== -1) {
        return content.substring(startIdx, endIdx + 1);
    }

    // 回退方案：使用 lastIndexOf
    const fallbackEnd = content.lastIndexOf('}');
    if (startIdx !== -1 && fallbackEnd !== -1) {
        return content.substring(startIdx, fallbackEnd + 1);
    }

    return content;
}
