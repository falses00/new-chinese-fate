/**
 * 通用重试机制（指数退避）
 * @param fn - 要重试的异步函数
 * @param retries - 最大重试次数
 * @param baseDelay - 基础延迟（毫秒），每次翻倍
 */
export const withRetry = async <T>(fn: () => Promise<T>, retries = 3, baseDelay = 1500): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        const delay = baseDelay * Math.pow(2, 3 - retries); // 指数退避：1.5s → 3s → 6s
        await new Promise(resolve => setTimeout(resolve, delay));
        console.warn(`请求失败，${delay}ms 后重试... 剩余 ${retries} 次`);
        return withRetry(fn, retries - 1, baseDelay);
    }
};
