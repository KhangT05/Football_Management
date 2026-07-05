import { POSITION_LABELS } from '../../utils/constants';

const normalizePosition = (posStr) => {
  if (!posStr) return 'OTHER';
  let p = posStr.toUpperCase().trim();
  if (p === 'GOALKEEPER' || p.includes('GK') || p.includes('THỦ MÔN')) return 'GK';
  if (p === 'DEFENDER' || p.includes('DEF') || p === 'DF' || p.includes('HẬU VỆ')) return 'DEF';
  if (p === 'MIDFIELDER' || p.includes('MID') || p === 'MF' || p.includes('TIỀN VỆ')) return 'MID';
  if (p === 'FORWARD' || p.includes('FW') || p === 'FWD' || p.includes('TIỀN ĐẠO')) return 'FW';
  return p;
};

export default function PosBadge({ pos }) {
  const normPos = normalizePosition(pos);
  const styles = {
    GK: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]',
    DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30 shadow-[0_0_10px_rgba(96,165,250,0.1)]',
    MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
    FW: 'bg-red-400/10 text-red-400 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
  };
  return (
    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${styles[normPos] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
      {POSITION_LABELS[normPos] || normPos}
    </span>
  );
}