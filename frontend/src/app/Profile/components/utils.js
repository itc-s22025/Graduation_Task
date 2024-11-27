/**
 * 画像を読み込む関数
 * @param {string} src - 画像のURL
 * @returns {Promise<HTMLImageElement>} 読み込まれた画像要素
 */
export const createImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.crossOrigin = 'anonymous'; // クロスオリジンエラーを防ぐため
        img.src = src;
    });

/**
 * クロップ領域をピクセル単位で取得する関数
 * @param {object} crop - クロップ情報
 * @param {HTMLImageElement} image - 対象画像
 * @returns {object} クロップ領域のピクセル情報
 */
export const getCroppedAreaPixels = (image, crop) => {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const x = crop.x * scaleX;
    const y = crop.y * scaleY;
    const width = crop.width * scaleX;
    const height = crop.height * scaleY;

    return { x, y, width, height };
};
