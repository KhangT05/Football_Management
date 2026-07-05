import { normalizePosition } from '../utils';
import { POSITION_LABELS } from '../../../utils/constants';

const STYLES = {
  GK: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30 shadow-[0_0_10px_rgba(96,165,250,0.1)]',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
  FW: 'bg-red-400/10 text-red-400 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
};

export default function PosBadge({ pos }) {
  const normPos = normalizePosition(pos);
  return (
    <span
      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${STYLES[normPos] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'
        }`}
    >
      {POSITION_LABELS[normPos] || normPos}
    </span>
  );
}