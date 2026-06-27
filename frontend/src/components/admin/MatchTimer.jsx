import { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * MatchTimer — Bộ đếm thời gian trận đấu cho trang UpdateResults (admin).
 */
export default function MatchTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-navy rounded-3xl border border-navy-light shadow-lg shadow-black/20">
      <div className="flex w-full items-center justify-between mb-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-neon" /> Thời gian trận đấu
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isRunning 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center justify-center p-1.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-all"
            title="Đặt lại thời gian"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-5xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  );
}
