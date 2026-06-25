import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Định nghĩa 2 theme:
 * - 'dark'   : Tone màu hiện tại (Navy dark / Neon green)
 * - 'pastel' : Tone màu nhẹ nhàng (Gradient xanh-tím pastel)
 */
export const THEMES = {
  dark: {
    id: 'dark',
    label: 'Tối',
    description: 'Tone màu tối mạnh mẽ',
    preview: ['#070e17', '#0A192F', '#39FF14'],
  },
  pastel: {
    id: 'pastel',
    label: 'Sáng',
    description: 'Tone màu sáng thanh lịch',
    preview: ['#EFF6FF', '#FFFFFF', '#4F46E5'],
  },
};


const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // mặc định là dark theme
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-theme',
    }
  )
);

export default useThemeStore;
