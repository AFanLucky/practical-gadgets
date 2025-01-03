/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * 合成带镂空区域的图片和二维码
 * @param options 合成配置项
 * @returns Promise<string> 返回base64格式的图片数据
 */
function composeImageWithQRCode(options) {
    return __awaiter(this, void 0, void 0, function () {
        var background, qrcode, _a, format, _b, quality, _c, backgroundImg, qrcodeImg, canvas, ctx, imageData, hollowAreas, area;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    background = options.background, qrcode = options.qrcode, _a = options.format, format = _a === void 0 ? "image/png" : _a, _b = options.quality, quality = _b === void 0 ? 0.8 : _b;
                    return [4 /*yield*/, Promise.all([
                            loadImage(background),
                            loadImage(qrcode),
                        ])];
                case 1:
                    _c = _d.sent(), backgroundImg = _c[0], qrcodeImg = _c[1];
                    canvas = document.createElement("canvas");
                    canvas.width = backgroundImg.width;
                    canvas.height = backgroundImg.height;
                    ctx = canvas.getContext("2d");
                    if (!ctx) {
                        throw new Error("无法创建canvas上下文");
                    }
                    // 绘制背景图
                    ctx.drawImage(backgroundImg, 0, 0);
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    return [4 /*yield*/, detectHollowAreas(imageData)];
                case 2:
                    hollowAreas = _d.sent();
                    if (hollowAreas.length === 0) {
                        throw new Error("未检测到镂空区域");
                    }
                    area = hollowAreas[0];
                    // 直接绘制二维码，确保完全填充镂空区域
                    ctx.drawImage(qrcodeImg, area.x, area.y, area.width, area.height);
                    // 返回base64格式的图片数据
                    return [2 /*return*/, canvas.toDataURL(format, quality)];
            }
        });
    });
}
/**
 * 加载图片
 */
function loadImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () { return resolve(img); };
        img.onerror = function () { return reject(new Error("\u52A0\u8F7D\u56FE\u7247\u5931\u8D25: ".concat(url))); };
        img.src = url;
    });
}
/**
 * 检测图片中的镂空区域
 */
function detectHollowAreas(imageData) {
    var data = imageData.data, width = imageData.width, height = imageData.height;
    var hollowAreas = [];
    var visited = new Set();
    // 遍历像素查找透明区域
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var key = "".concat(x, ",").concat(y);
            if (visited.has(key))
                continue;
            var idx = (y * width + x) * 4;
            var alpha = data[idx + 3];
            if (alpha < 10) {
                // 使用洪水填充算法检测连续的透明区域
                var area = floodFillDetect(data, width, height, x, y, visited);
                if (area && isValidArea(area)) {
                    hollowAreas.push(area);
                }
            }
            visited.add(key);
        }
    }
    // 如果找到多个区域，选择面积最大的
    if (hollowAreas.length > 1) {
        hollowAreas.sort(function (a, b) { return b.width * b.height - a.width * a.height; });
        return Promise.resolve([hollowAreas[0]]);
    }
    return Promise.resolve(hollowAreas);
}
function floodFillDetect(data, width, height, startX, startY, visited) {
    var minX = startX;
    var maxX = startX;
    var minY = startY;
    var maxY = startY;
    var queue = [[startX, startY]];
    while (queue.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var _a = queue.shift(), x = _a[0], y = _a[1];
        var key = "".concat(x, ",").concat(y);
        if (visited.has(key))
            continue;
        visited.add(key);
        var idx = (y * width + x) * 4;
        if (data[idx + 3] >= 10)
            continue;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        // 检查四个方向
        var directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _b = directions_1[_i], dx = _b[0], dy = _b[1];
            var newX = x + dx;
            var newY = y + dy;
            if (newX >= 0 &&
                newX < width &&
                newY >= 0 &&
                newY < height &&
                !visited.has("".concat(newX, ",").concat(newY))) {
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
function isValidArea(area) {
    // 过滤条件：
    // 1. 区域不能太小
    // 2. 区域不能太大（比如不能超过图片的1/3）
    // 3. 宽高比应该接近1（因为二维码通常是正方形）
    var minSize = 50; // 最小尺寸
    var ratio = area.width / area.height;
    return (area.width >= minSize &&
        area.height >= minSize &&
        ratio >= 0.8 &&
        ratio <= 1.2);
}

export { composeImageWithQRCode };
//# sourceMappingURL=index.esm.js.map
