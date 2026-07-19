import { Controller } from 'react-hook-form';
import { Clock, Trash2, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { IoFootball } from 'react-icons/io5';
import { MINUTE_BOUNDS_BY_PERIOD, PERIOD_LABELS } from '../../schemas/livematch.schema';

/**
 * EventCard — card RHF-controlled cho 1 dòng sự kiện (bàn thắng, thẻ vàng,
 * thẻ đỏ, thay người) trong LiveControlTab.
 *
 * Khác bản cũ (select-based, dùng onUpdate thủ công):
 * - Phút: input số tự do, CHỈ nhận digit (mọi ký tự khác bị strip ngay khi
 *   gõ), clamp theo period của chính dòng này (period gán 1 lần lúc tạo
 *   dòng — xem LiveControlTab#addEvent, không đổi sau khi đã tạo).
 * - Giây: cùng dạng input số 0-59 — UI-only, KHÔNG gửi lên BE (BE không có
 *   cột lưu giây, xem buildEventPayload ở LiveControlTab).
 * - Giờ thực (preview): "~09:05" cạnh ô phút — tính client-side thuần từ
 *   scheduledAt + minute, KHÔNG cần lưu thêm gì ở DB.
 * - Mọi field đi qua RHF Controller (control + name), không còn onUpdate
 *   callback tay — validate tự động qua zodResolver ở form cha.
 *
 * sentOffPlayerIds tính CỤC BỘ trong component này, KHÔNG nhận sẵn dạng Set
 * cố định từ cha — lý do: 1 cầu thủ chỉ "đã bị truất quyền" đối với các
 * event XẢY RA SAU thời điểm họ bị đuổi. Nếu cha tính 1 Set chung cho toàn
 * đội (không cắt theo thứ tự), sẽ disable nhầm cầu thủ ở NHỮNG DÒNG TẠO
 * TRƯỚC khi họ thực sự bị đuổi — future rò ngược vào quá khứ. `allEvents`
 * (mảng watched của toàn bộ phía, đọc từ useWatch ở component cha) được cắt
 * tại đúng vị trí `evt.id` hiện tại để đảm bảo đúng thứ tự — pattern này
 * giữ nguyên từ bản gốc, chỉ đổi cách nhận input (props thay vì đọc field
 * DOM trực tiếp).
 */
export default function EventCard({
  control,
  basePath,      // vd "homeEvents.3"
  evt,           // giá trị watched hiện tại của dòng này
  allEvents,     // toàn bộ mảng watched của phía này (home hoặc away), dùng để cắt theo thứ tự
  players,
  lineup,
  scheduledAt,
  disabled,
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
      case 'goal': return <IoFootball className="w-3.5 h-3.5" />;
      case 'yellow': return <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm shadow-[0_0_4px_rgba(250,204,21,0.5)] shrink-0" />;
      case 'red': return <div className="w-2.5 h-3.5 bg-red-500 rounded-sm shadow-[0_0_4px_rgba(239,68,68,0.5)] shrink-0" />;
      case 'substitution': return <ArrowRightLeft className="w-3.5 h-3.5" />;
      default: return null;
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

  // ── Yellow-card count + sent-off, chỉ tính các event TRƯỚC dòng này ──
  const yellowCountBefore = new Map();
  const sentOffPlayerIds = new Set();
  for (const e of allEvents ?? []) {
    if (e.id === evt.id) break;
    if (e.type === 'yellow' && e.player) {
      const n = (yellowCountBefore.get(e.player) || 0) + 1;
      yellowCountBefore.set(e.player, n);
      if (n >= 2) sentOffPlayerIds.add(e.player);
    }
    if (e.type === 'red' && e.player) sentOffPlayerIds.add(e.player);
  }
  const isSecondYellow = evt.type === 'yellow' && evt.player && (yellowCountBefore.get(evt.player) || 0) >= 1;

  // ── On-field / bench TẠI THỜI ĐIỂM dòng này (dựa trên substitution xảy ra trước nó) ──
  let starters = players;
  let subs = [];
  if (lineup && lineup.length > 0) {
    const starterIds = lineup.filter(l => l.lineup_type === 'starter').map(l => String(l.player_id));
    const subIds = lineup.filter(l => l.lineup_type === 'substitute').map(l => String(l.player_id));
    starters = players.filter(p => starterIds.includes(String(p.id)) || starterIds.includes(String(p.player?.id)));
    subs = players.filter(p => subIds.includes(String(p.id)) || subIds.includes(String(p.player?.id)));
  }

  const currentOnFieldIds = new Set(starters.map(p => String(p.id)));
  const currentBenchIds = new Set(subs.map(p => String(p.id)));

  for (const e of allEvents ?? []) {
    if (e.id === evt.id) break;
    if (e.type === 'substitution') {
      if (e.playerOut) { currentOnFieldIds.delete(String(e.playerOut)); currentBenchIds.add(String(e.playerOut)); }
      if (e.playerIn) { currentBenchIds.delete(String(e.playerIn)); currentOnFieldIds.add(String(e.playerIn)); }
    }
  }
  // Cầu thủ bị đuổi không còn "on field" nữa dù chưa có substitution ghi
  // nhận — loại khỏi cả field lẫn bench (không thể vào lại).
  for (const pid of sentOffPlayerIds) {
    currentOnFieldIds.delete(pid);
    currentBenchIds.delete(pid);
  }

  const onFieldPlayers = players.filter(p => currentOnFieldIds.has(String(p.id)));
  const benchPlayers = players.filter(p => currentBenchIds.has(String(p.id)));

  const renderPlayerOptions = (list) => list.map(p => {
    const name = p.user?.name || p.player?.user?.name || p.name || p.player?.name || `Cầu thủ #${p.player_id || p.id}`;
    const isDisabled = sentOffPlayerIds.has(String(p.id));
    return (
      <option key={p.id} value={String(p.id)} disabled={isDisabled}>
        {name} ({p.jersey_number ?? p.number ?? '?'}){isDisabled ? ' — đã bị truất quyền' : ''}
      </option>
    );
  });

  const [minBound, maxBound] = MINUTE_BOUNDS_BY_PERIOD[evt.period] ?? [1, 120];

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border relative group transition-all ${getEventStyle(evt.type)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          {getEventIcon(evt.type)} {getEventTitle(evt.type)} · {PERIOD_LABELS[evt.period]}
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            title="Xóa sự kiện"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
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
            <Controller
              control={control}
              name={`${basePath}.playerOut`}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-0.5 flex-1">
                  <select
                    disabled={disabled}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    className={`w-full text-xs p-2 bg-navy border rounded-lg text-white outline-none disabled:opacity-40 ${fieldState.error ? 'border-red-500' : 'border-red-500/30 focus:border-red-400'
                      }`}
                  >
                    <option value="">Chọn người ra sân...</option>
                    {renderPlayerOptions(onFieldPlayers)}
                  </select>
                  {fieldState.error && <span className="text-[10px] text-red-400">{fieldState.error.message}</span>}
                </div>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase w-6 shrink-0">Vào</span>
            <Controller
              control={control}
              name={`${basePath}.playerIn`}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-0.5 flex-1">
                  <select
                    disabled={disabled}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    className={`w-full text-xs p-2 bg-navy border rounded-lg text-white outline-none disabled:opacity-40 ${fieldState.error ? 'border-red-500' : 'border-emerald-500/30 focus:border-emerald-400'
                      }`}
                  >
                    <option value="">Chọn người vào sân...</option>
                    {renderPlayerOptions(benchPlayers)}
                  </select>
                  {fieldState.error && <span className="text-[10px] text-red-400">{fieldState.error.message}</span>}
                </div>
              )}
            />
          </div>
        </div>
      ) : (
        <Controller
          control={control}
          name={`${basePath}.player`}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-0.5">
              <select
                disabled={disabled}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className={`w-full text-xs p-2 bg-navy border rounded-lg text-white outline-none disabled:opacity-40 ${fieldState.error ? 'border-red-500' : 'border-navy-light focus:border-neon'
                  }`}
              >
                <option value="">Chọn cầu thủ...</option>
                {lineup && lineup.length > 0 ? (
                  <>
                    <optgroup label="Đang đá">{renderPlayerOptions(onFieldPlayers)}</optgroup>
                    <optgroup label="Dự bị">{renderPlayerOptions(benchPlayers)}</optgroup>
                  </>
                ) : renderPlayerOptions(players)}
              </select>
              {fieldState.error && <span className="text-[10px] text-red-400">{fieldState.error.message}</span>}
            </div>
          )}
        />
      )}

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 opacity-70 shrink-0" />

        <Controller
          control={control}
          name={`${basePath}.minute`}
          render={({ field, fieldState }) => (
            <div className="flex-1 flex flex-col gap-0.5">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={disabled}
                value={field.value}
                placeholder={`${minBound}-${maxBound}`}
                onChange={(e) => {
                  // Chỉ giữ digit — không thể gõ dấu trừ/chữ/ký tự đặc biệt.
                  const digits = e.target.value.replace(/[^0-9]/g, '');
                  if (digits === '') { field.onChange(''); return; }
                  field.onChange(Math.min(Math.max(Number(digits), minBound), maxBound));
                }}
                className={`w-full text-xs p-2 bg-navy border rounded-lg text-white outline-none text-center font-bold disabled:opacity-40 ${fieldState.error ? 'border-red-500' : 'border-navy-light focus:border-neon'
                  }`}
              />
              {fieldState.error && <span className="text-[10px] text-red-400">{fieldState.error.message}</span>}
            </div>
          )}
        />

        <span className="text-xs opacity-50 shrink-0">:</span>

        <Controller
          control={control}
          name={`${basePath}.second`}
          render={({ field }) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              value={String(field.value ?? 0).padStart(2, '0')}
              title="Giây (chỉ hiển thị, không lưu lên server)"
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, '');
                field.onChange(digits === '' ? 0 : Math.min(Number(digits), 59));
              }}
              className="w-14 text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon disabled:opacity-40"
            />
          )}
        />

        <Controller
          control={control}
          name={`${basePath}.minute`}
          render={({ field }) => (
            <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
              {formatClockPreview(scheduledAt, field.value) ?? '—'}
            </span>
          )}
        />
      </div>
    </div>
  );
}

// Time thực: scheduled_at + minute cumulative — thuần client-side, không cần
// lưu gì thêm ở DB. Khớp công thức backend computeEventClockTime() nhánh
// estimated (helper/match.helper.ts).
function formatClockPreview(scheduledAt, minute) {
  if (!scheduledAt || minute === '' || minute == null || Number.isNaN(Number(minute))) return null;
  const t = new Date(scheduledAt);
  t.setMinutes(t.getMinutes() + Number(minute));
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  return `~${hh}:${mm}`;
}