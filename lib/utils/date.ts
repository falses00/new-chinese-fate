import dayjs from 'dayjs';

/**
 * 格式化日期对象为字符串
 */
export const formatDate = (date: Date | string, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
};

/**
 * 校验是否为未来的日期
 */
export const isFutureDate = (date: Date | string) => {
    return dayjs(date).isAfter(dayjs());
};
