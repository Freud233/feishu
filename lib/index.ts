const hexToRgbInt32 = (hex: string) => {
  // 去掉前导的 '#'
  hex = hex.slice(1);

  // 解析 RGB 分量
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // 组合成一个 32 位的整数（在 JavaScript 中是 Number 类型）
  // 注意：这里我们实际上只使用了低 24 位，因为 RGB 只有 24 位
  const rgbInt32 = (r << 16) | (g << 8) | b;

  return rgbInt32;
};
export { hexToRgbInt32 };

