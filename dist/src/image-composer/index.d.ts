declare global {
    interface CanvasRenderingContext2D {
        roundRect?: (x: number, y: number, width: number, height: number, radii: number | DOMPointInit | (number | DOMPointInit)[]) => void;
    }
}
/**
 * 图片合成器配置项
 */
export interface ImageComposerOptions {
    background: string;
    qrcode: string;
    format?: "image/jpeg" | "image/png";
    quality?: number;
}
export interface HollowArea {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * 合成带镂空区域的图片和二维码
 * @param options 合成配置项
 * @returns Promise<string> 返回base64格式的图片数据
 */
export declare function composeImageWithQRCode(options: ImageComposerOptions): Promise<string>;
