/**
 * 把 #RRGGBB / RRGGBB / #RGB 转成飞书日历使用的 RGB 整数。
 * 非法或缺失输入统一返回 0，避免脏数据导致页面崩溃。
 */
const hexToRgbInt32 = (hex?: string | null): number => {
  if (!hex) return 0;

  const raw = hex.trim().replace(/^#/, '');
  const normalized =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return 0;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return (r << 16) | (g << 8) | b;
};

/**
 * tokenExpiredAt 统一使用「毫秒时间戳」（与登录 / 刷新时写入的值一致）。
 * 集中判断，避免各处混用秒级 dayjs().unix() 导致过期判断失效。
 */
const hasTokenExpired = (tokenExpiredAt: number): boolean =>
  !tokenExpiredAt || Date.now() >= tokenExpiredAt;

export { hasTokenExpired, hexToRgbInt32 };
