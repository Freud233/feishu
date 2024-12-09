import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
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
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config;
