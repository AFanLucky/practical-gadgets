# Practical Gadgets 🛠️
> 一个实用的工具库，为日常开发提供便捷解决方案

## ✨ 功能特性

- 🖼️ **图片合成** - 支持将背景图片与二维码图片智能合成
- 🔍 **自动检测** - 智能识别背景图片中的透明区域
- ⚙️ **高度可配置** - 支持自定义输出格式和质量参数

## 📦 安装

bash
npm install practical-gadgets
或
yarn add practical-gadgets

## 🚀 快速开始

javascript
import { composeImageWithQRCode } from 'practical-gadgets';
// 合成图片
composeImageWithQRCode({
background: '镂空图片地址',
qrcode: '二维码地址',
})
.then(result => {
console.log('合成成功：', result);
})
.catch(error => {
console.error('合成失败：', error);
});

## 📖 API 文档

### composeImageWithQRCode(options)

合成图片与二维码。

#### 参数

| 参数名     | 类型   | 必填 | 描述                              |
| ---------- | ------ | ---- | --------------------------------- |
| background | string | 是   | 背景图片地址                      |
| qrcode     | string | 是   | 二维码图片地址                    |
| quality    | number | 否   | 输出图片质量(0-1)，默认0.8        |
| format     | string | 否   | 输出格式('png'/'jpeg')，默认'png' |