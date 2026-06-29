import { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

/**
 * MatchTimer — display only.
 * Timer chạy/dừng được control hoàn toàn từ parent qua prop `isRunning`.
 * Không có internal Play/Pause — tránh state split giữa timer và match status.
 *
 * @param {boolean} isRunning  - true khi match đang ongoing
 * @param {number}  seconds    - giá trị hiện tại (controlled)
 * @param {Function} onTick    - callback mỗi giây: (newSeconds) => void
 */
export default function MatchTimer({ isRunning, seconds, onTick }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        onTick(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-navy rounded-3xl border border-navy-light shadow-lg shadow-black/20">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-neon" /> Thời gian trận đấu
      </div>
      <div className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  );
}