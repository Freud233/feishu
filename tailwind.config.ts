import type { Config } from 'tailwindcss';

/**
 * Material Design 3 色彩角色。
 * 具体色值统一在 app/globals.css 中定义（亮/暗两套），
 * 这里只做 token 映射，避免色值在两处维护。
 */
const mdColors = {
  primary: 'var(--md-primary)',
  'on-primary': 'var(--md-on-primary)',
  'primary-container': 'var(--md-primary-container)',
  'on-primary-container': 'var(--md-on-primary-container)',
  secondary: 'var(--md-secondary)',
  'on-secondary': 'var(--md-on-secondary)',
  'secondary-container': 'var(--md-secondary-container)',
  'on-secondary-container': 'var(--md-on-secondary-container)',
  tertiary: 'var(--md-tertiary)',
  'on-tertiary': 'var(--md-on-tertiary)',
  'tertiary-container': 'var(--md-tertiary-container)',
  'on-tertiary-container': 'var(--md-on-tertiary-container)',
  error: 'var(--md-error)',
  'on-error': 'var(--md-on-error)',
  'error-container': 'var(--md-error-container)',
  'on-error-container': 'var(--md-on-error-container)',
  surface: 'var(--md-surface)',
  'surface-dim': 'var(--md-surface-dim)',
  'surface-bright': 'var(--md-surface-bright)',
  'surface-container-lowest': 'var(--md-surface-container-lowest)',
  'surface-container-low': 'var(--md-surface-container-low)',
  'surface-container': 'var(--md-surface-container)',
  'surface-container-high': 'var(--md-surface-container-high)',
  'surface-container-highest': 'var(--md-surface-container-highest)',
  'on-surface': 'var(--md-on-surface)',
  'on-surface-variant': 'var(--md-on-surface-variant)',
  outline: 'var(--md-outline)',
  'outline-variant': 'var(--md-outline-variant)',
  'inverse-surface': 'var(--md-inverse-surface)',
  'inverse-on-surface': 'var(--md-inverse-on-surface)',
  'inverse-primary': 'var(--md-inverse-primary)',
};

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        md: mdColors,
        // 保留旧色板，避免外部引用失效
        jade: {
          '50': '#effef7',
          '100': '#dafeef',
          '200': '#b8fadd',
          '300': '#81f4c3',
          '400': '#43e5a0',
          '500': '#1acd81',
          '600': '#0fa968',
          '700': '#108554',
          '800': '#126945',
          '900': '#11563a',
          '950': '#03301f',
        },
      },
      borderRadius: {
        'md-xs': '4px',
        'md-s': '8px',
        'md-m': '12px',
        'md-l': '16px',
        'md-xl': '28px',
        'md-full': '9999px',
      },
      boxShadow: {
        'md-1': 'var(--md-elevation-1)',
        'md-2': 'var(--md-elevation-2)',
        'md-3': 'var(--md-elevation-3)',
      },
      fontFamily: {
        md: [
          'Roboto',
          'Noto Sans SC',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  darkMode: 'class',
} satisfies Config;
