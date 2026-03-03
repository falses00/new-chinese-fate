export class RateLimiter {
    private cache = new Map<string, { count: number; resetTime: number }>();
    private limit: number;
    private windowMs: number;

    constructor(limit = 5, windowMs = 60000) {
        this.limit = limit;
        this.windowMs = windowMs;
    }

    check(identifier: string): boolean {
        const now = Date.now();
        const record = this.cache.get(identifier);

        if (!record) {
            this.cache.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return true;
        }

        if (now > record.resetTime) {
            this.cache.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return true;
        }

        if (record.count >= this.limit) {
            return false;
        }

        record.count++;
        return true;
    }
}

// 全局单例：同一 IP 地址 60 秒内上限 5 次大模型路由请求，防止被滥刷盗刷Token
export const globalRateLimiter = new RateLimiter(5, 60000);

export function getClientIp(req: Request) {
    return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous-ip';
}
