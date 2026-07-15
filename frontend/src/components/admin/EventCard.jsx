import { Clock, Trash2, AlertTriangle } from 'lucide-react';

/**
 * EventCard — Card hiển thị 1 sự kiện trận đấu (bàn thắng, thẻ vàng, thẻ đỏ, thay người).
 *
 * Note: bug "dropdown cầu thủ rỗng cả 2 bên" không nằm ở file này — root cause ở
 * LiveControlTab (unwrap response). Xem LiveControlTab.jsx.
 *
 * FIX (input phút tự do → select): trước đây là <input type="number"> với
 * min/max hint — vẫn cho phép gõ số lẻ tuỳ ý trong khoảng, dễ gõ nhầm số
 * (VD "19" thay vì "9"), và trần chỉ là UI hint không chặn thật (nút
 * tăng/giảm native của input number vẫn có thể vượt qua trên một số browser
 * khi gõ tay + blur). Giờ nhận `minuteOptions` từ cha
 * (LiveControlTab#buildMinuteOptions) — domain đã đóng kín ở UI level, không
 * còn cách nào chọn giá trị ngoài khoảng hợp lệ, nên KHÔNG cần confirm-modal
 * phụ trợ nữa (đã xoá ConfirmExtraTimeMinuteModal ở LiveControlTab).
 * `minuteOptions = { regular: number[], extra: number[] }` — `extra` rỗng
 * với trận round-robin (không hiệp phụ), có giá trị với knockout.
 *
 * NEW: thêm select giây (`secondOptions`, mặc định bước 5 giây). LƯU Ý: giây
 * hiện KHÔNG được gửi lên BE — matchApi.recordEvent/adminRecordResult chỉ
 * nhận `minute: number` (BE: assertMinuteInBounds yêu cầu Number.isInteger,
 * schema MatchEvent không có cột giây). Giây ở đây chỉ phục vụ hiển thị/sắp
 * xếp cục bộ tại FE, sẽ mất khi F5 nếu event chưa commit. Nếu cần persist
 * giây thật, phải đổi schema + validate phía BE trước.
 */
export default function EventCard({
  evt,
  players,
  lineup,
  allEvents,
  minuteOptions = { regular: [], extra: [] },
  secondOptions = [],
  onUpdate,
  onRemove,
}) {
  const getEventStyle = (type) => {
    switch (type) {
      case 'goal': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'yellow': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'red': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'substitution': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'substitution': return '🔄';
      default: return '❓';
    }
  };

  const getEventTitle = (type) => {
    switch (type) {
      case 'goal': return 'Bàn thắng';
      case 'yellow': return 'Thẻ vàng';
      case 'red': return 'Thẻ đỏ';
      case 'substitution': return 'Thay người';
      default: return 'Sự kiện';
    }
  };

  // ── Yellow-card count per player, giới hạn TRƯỚC evt hiện tại (theo id/thời
  // gian tạo, giống pattern substitution tracking bên dưới) — dùng để: (1) hiện
  // badge "Thẻ vàng 2 → Đỏ" khi user chọn player đã có 1 thẻ; (2) loại player đã
  // bị truất quyền (red hoặc yellow-2) khỏi mọi dropdown khác (goal/card/sub-out).
  const yellowCountBefore = new Map();
  const sentOffPlayerIds = new Set(); // đã nhận red_card HOẶC thẻ vàng thứ 2

  if (allEvents) {
    for (const e of allEvents) {
      if (e.id === evt.id) break;
      if (e.type === 'yellow' && e.player) {
        const n = (yellowCountBefore.get(e.player) || 0) + 1;
        yellowCountBefore.set(e.player, n);
        if (n >= 2) sentOffPlayerIds.add(e.player);
      }
      if (e.type === 'red' && e.player) {
        sentOffPlayerIds.add(e.player);
      }
    }
  }

  const isSecondYellow = evt.type === 'yellow' && evt.player && (yellowCountBefore.get(evt.player) || 0) >= 1;

  // Determine current players on field and on bench
  let starters = players;
  let subs = [];

  if (lineup && lineup.length > 0) {
    const starterIds = lineup.filter(l => l.lineup_type === 'starter').map(l => String(l.player_id));
    const subIds = lineup.filter(l => l.lineup_type === 'substitute').map(l => String(l.player_id));

    starters = players.filter(p => starterIds.includes(String(p.id)) || starterIds.includes(String(p.player?.id)));
    subs = players.filter(p => subIds.includes(String(p.id)) || subIds.includes(String(p.player?.id)));
  }

  let currentOnFieldIds = new Set(starters.map(p => String(p.id)));
  let currentBenchIds = new Set(subs.map(p => String(p.id)));

  if (allEvents) {
    for (const e of allEvents) {
      if (e.id === evt.id) break;
      if (e.type === 'substitution') {
        if (e.playerOut) {
          currentOnFieldIds.delete(String(e.playerOut));
          currentBenchIds.add(String(e.playerOut));
        }
        if (e.playerIn) {
          currentBenchIds.delete(String(e.playerIn));
          currentOnFieldIds.add(String(e.playerIn));
        }
      }
    }
  }

  // Player bị đuổi (sentOffPlayerIds) không còn "on field" nữa dù chưa có
  // substitution nào ghi nhận — loại khỏi field lẫn bench (không thể vào lại).
  for (const pid of sentOffPlayerIds) {
    currentOnFieldIds.delete(pid);
    currentBenchIds.delete(pid);
  }

  const onFieldPlayers = players.filter(p => currentOnFieldIds.has(String(p.id)));
  const benchPlayers = players.filter(p => currentBenchIds.has(String(p.id)));

  const renderPlayerOptions = (list) => {
    return list.map(p => {
      const name =
        p.user?.name ||
        p.player?.user?.name ||
        p.name ||
        p.player?.name ||
        `Cầu thủ #${p.player_id || p.id}`;
      const disabled = sentOffPlayerIds.has(String(p.id));
      return (
        <option key={p.id} value={String(p.id)} disabled={disabled}>
          {name} ({p.jersey_number ?? p.number ?? '?'}){disabled ? ' — đã bị truất quyền' : ''}
        </option>
      );
    });
  };

  // FIX: format "0" -> "00" cho giây hiển thị đồng nhất 2 chữ số.
  const fmtSecond = (s) => String(s).padStart(2, '0');

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border relative group transition-all ${getEventStyle(evt.type)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          {getEventIcon(evt.type)} {getEventTitle(evt.type)}
        </span>
        <button
          onClick={() => onRemove(evt.id)}
          className="w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          title="Xóa sự kiện"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {isSecondYellow && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Thẻ vàng thứ 2 — sẽ ghi nhận thành thẻ đỏ (truất quyền thi đấu)
        </div>
      )}

      {evt.type === 'substitution' ? (
        <div className="flex flex-col gap-2 bg-navy-dark/30 p-2 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-400 uppercase w-6 shrink-0">Ra</span>
            <select
              value={evt.playerOut}
              onChange={e => onUpdate(evt.id, 'playerOut', e.target.value)}
              className="w-full text-xs p-2 bg-navy border border-red-500/30 rounded-lg text-white outline-none focus:border-red-400"
            >
              <option value="">Chọn người ra sân...</option>
              {renderPlayerOptions(onFieldPlayers)}
              {evt.playerOut && !onFieldPlayers.find(p => String(p.id) === String(evt.playerOut)) && (
                <option value={evt.playerOut}>Cầu thủ #{evt.playerOut} (đã chọn)</option>
              )}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase w-6 shrink-0">Vào</span>
            <select
              value={evt.playerIn}
              onChange={e => onUpdate(evt.id, 'playerIn', e.target.value)}
              className="w-full text-xs p-2 bg-navy border border-emerald-500/30 rounded-lg text-white outline-none focus:border-emerald-400"
            >
              <option value="">Chọn người vào sân...</option>
              {renderPlayerOptions(benchPlayers)}
              {evt.playerIn && !benchPlayers.find(p => String(p.id) === String(evt.playerIn)) && (
                <option value={evt.playerIn}>Cầu thủ #{evt.playerIn} (đã chọn)</option>
              )}
            </select>
          </div>
        </div>
      ) : (
        <select
          value={evt.player}
          onChange={e => onUpdate(evt.id, 'player', e.target.value)}
          className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none focus:border-neon"
        >
          <option value="">Chọn cầu thủ...</option>
          {lineup && lineup.length > 0 ? (
            <>
              <optgroup label="Đang đá">
                {renderPlayerOptions(onFieldPlayers)}
              </optgroup>
              <optgroup label="Dự bị">
                {renderPlayerOptions(benchPlayers)}
              </optgroup>
            </>
          ) : (
            renderPlayerOptions(players)
          )}
        </select>
      )}

      {/* FIX: input phút tự do -> select phút (đóng kín domain) + select giây
          (UI-only, xem docblock đầu file). */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 opacity-70 shrink-0" />

        <select
          value={evt.minute}
          onChange={e => onUpdate(evt.id, 'minute', e.target.value)}
          className="flex-1 text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon"
        >
          <option value="">Phút</option>
          {minuteOptions.regular.length > 0 && (
            <optgroup label="Hiệp 1 &amp; 2">
              {minuteOptions.regular.map(m => (
                <option key={`r-${m}`} value={m}>{m}'</option>
              ))}
            </optgroup>
          )}
          {minuteOptions.extra.length > 0 && (
            <optgroup label="Hiệp phụ">
              {minuteOptions.extra.map(m => (
                <option key={`e-${m}`} value={m}>{m}'</option>
              ))}
            </optgroup>
          )}
        </select>

        <span className="text-xs opacity-50 shrink-0">:</span>

        <select
          value={evt.second ?? 0}
          onChange={e => onUpdate(evt.id, 'second', e.target.value)}
          title="Giây (chỉ hiển thị, không lưu lên server)"
          className="w-16 text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon"
        >
          {secondOptions.map(s => (
            <option key={s} value={s}>{fmtSecond(s)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}