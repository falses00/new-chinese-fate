/**
 * 压缩图片至指定大小并转为 Base64 (Data URL)
 * @param file 原始图片 File 对象
 * @param maxSizeMB 最大兆字节（默认 2MB）
 * @param quality 压缩质量（0~1，默认 0.8）
 */
export const compressImage = (file: File, maxSizeMB = 2, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 按比例缩放，防止宽高过大导致图片无法处理
                const maxDim = 1200;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height *= maxDim / width;
                        width = maxDim;
                    } else {
                        width *= maxDim / height;
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context not available'));

                // 绘制图片
                ctx.drawImage(img, 0, 0, width, height);

                // 提取 Base64 Data URL
                const dataUrl = canvas.toDataURL('image/jpeg', quality);

                // 检查大小并进一步压缩
                const currentSizeMB = Math.round((dataUrl.length * 3) / 4) / (1024 * 1024);
                if (currentSizeMB > maxSizeMB) {
                    resolve(canvas.toDataURL('image/jpeg', Math.max(0.1, quality - 0.2)));
                } else {
                    resolve(dataUrl);
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
