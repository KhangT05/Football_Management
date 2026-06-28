import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../store/themeStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * ThemeSwitcher: Nút bấm tối ưu đổi trực tiếp giao diện Tối/Sáng
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore(useShallow(state => ({ theme: state.theme, setTheme: state.setTheme })));

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'pastel' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        w-10 h-10
        rounded-full
        border
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:shadow-lg
        group
      "
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-header)',
      }}
      title={theme === 'dark' ? 'Đổi sang giao diện Sáng' : 'Đổi sang giao diện Tối'}
      aria-label="Đổi giao diện Tối/Sáng"
    >
      <div className="relative flex items-center justify-center w-6 h-6">
        <Sun
          className={`absolute transition-all duration-500 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100 text-amber-400'
              : 'opacity-0 -rotate-90 scale-50 text-amber-400'
          }`}
          size={20}
        />

        <Moon
          className={`absolute transition-all duration-500 ${
            theme === 'dark'
              ? 'opacity-0 rotate-90 scale-50 text-indigo-500'
              : 'opacity-100 rotate-0 scale-100 text-indigo-500'
          }`}
          size={20}
        />
      </div>
    </button>
  );
}
