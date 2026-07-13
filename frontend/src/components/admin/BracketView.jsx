import { useMemo, useState } from 'react';
import { ArrowLeftRight, Check, Lock, X, Radio } from 'lucide-react';

// Round 1 (round nhỏ nhất trong dữ liệu) không nhất thiết là "round === 1"
// theo số học nếu BE trả về subset — nhưng trong hệ thống này round luôn
// bắt đầu từ 1 (xem buildAllSlotCreateData: `for (let round = 1; ...)`),
// nên round nhỏ nhất luôn = round 1 thật MIỄN LÀ dữ liệu không bị cắt bớt
// ở BE/API layer.
//
// FIX (crash null-safety): computeBracketMeta() giờ tự guard slots
// null/rỗng NGAY BÊN TRONG thay vì dựa vào guard ở cuối component — vì
// guard đó chạy SAU các hook (useMemo), còn Rules of Hooks bắt buộc hook
// phải chạy mỗi render bất kể slots có giá trị hay không. Cả hai nơi gọi
// component này (LeaderboardTeams, KnockoutUI) khởi tạo bracketData bằng
// useState(null) — nếu không guard ở đây, lần render đầu tiên luôn crash
// "Cannot read properties of null (reading 'map')" trước khi hook chạy
// xong, tức là crash xảy ra TRƯỚC khi tới được early-return cũ.
function computeBracketMeta(slots) {
    if (!Array.isArray(slots) || slots.length === 0) {
        return { rounds: [], totalRounds: 0, bracketSize: 0, inconsistent: false };
    }

    const rounds = [...new Set(slots.map(s => s.round))].sort((a, b) => a - b);
    if (rounds.length === 0) return { rounds: [], totalRounds: 0, bracketSize: 0, inconsistent: false };

    const earliestRound = rounds[0];
    const slotsInEarliestRound = slots.filter(s => s.round === earliestRound).length;
    const bracketSize = slotsInEarliestRound * Math.pow(2, earliestRound);
    const totalRounds = Math.log2(bracketSize);

    const inconsistent = !Number.isInteger(totalRounds) || rounds.length !== (totalRounds - earliestRound + 1);

    return { rounds, totalRounds: Math.ceil(totalRounds), bracketSize, inconsistent };
}

// remaining = số vòng còn lại tính đến chung kết (remaining=1 chính là
// chung kết). Số đội BƯỚC VÀO vòng đó luôn = 2^remaining — đúng cho mọi
// bracket size, không cần liệt kê từng mốc.
function roundLabel(round, totalRounds) {
    const remaining = totalRounds - round + 1;
    if (remaining === 1) return 'Chung kết';
    if (remaining === 2) return 'Bán kết';
    if (remaining === 3) return 'Tứ kết';
    return `Vòng 1/${Math.pow(2, remaining)}`; // remaining=4 -> "Vòng 1/16", 5 -> "Vòng 1/32", ...
}

// FIX: gating (canEdit / anyRound1Played) phải khớp CHÍNH XÁC với backend
// (TERMINAL_MATCH_STATUSES trong knockout.service.ts::swapSeeds/confirmBracket
// = chỉ finished/forfeited). Bản cũ gộp thêm 'live' vào cùng 1 set dùng để
// vừa hiển thị badge vừa để khoá edit — khiến FE khoá sớm hơn backend cho
// phép, tạo trạng thái UI sai lệch ("đã khoá" nhưng BE vẫn nhận request).
// Tách riêng: LOCKED_STATUSES dùng để gate, LIVE_STATUS chỉ để hiển thị badge.
const LOCKED_STATUSES = new Set(['finished', 'forfeited']);
const LIVE_STATUS = 'live';
const isSlotLocked = (slot) => LOCKED_STATUSES.has(slot?.matchStatus);
const isSlotLive = (slot) => slot?.matchStatus === LIVE_STATUS;

export default function BracketView({
    slots,
    teams,
    editable = false,       // bật khả năng swap seed (chỉ áp dụng round 1)
    confirmed = false,      // bracket đã được admin xác nhận hay chưa
    onSwapSeeds,            // (slotIdA, slotIdB) => Promise<void>
    onConfirm,              // () => Promise<void>
    confirming = false,
}) {
    const [swapSource, setSwapSource] = useState(null); // { slotId, side: 'home' | 'away' }

    const teamName = (id) => (id == null ? 'TBD' : (teams.find(t => t.id === id)?.name || `Team ${id}`));

    const { rounds, totalRounds, inconsistent } = useMemo(() => computeBracketMeta(slots), [slots]);

    // FIX: guard Array.isArray ngay trong callback — trước đây gọi thẳng
    // slots.filter(...) không check, crash cùng nguyên nhân với computeBracketMeta.
    const round1Slots = useMemo(
        () => (Array.isArray(slots) ? slots.filter(s => s.round === rounds[0]).sort((a, b) => a.slotNumber - b.slotNumber) : []),
        [slots, rounds],
    );

    // Chỉ cho phép confirm / hiện nút xác nhận khi CHƯA có trận round 1 nào
    // kết thúc (finished/forfeited) — khớp đúng điều kiện confirmBracket()
    // và swapSeeds() thật ở BE. Trận đang "live" KHÔNG chặn ở đây vì BE
    // cũng không chặn — nếu muốn chặn cả live, phải sửa ở BE trước để 2
    // bên nhất quán, không nên chỉ chặn 1 phía trên FE.
    const anyRound1Locked = round1Slots.some(isSlotLocked);
    const canEdit = editable && !confirmed && !anyRound1Locked;
    const showConfirmButton = editable && !confirmed && !anyRound1Locked && round1Slots.length > 0;

    // Guard cuối cùng cho phần RENDER (không phải cho hooks — hooks ở trên
    // đã tự an toàn với slots null/rỗng nên vẫn chạy đúng thứ tự mỗi render).
    if (!Array.isArray(slots) || slots.length === 0) return null;

    const handlePick = (slotId, side, teamId) => {
        if (!canEdit || teamId == null) return;
        if (!swapSource) {
            setSwapSource({ slotId, side });
            return;
        }
        if (swapSource.slotId === slotId && swapSource.side === side) {
            setSwapSource(null); // bấm lại chính ô đang chọn -> huỷ chọn
            return;
        }
        onSwapSeeds?.(swapSource, { slotId, side });
        setSwapSource(null);
    };

    const isPicked = (slotId, side) => swapSource?.slotId === slotId && swapSource?.side === side;

    return (
        <div className="space-y-3">
            {inconsistent && (
                <div className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-lg px-3 py-2">
                    Dữ liệu bracket trả về không đủ số vòng liên tục (thiếu round ở giữa) — kiểm tra lại API
                    getBracket() hoặc dữ liệu phase này. Nhãn vòng đấu bên dưới có thể không chính xác.
                </div>
            )}

            {canEdit && (
                <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-navy-dark border border-navy-light rounded-lg px-3 py-2">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                        Bấm chọn 1 đội ở vòng 1, rồi bấm đội thứ 2 muốn đổi chỗ để hoán đổi nhánh đấu.
                        {swapSource && <span className="text-amber-400 font-bold"> Đang chọn 1 đội — bấm đội thứ 2 để hoán đổi.</span>}
                    </span>
                </div>
            )}

            {confirmed && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 rounded-lg px-3 py-2">
                    <Lock className="w-3.5 h-3.5 shrink-0" /> Sơ đồ đã được xác nhận — không thể đổi nhánh nữa.
                </div>
            )}

            {!confirmed && anyRound1Locked && editable && (
                <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-2">
                    <Lock className="w-3.5 h-3.5 shrink-0" /> Đã có trận vòng 1 kết thúc — không thể đổi nhánh hoặc xác nhận lại sơ đồ.
                </div>
            )}

            <div className="flex gap-8 overflow-x-auto pb-4">
                {rounds.map(round => {
                    const roundSlots = slots.filter(s => s.round === round).sort((a, b) => a.slotNumber - b.slotNumber);
                    const isRound1 = round === rounds[0];
                    return (
                        <div key={round} className="flex flex-col justify-around gap-6 min-w-[220px] shrink-0">
                            <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider text-center mb-1">
                                {roundLabel(round, totalRounds)}
                            </h5>
                            {roundSlots.map(slot => {
                                const homePicked = isRound1 && isPicked(slot.slotId, 'home');
                                const awayPicked = isRound1 && isPicked(slot.slotId, 'away');
                                const rowClass = (picked, teamId) =>
                                    `px-3 py-2 flex items-center justify-between gap-2 ${teamId ? 'text-white' : 'text-gray-500'} ${isRound1 && canEdit && teamId ? 'cursor-pointer hover:bg-navy-light/40' : ''
                                    } ${picked ? 'bg-amber-500/20 ring-1 ring-amber-500/60' : ''}`;

                                return (
                                    <div key={slot.slotId} className="bg-navy-dark border border-navy-light rounded-lg overflow-hidden text-sm">
                                        <div
                                            className={rowClass(homePicked, slot.seededHomeTeamId)}
                                            onClick={() => isRound1 && handlePick(slot.slotId, 'home', slot.seededHomeTeamId)}
                                        >
                                            <span className="truncate">{teamName(slot.seededHomeTeamId)}</span>
                                            {homePicked && <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                        </div>
                                        <div className="h-px bg-navy-light" />
                                        <div
                                            className={rowClass(awayPicked, slot.seededAwayTeamId)}
                                            onClick={() => isRound1 && handlePick(slot.slotId, 'away', slot.seededAwayTeamId)}
                                        >
                                            <span className="truncate">{teamName(slot.seededAwayTeamId)}</span>
                                            {awayPicked && <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                        </div>
                                        {slot.isBye && (
                                            <div className="px-3 py-1 text-[10px] text-amber-500 bg-navy border-t border-navy-light">BYE</div>
                                        )}
                                        {!slot.matchId && !slot.isBye && (
                                            <div className="px-3 py-1 text-[10px] text-gray-600 bg-navy border-t border-navy-light">Chờ đội</div>
                                        )}
                                        {isSlotLive(slot) && (
                                            <div className="px-3 py-1 text-[10px] text-red-400 bg-navy border-t border-navy-light flex items-center gap-1">
                                                <Radio className="w-3 h-3 animate-pulse" /> Đang diễn ra
                                            </div>
                                        )}
                                        {isSlotLocked(slot) && (
                                            <div className="px-3 py-1 text-[10px] text-emerald-500 bg-navy border-t border-navy-light">Đã đá</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {showConfirmButton && (
                <div className="flex justify-end pt-2 border-t border-navy-light">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={confirming}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {confirming ? <X className="w-4 h-4 animate-pulse" /> : <Check className="w-4 h-4" />}
                        Xác nhận sơ đồ
                    </button>
                </div>
            )}
        </div>
    );
}