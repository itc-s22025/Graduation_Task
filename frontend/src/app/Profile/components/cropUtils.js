import { createImage, getCroppedAreaPixels } from './utils'; // 必要なユーティリティ関数をインポート

/**
 * クロップされた画像を生成する関数
 * @param {string} imageSrc - クロップ元画像のURL
 * @param {object} crop - クロップ座標
 * @returns {Promise<string>} クロップされた画像のURL
 */
export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return reject(new Error('Canvas is empty'));
                    }
                    const croppedUrl = URL.createObjectURL(blob);
                    resolve(croppedUrl);
                },
                'image/jpeg',
                1
            );
        });
    } catch (e) {
        console.error('Failed to crop image', e);
        throw e;
    }
};
