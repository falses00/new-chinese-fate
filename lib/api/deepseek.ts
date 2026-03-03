import axios from 'axios';
import { withRetry } from './retry';

// 延迟创建客户端，确保 Vercel Serverless 环境变量已注入
function getDeepseekClient() {
    return axios.create({
        baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        timeout: 55000, // 略低于 Vercel maxDuration 60s
        headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });
}

/**
 * DeepSeek Chat 通用调用
 */
export const deepseekChat = async (prompt: string, systemPrompt?: string) => {
    return withRetry(async () => {
        const client = getDeepseekClient();
        const messages: Array<{ role: string; content: string }> = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const res = await client.post('/v1/chat/completions', {
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 2000,
        });
        return res.data;
    });
};

/**
 * 从 AI 返回内容中提取 JSON
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

    // 回退方案
    const fallbackEnd = content.lastIndexOf('}');
    if (startIdx !== -1 && fallbackEnd !== -1) {
        return content.substring(startIdx, fallbackEnd + 1);
    }

    return content;
}
