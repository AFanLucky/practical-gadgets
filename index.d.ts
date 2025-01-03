declare module "practical-gadgets" {
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

  export function composeImageWithQRCode(
    options: ImageComposerOptions
  ): Promise<string>;
}
