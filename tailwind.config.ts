import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // --- Существующие цвета ---
        customBaseBgColor1: 'hsla(0,100%,50%,1)', // Красный
        customBaseBgColor2: 'rgb(168, 85, 247)',   // Фиолетовый

        // --- Новые цветовые схемы ---
        // 1. Темная холодная схема
        darkCoolBaseBg: 'rgb(30, 41, 59)',       // Темно-серый/синий база
        // 2. Светлая холодная схема
        lightCoolBaseBg: 'rgb(241, 245, 249)',    // Светло-серый база
        // 3. Однотонная холодная схема (синяя)
        monoCoolBaseBg: 'rgb(150, 200, 255)',     // Светло-голубой база
      },
      backgroundImage: {
        // --- Существующие градиенты ---
        'custom-radial-bg-1': [ // Яркий, разноцветный
          'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%)',
          'radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%)',
          'radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
          'radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%)',
          'radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%)',
          'radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%)',
          'radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
        ].join(', '),
        'custom-radial-bg-2': [ // Фиолетовый, контрастный
          'radial-gradient(at 2% 29%, rgb(109, 40, 217) 0, transparent 28%)',
          'radial-gradient(at 83% 18%, rgb(249, 250, 251) 0, transparent 71%)',
          'radial-gradient(at 81% 86%, rgb(241, 245, 249) 0, transparent 20%)',
          'radial-gradient(at 77% 42%, rgb(134, 239, 172) 0, transparent 80%)',
          'radial-gradient(at 13% 91%, rgb(30, 41, 59) 0, transparent 47%)',
          'radial-gradient(at 50% 49%, rgb(39, 39, 42) 0, transparent 87%)',
        ].join(', '),

        // --- Новые градиенты ---
        // 1. Темная холодная схема
        'dark-cool-radial-bg': [
          'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.3) 0px, transparent 50%)', // Синий, темный оттенок
          'radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%)', // Индиго, темный оттенок
          'radial-gradient(at 0% 50%, rgba(79, 70, 229, 0.3) 0px, transparent 50%)', // Фиолетовый, темный оттенок
          'radial-gradient(at 80% 50%, rgba(129, 140, 248, 0.3) 0px, transparent 50%)', // Светло-синий/фиолетовый, темный оттенок
          'radial-gradient(at 0% 100%, rgba(165, 180, 252, 0.3) 0px, transparent 50%)', // Очень светло-синий, темный оттенок
          'radial-gradient(at 80% 100%, rgba(109, 40, 217, 0.3) 0px, transparent 50%)', // Темно-фиолетовый, темный оттенок
          'radial-gradient(at 0% 0%, rgba(147, 197, 253, 0.3) 0px, transparent 50%)', // Светло-голубой, темный оттенок
        ].join(', '),

        // 2. Светлая холодная схема
        'light-cool-radial-bg': [
          'radial-gradient(at 40% 20%, rgba(164, 202, 254, 0.4) 0px, transparent 50%)', // Светло-голубой
          'radial-gradient(at 80% 0%, rgba(187, 247, 208, 0.4) 0px, transparent 50%)', // Светло-зеленый
          'radial-gradient(at 0% 50%, rgba(255, 230, 250, 0.4) 0px, transparent 50%)', // Светло-розовый/лавандовый
          'radial-gradient(at 80% 50%, rgba(203, 255, 222, 0.4) 0px, transparent 50%)', // Светло-зеленый, еще светлее
          'radial-gradient(at 0% 100%, rgba(224, 242, 254, 0.4) 0px, transparent 50%)', // Очень светло-голубой
          'radial-gradient(at 80% 100%, rgba(255, 247, 214, 0.4) 0px, transparent 50%)', // Светло-желтый
          'radial-gradient(at 0% 0%, rgba(232, 232, 232, 0.4) 0px, transparent 50%)', // Светло-серый
        ].join(', '),

        // 3. Однотонная холодная схема (синяя)
        'mono-cool-radial-bg': [
          'radial-gradient(at 40% 20%, rgba(100, 149, 237, 0.3) 0px, transparent 50%)', // Синий CornflowerBlue
          'radial-gradient(at 80% 0%, rgba(135, 206, 250, 0.3) 0px, transparent 50%)', // Светло-голубой LightSkyBlue
          'radial-gradient(at 0% 50%, rgba(173, 216, 230, 0.3) 0px, transparent 50%)', // Светло-голубой PowderBlue
          'radial-gradient(at 80% 50%, rgba(176, 224, 230, 0.3) 0px, transparent 50%)', // Светло-голубой CadetBlue
          'radial-gradient(at 0% 100%, rgba(224, 255, 255, 0.3) 0px, transparent 50%)', // Бирюзовый LightCyan
          'radial-gradient(at 80% 100%, rgba(240, 248, 255, 0.3) 0px, transparent 50%)', // Белый AliceBlue
          'radial-gradient(at 0% 0%, rgba(240, 255, 240, 0.3) 0px, transparent 50%)', // Светло-зеленый PaleGreen
        ].join(', '),
        'mono-cool-radial-bg2': [
          'radial-gradient(at 40% 20%, rgba(255, 5, 5, 0.1) 0px, transparent 50%)', // Синий CornflowerBlue
          'radial-gradient(at 80% 0%, rgba(52, 7, 174, 0.3) 0px, transparent 50%)', // Светло-голубой LightSkyBlue
          'radial-gradient(at 0% 50%, rgba(177, 173, 230, 0.3) 0px, transparent 50%)', // Светло-голубой PowderBlue
          'radial-gradient(at 80% 50%, rgba(176, 224, 230, 0.3) 0px, transparent 50%)', // Светло-голубой CadetBlue
          'radial-gradient(at 0% 100%, rgba(224, 255, 255, 0.3) 0px, transparent 50%)', // Бирюзовый LightCyan
          'radial-gradient(at 80% 100%, rgba(240, 248, 255, 0.3) 0px, transparent 50%)', // Белый AliceBlue
          'radial-gradient(at 0% 0%, rgba(255, 244, 240, 0.3) 0px, transparent 50%)', // Светло-зеленый PaleGreen
        ].join(', '),
        'mono-cool-radial-bg3': [
          'radial-gradient(at 0% 0%, rgba(255, 244, 240, 0.3) 0px, transparent 50%)', // Светло-зеленый PaleGreen
          'radial-gradient(at 80% 100%, rgba(240, 248, 255, 0.3) 0px, transparent 50%)', // Белый AliceBlue
          'radial-gradient(at 0% 100%, rgba(224, 255, 255, 0.3) 0px, transparent 50%)', // Бирюзовый LightCyan
          'radial-gradient(at 80% 50%, rgba(176, 224, 230, 0.3) 0px, transparent 50%)', // Светло-голубой CadetBlue
          'radial-gradient(at 0% 50%, rgba(177, 173, 230, 0.3) 0px, transparent 50%)', // Светло-голубой PowderBlue
          'radial-gradient(at 80% 0%, rgba(52, 7, 174, 0.3) 0px, transparent 50%)', // Светло-голубой LightSkyBlue
          'radial-gradient(at 40% 20%, rgba(255, 5, 5, 0.1) 0px, transparent 50%)', // Синий CornflowerBlue
        ].join(', '),
      },
    },
  },
  plugins: [require('tailwindcss-font-inter')],
  important: true,
} satisfies Config;