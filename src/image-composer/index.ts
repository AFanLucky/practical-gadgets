// 扩展 CanvasRenderingContext2D 类型定义
declare global {
  interface CanvasRenderingContext2D {
    roundRect?: (
      x: number,
      y: number,
      width: number,
      height: number,
      radii: number | DOMPointInit | (number | DOMPointInit)[]
    ) => void;
  }
}

/**
 * 图片合成器配置项
 */
export interface ImageComposerOptions {
  background: string; // 背景图片URL
  qrcode: string; // 二维码图片URL
  format?: "image/jpeg" | "image/png"; // 输出图片格式
  quality?: number; // 输出图片质量(0-1)
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
export async function composeImageWithQRCode(
  options: ImageComposerOptions
): Promise<string> {
  const { background, qrcode, format = "image/png", quality = 0.8 } = options;

  // 加载图片
  const [backgroundImg, qrcodeImg] = await Promise.all([
    loadImage(background),
    loadImage(qrcode),
  ]);

  // 创建画布
  const canvas = document.createElement("canvas");
  canvas.width = backgroundImg.width;
  canvas.height = backgroundImg.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("无法创建canvas上下文");
  }

  // 绘制背景图
  ctx.drawImage(backgroundImg, 0, 0);

  // 获取图片数据以检测镂空区域
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const hollowAreas = await detectHollowAreas(imageData);

  if (hollowAreas.length === 0) {
    throw new Error("未检测到镂空区域");
  }

  // 在镂空区域绘制二维码
  const area = hollowAreas[0];

  // 直接绘制二维码，确保完全填充镂空区域
  ctx.drawImage(qrcodeImg, area.x, area.y, area.width, area.height);

  // 返回base64格式的图片数据
  return canvas.toDataURL(format, quality);
}

/**
 * 加载图片
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`加载图片失败: ${url}`));
    img.src = url;
  });
}

/**
 * 检测图片中的镂空区域
 */
function detectHollowAreas(imageData: ImageData): Promise<HollowArea[]> {
  const { data, width, height } = imageData;
  const hollowAreas: HollowArea[] = [];
  const visited = new Set<string>();

  // 遍历像素查找透明区域
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      if (visited.has(key)) continue;

      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];

      if (alpha < 10) {
        // 使用洪水填充算法检测连续的透明区域
        const area = floodFillDetect(data, width, height, x, y, visited);
        if (area && isValidArea(area)) {
          hollowAreas.push(area);
        }
      }
      visited.add(key);
    }
  }

  // 如果找到多个区域，选择面积最大的
  if (hollowAreas.length > 1) {
    hollowAreas.sort((a, b) => b.width * b.height - a.width * a.height);
    return Promise.resolve([hollowAreas[0]]);
  }

  return Promise.resolve(hollowAreas);
}

function floodFillDetect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Set<string>
): HollowArea | null {
  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;

  const queue: [number, number][] = [[startX, startY]];

  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const idx = (y * width + x) * 4;
    if (data[idx + 3] >= 10) continue;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    // 检查四个方向
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newX < width &&
        newY >= 0 &&
        newY < height &&
        !visited.has(`${newX},${newY}`)
      ) {
        queue.push([newX, newY]);
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function isValidArea(area: HollowArea): boolean {
  // 过滤条件：
  // 1. 区域不能太小
  // 2. 区域不能太大（比如不能超过图片的1/3）
  // 3. 宽高比应该接近1（因为二维码通常是正方形）
  const minSize = 50; // 最小尺寸
  const ratio = area.width / area.height;

  return (
    area.width >= minSize &&
    area.height >= minSize &&
    ratio >= 0.8 &&
    ratio <= 1.2
  );
}
