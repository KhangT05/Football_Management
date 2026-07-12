import { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Edit, Trash2, Save, Loader2, AlertTriangle, RefreshCw, Search, Info, CalendarCheck } from 'lucide-react';
import { tournamentApi, tournamentRuleApi, seasonApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
import { parseApiError } from '../../../utils/errorHelper';
import useToastStore from '../../../store/toastStore';
import AdminModal from '../AdminModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import FormField from '../../ui/FormField';
import Pagination from '../../ui/Pagination';
import { INPUT } from '../../../utils/adminStyles';

const TIEBREAKER_OPTIONS = [
  { value: 'goal_diff', label: 'Hiệu số bàn thắng' },
  { value: 'goals_scored', label: 'Tổng bàn thắng' },
  { value: 'head_to_head', label: 'Đối đầu trực tiếp' },
  { value: 'goals_conceded', label: 'Bàn thủng' },
  { value: 'yellow_cards', label: 'Thẻ vàng' },
  { value: 'red_cards', label: 'Thẻ đỏ' },
];

// Phải khớp validateFormatConsistency() ở TournamentRuleService — đây là bản mirror
// phía client để chặn lỗi sớm, KHÔNG thay thế validate server (server vẫn là nguồn sự thật).
const FORMAT_OPTIONS = [
  {
    value: 'knockout',
    label: 'Loại trực tiếp (Knockout)',
    stagesRule: { type: 'fixed', value: 0 },
    hint: 'Không có vòng bảng — round_robin_stages luôn = 0.',
  },
  {
    value: 'round_robin_knockout',
    label: 'Vòng bảng 1 lượt + Knockout',
    stagesRule: { type: 'fixed', value: 1 },
    hint: 'Đúng 1 lượt vòng bảng trước khi vào knockout.',
  },
  {
    value: 'multi_round_robin_knockout',
    label: 'Vòng bảng nhiều lượt + Knockout',
    stagesRule: { type: 'min', value: 2 },
    hint: 'Tối thiểu 2 lượt vòng bảng trước khi vào knockout.',
  },
  {
    value: 'round_robin',
    label: 'Vòng tròn tính điểm (không knockout)',
    stagesRule: { type: 'min', value: 1 },
    hint: 'Tối thiểu 1 lượt, không có vòng loại trực tiếp.',
  },
];

const getFormatOption = (format) => FORMAT_OPTIONS.find((o) => o.value === format);

const validateFormatConsistency = (format, stages) => {
  const opt = getFormatOption(format);
  if (!opt) return 'Format không hợp lệ.';
  const n = Number(stages);
  const rule = opt.stagesRule;
  if (rule.type === 'fixed' && n !== rule.value) {
    return `${opt.label}: round_robin_stages phải = ${rule.value} (đang là ${Number.isNaN(n) ? '—' : n}).`;
  }
  if (rule.type === 'min' && n < rule.value) {
    return `${opt.label}: round_robin_stages phải >= ${rule.value} (đang là ${Number.isNaN(n) ? '—' : n}).`;
  }
  return null;
};

// Mirror TournamentRuleService.EDITABLE_SEASON_STATUSES — season ở các
// status này mới cho phép gán/đổi rule. ongoing/finished/cancelled bị khoá
// cứng phía BE (RULE_LOCKED khi sửa field rule, và về mặt nghiệp vụ gán rule
// khác cho season đã có match official cũng nguy hiểm tương tự retroactive
// scoring change) — khoá luôn ở FE để tránh gọi API vô ích rồi nhận lỗi.
const SEASON_ASSIGNABLE_STATUSES = ['upcoming', 'registration_open'];
const SEASON_STATUS_META = {
  upcoming: { label: 'Sắp diễn ra', cls: 'bg-slate-400/10 text-slate-300 border-slate-500/30' },
  registration_open: { label: 'Mở đăng ký', cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
  ongoing: { label: 'Đang diễn ra', cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  finished: { label: 'Kết thúc', cls: 'bg-gray-400/10 text-gray-400 border-gray-400/30' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-400/10 text-red-400 border-red-400/30' },
};
const isSeasonAssignable = (season) => SEASON_ASSIGNABLE_STATUSES.includes(season.status);

const DEFAULT_RULE_FORM = {
  tournament_id: '',
  name: 'Default Rule',
  format: 'round_robin_knockout',
  round_robin_stages: 1,
  points_per_win: 3,
  points_per_draw: 1,
  points_per_loss: 0,
  forfeit_score: 3,
  suspension_match_count: 1,
  yellow_cards_suspension: 3,
  fine_per_yellow_card: 0,
  fine_per_red_card: 0,
  bonus_per_goal: 0,
  bonus_per_assist: 0,
  max_players_per_team: 25,
  min_players_per_team: 11,
  teams_advance_per_group: 2,
  tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head'],
  is_active: true,
};

const SECTION_LABEL = 'text-[11px] font-bold uppercase tracking-wide text-gray-500 mt-3 mb-1';

export default function TournamentRulesSection() {
  const toast = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // isSaving/conflict được quản lý local thay vì qua crud.save(), vì flow
  // "force update sau CONFLICT" cần giữ modal mở + phân biệt loại lỗi, điều
  // useCrudModal (generic) không có context để làm đúng.
  const [isSaving, setIsSaving] = useState(false);
  const [conflict, setConflict] = useState(null); // { message: string, payload: object }

  const { data: items, isLoading, fetch: fetchRules } = useApiQuery(
    (params) => tournamentRuleApi.getAll(params),
    {
      autoFetch: true,
      errorMsg: 'Không tải được dữ liệu luật giải.'
    }
  );

  // Danh sách season toàn hệ thống — cần để build "chọn season áp rule" theo
  // tournament_id đang chọn trong form. Queryable phía BE (SeasonService)
  // chỉ filterable theo is_active, KHÔNG filterable theo tournament_id, nên
  // lọc theo tournament ngay tại client (giống cách ManageSeasonTeams.jsx
  // đang lọc allSeasonTeams theo season_id) thay vì trông chờ query param.
  const { data: allSeasons, fetch: fetchSeasonsForAssign } = useApiQuery(
    (params) => seasonApi.getAll(params),
    { perPage: 200, params: { is_active: true }, errorMsg: 'Không tải được danh sách mùa giải.' }
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    tournamentApi.getAll({ per_page: 100 }).then(res => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      setTournaments(Array.isArray(payload?.data) ? payload.data : []);
    }).catch(() => { });
  }, []);

  const getTournamentName = (id) => tournaments.find(t => t.id === id)?.name ?? `#${id}`;

  const filteredItems = (items || []).filter(item => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.trim().toLowerCase();
    const tournamentName = getTournamentName(item.tournament_id)?.toLowerCase() || '';
    const ruleName = (item.name || '').toLowerCase();
    return tournamentName.includes(lowerSearch) || ruleName.includes(lowerSearch);
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const crud = useCrudModal({
    emptyForm: DEFAULT_RULE_FORM,
    onSuccess: () => {
      setCurrentPage(1);
      fetchRules();
    }
  });

  // Season(s) được chọn để áp rule đang edit/tạo — độc lập với crud.form vì
  // đây không phải field của TournamentRuleDto, mà là 1 batch-action riêng
  // (nhiều lệnh seasonApi.update) chạy SAU khi rule save thành công.
  const [selectedSeasonIds, setSelectedSeasonIds] = useState(() => new Set());

  const seasonsForTournament = (allSeasons || []).filter(
    s => String(s.tournament_id ?? s.tournament?.id ?? '') === String(crud.form?.tournament_id ?? '')
  );

  const toggleSeasonSelection = (seasonId) => {
    setSelectedSeasonIds(prev => {
      const next = new Set(prev);
      if (next.has(seasonId)) next.delete(seasonId);
      else next.add(seasonId);
      return next;
    });
  };

  const resetSaveState = () => {
    setIsSaving(false);
    setConflict(null);
  };

  const openAdd = () => {
    resetSaveState();
    setSelectedSeasonIds(new Set());
    crud.openAdd({ ...DEFAULT_RULE_FORM, tournament_id: tournaments[0]?.id ?? '' });
  };

  const openEdit = (item) => {
    resetSaveState();
    // Prefill season đã gán rule này sẵn (item.seasons từ withRelations BE) —
    // check cả season không còn assignable (ongoing/finished) để hiển thị
    // đúng trạng thái đang dùng, nhưng checkbox tương ứng sẽ bị khoá (xem
    // render bên dưới), nên không gửi lại request thừa cho các season đó.
    setSelectedSeasonIds(new Set((item.seasons ?? []).map(s => s.id)));
    crud.openEdit(item, {
      tournament_id: item.tournament_id,
      name: item.name ?? DEFAULT_RULE_FORM.name,
      format: item.format ?? DEFAULT_RULE_FORM.format,
      round_robin_stages: item.round_robin_stages ?? DEFAULT_RULE_FORM.round_robin_stages,
      points_per_win: item.points_per_win,
      points_per_draw: item.points_per_draw,
      points_per_loss: item.points_per_loss,
      forfeit_score: item.forfeit_score,
      suspension_match_count: item.suspension_match_count ?? DEFAULT_RULE_FORM.suspension_match_count,
      yellow_cards_suspension: item.yellow_cards_suspension,
      fine_per_yellow_card: item.fine_per_yellow_card ?? 0,
      fine_per_red_card: item.fine_per_red_card ?? 0,
      bonus_per_goal: item.bonus_per_goal ?? 0,
      bonus_per_assist: item.bonus_per_assist ?? 0,
      max_players_per_team: item.max_players_per_team,
      min_players_per_team: item.min_players_per_team,
      teams_advance_per_group: item.teams_advance_per_group,
      tiebreaker_order: item.tiebreaker_order ?? DEFAULT_RULE_FORM.tiebreaker_order,
      is_active: item.is_active ?? true,
    });
  };

  const toggleTiebreaker = (value) => {
    crud.setForm(f => ({
      ...f,
      tiebreaker_order: f.tiebreaker_order.includes(value)
        ? f.tiebreaker_order.filter(v => v !== value)
        : [...f.tiebreaker_order, value],
    }));
  };

  const handleFormatChange = (format) => {
    crud.setForm(f => {
      const opt = getFormatOption(format);
      const rule = opt?.stagesRule ?? { type: 'min', value: 0 };
      const stages = rule.type === 'fixed'
        ? rule.value
        : Math.max(Number(f.round_robin_stages) || 0, rule.value);
      return { ...f, format, round_robin_stages: stages };
    });
  };

  // Đổi giải đấu -> danh sách season khả dụng đổi hẳn, season đã chọn theo
  // giải cũ không còn ý nghĩa gì -> xoá chọn để tránh gán nhầm sang season
  // của giải khác (dù applySeasonAssignments có tự lọc lại theo editableIds
  // nên về mặt an toàn không sao, nhưng để UI không gây hiểu lầm).
  const handleTournamentChange = (tournamentId) => {
    crud.setForm(f => ({ ...f, tournament_id: tournamentId }));
    setSelectedSeasonIds(new Set());
  };

  const currentFormatOpt = getFormatOption(crud.form?.format);
  const stagesLocked = currentFormatOpt?.stagesRule?.type === 'fixed';

  const buildPayload = () => {
    const f = crud.form;
    return {
      tournament_id: Number(f.tournament_id),
      name: (f.name || '').trim() || 'Default Rule',
      format: f.format,
      round_robin_stages: Number(f.round_robin_stages),
      points_per_win: Number(f.points_per_win),
      points_per_draw: Number(f.points_per_draw),
      points_per_loss: Number(f.points_per_loss),
      forfeit_score: Number(f.forfeit_score),
      suspension_match_count: Number(f.suspension_match_count),
      yellow_cards_suspension: Number(f.yellow_cards_suspension),
      fine_per_yellow_card: parseFloat(f.fine_per_yellow_card) || 0,
      fine_per_red_card: parseFloat(f.fine_per_red_card) || 0,
      bonus_per_goal: parseFloat(f.bonus_per_goal) || 0,
      bonus_per_assist: parseFloat(f.bonus_per_assist) || 0,
      max_players_per_team: Number(f.max_players_per_team),
      min_players_per_team: Number(f.min_players_per_team),
      teams_advance_per_group: Number(f.teams_advance_per_group),
      tiebreaker_order: f.tiebreaker_order,
      is_active: f.is_active,
    };
  };

  const validateClientSide = (payload) => {
    if (!payload.tournament_id) return 'Vui lòng chọn giải đấu.';
    if (!payload.name) return 'Vui lòng nhập tên luật.';
    if (payload.tiebreaker_order.length === 0) return 'Chọn ít nhất 1 tiêu chí phân điểm.';
    if (payload.max_players_per_team < payload.min_players_per_team) {
      return 'Số HV tối đa phải >= số HV tối thiểu.';
    }
    return validateFormatConsistency(payload.format, payload.round_robin_stages);
  };

  // Gán rule vừa create/update cho các season được chọn. CHỈ ASSIGN (không
  // hỗ trợ gỡ rule khỏi season / set null) — updateSeasonSchema định nghĩa
  // tournament_rule_id: z.number().int().positive() không nullable dù đã
  // .partial(), nên gửi null sẽ bị Zod reject. Nếu cần bỏ gán, phải sửa
  // schema BE trước.
  //
  // Chỉ gọi API cho season thực sự "mới chọn" (chưa từng gán rule này) VÀ
  // đang ở status assignable — season đã gán sẵn thì bỏ qua (tránh PATCH dư
  // thừa), season bị khoá thì checkbox đã disabled từ đầu nên về lý thuyết
  // không lọt vào đây, nhưng vẫn double-check ở đây cho chắc (không tin
  // tưởng tuyệt đối vào state UI).
  const applySeasonAssignments = async (ruleId, previouslyAssignedIds) => {
    const editableIds = new Set(
      seasonsForTournament.filter(isSeasonAssignable).map(s => s.id)
    );
    const toAssign = [...selectedSeasonIds].filter(
      id => editableIds.has(id) && !previouslyAssignedIds.has(id)
    );
    if (toAssign.length === 0) return { okCount: 0, failCount: 0 };

    const results = await Promise.allSettled(
      toAssign.map(id => seasonApi.update(id, { tournament_rule_id: ruleId }))
    );
    const failCount = results.filter(r => r.status === 'rejected').length;
    return { okCount: toAssign.length - failCount, failCount };
  };

  // ASSUMPTION cần verify với api/tournamentRuleApi.js thật:
  // update(id, payload, { force: true }) được kỳ vọng map sang query param
  // ?force=true để khớp TournamentRuleService.update(id, data, force=false).
  // Nếu client layer của bạn expose khác đi, chỉ cần sửa dòng gọi bên dưới.
  const runSave = async (payload, force) => {
    setIsSaving(true);
    crud.setFormError('');
    try {
      let ruleId;
      const previouslyAssignedIds = new Set(
        crud.modal === 'edit' ? (crud.editing?.seasons ?? []).map(s => s.id) : []
      );

      if (crud.modal === 'add') {
        const res = await tournamentRuleApi.create(payload);
        const resPayload = (typeof res?.status === 'boolean') ? res.data : res;
        ruleId = resPayload?.id ?? resPayload?.data?.id;
        toast.success('Tạo luật giải thành công!');
      } else {
        await tournamentRuleApi.update(crud.editing.id, payload, force ? { force: true } : undefined);
        ruleId = crud.editing.id;
        toast.success('Cập nhật luật giải thành công!');
      }

      if (ruleId && selectedSeasonIds.size > 0) {
        const { okCount, failCount } = await applySeasonAssignments(ruleId, previouslyAssignedIds);
        if (okCount > 0) toast.success(`Đã áp rule cho ${okCount} mùa giải.`);
        if (failCount > 0) toast.warning(`${failCount} mùa giải áp rule thất bại — có thể season vừa đổi trạng thái, vui lòng kiểm tra lại.`);
      }

      setConflict(null);
      setCurrentPage(1);
      fetchRules();
      fetchSeasonsForAssign();
      crud.closeModal();
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      const message = parseApiError(err, 'Đã có lỗi xảy ra, vui lòng thử lại.');
      if (status === 409 || code === 'CONFLICT') {
        setConflict({ message, payload });
      } else {
        crud.setFormError(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    const payload = buildPayload();
    const err = validateClientSide(payload);
    if (err) { crud.setFormError(err); return; }
    setConflict(null);
    runSave(payload, false);
  };

  const handleForceSave = () => {
    if (!conflict) return;
    runSave(conflict.payload, true);
  };

  const handleDelete = () => {
    const item = crud.deleting;
    crud.confirmDelete(async () => {
      await tournamentRuleApi.delete(item.id);
      toast.success('Xóa luật giải thành công.');
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa luật giải.');
    });
  };

  return (
    <section className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark gap-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-orange-400" /> Luật giải ({filteredItems.length})
        </h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm theo tên giải hoặc tên luật..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-navy border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
          </div>
          <button
            onClick={() => fetchRules()}
            disabled={isLoading}
            className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm luật
          </button>
        </div>
      </div>

      <div className="divide-y divide-navy-light">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1, 2].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Không tìm thấy luật giải nào phù hợp.</p>
          </div>
        ) : paginatedItems.map(item => (
          <div key={item.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-navy-light/10 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate flex items-center gap-2 flex-wrap">
                {getTournamentName(item.tournament_id)}
                <span className="text-gray-500 font-normal text-xs">— {item.name || 'Default Rule'}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  {getFormatOption(item.format)?.label ?? item.format}
                </span>
                {!item.is_active && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase">Tạm ẩn</span>
                )}
                {(item.seasons?.length ?? 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3" /> {item.seasons.length} season
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                <span className="text-xs text-gray-400">Thắng: <strong className="text-emerald-400">{item.points_per_win}pts</strong></span>
                <span className="text-xs text-gray-400">Hòa: <strong className="text-amber-400">{item.points_per_draw}pts</strong></span>
                <span className="text-xs text-gray-400">Thua: <strong className="text-red-400">{item.points_per_loss}pts</strong></span>
                <span className="text-xs text-gray-400">Max: <strong className="text-white">{item.max_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Min: <strong className="text-white">{item.min_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Thẻ vàng cấm: <strong className="text-amber-300">{item.yellow_cards_suspension}</strong></span>
                <span className="text-xs text-gray-400">Số trận cấm: <strong className="text-amber-300">{item.suspension_match_count ?? 1}</strong></span>
                <span className="text-xs text-gray-400">Vòng bảng: <strong className="text-white">{item.round_robin_stages} lượt</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => crud.setDeleting(item)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {totalPages > 1 && filteredItems.length > 0 && !isLoading && (
          <div className="mt-4 mb-2 flex justify-center">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>

      {crud.modal && (
        <AdminModal
          title={crud.modal === 'add' ? 'Thêm luật giải mới' : 'Chỉnh sửa luật giải'}
          icon={CheckCircle2} iconClass="text-orange-400"
          onClose={crud.closeModal}
          footer={<>
            <button onClick={crud.closeModal} className="px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light">Hủy</button>
            <button onClick={handleSave} disabled={isSaving || !!conflict} className="px-5 py-2 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 disabled:opacity-70">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {crud.modal === 'add' ? 'Tạo luật' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}
            </div>
          )}

          {conflict && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm px-4 py-3 rounded-lg flex flex-col gap-2">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{conflict.message}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConflict(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-navy-light border border-navy-light"
                >
                  Hủy, không đổi
                </button>
                <button
                  onClick={handleForceSave}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-70 flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Buộc cập nhật (ghi đè dữ liệu đã tính)
                </button>
              </div>
            </div>
          )}

          <div className={SECTION_LABEL}>Thông tin chung</div>
          <FormField label="Giải đấu" required>
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => handleTournamentChange(e.target.value)}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
          <FormField label="Tên luật" required>
            <input type="text" maxLength={100} className={INPUT} value={crud.form.name} onChange={e => crud.setForm(f => ({ ...f, name: e.target.value }))} />
          </FormField>

          <div className={SECTION_LABEL}>Thể thức</div>
          <FormField label="Format giải">
            <select className={INPUT} value={crud.form.format} onChange={e => handleFormatChange(e.target.value)}>
              {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={`Số lượt vòng bảng${stagesLocked ? ' (cố định theo format)' : ''}`}>
            <input
              type="number"
              min={currentFormatOpt?.stagesRule?.type === 'min' ? currentFormatOpt.stagesRule.value : 0}
              disabled={stagesLocked}
              className={`${INPUT} ${stagesLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              value={crud.form.round_robin_stages}
              onChange={e => crud.setForm(f => ({ ...f, round_robin_stages: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {currentFormatOpt?.hint}
            </p>
          </FormField>

          <div className={SECTION_LABEL}>Điểm số & Kỷ luật</div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Thắng (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_win} onChange={e => crud.setForm(f => ({ ...f, points_per_win: e.target.value }))} />
            </FormField>
            <FormField label="Hòa (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_draw} onChange={e => crud.setForm(f => ({ ...f, points_per_draw: e.target.value }))} />
            </FormField>
            <FormField label="Thua (pts)">
              <input type="number" min="0" max="10" className={INPUT} value={crud.form.points_per_loss} onChange={e => crud.setForm(f => ({ ...f, points_per_loss: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Thẻ vàng cấm thi đấu (số thẻ)">
              <input type="number" min="1" max="10" className={INPUT} value={crud.form.yellow_cards_suspension} onChange={e => crud.setForm(f => ({ ...f, yellow_cards_suspension: e.target.value }))} />
            </FormField>
            <FormField label="Số trận bị cấm">
              <input type="number" min="1" max="20" className={INPUT} value={crud.form.suspension_match_count} onChange={e => crud.setForm(f => ({ ...f, suspension_match_count: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phạt tiền / thẻ vàng">
              <input type="number" min="0" step="1000" className={INPUT} value={crud.form.fine_per_yellow_card} onChange={e => crud.setForm(f => ({ ...f, fine_per_yellow_card: e.target.value }))} />
            </FormField>
            <FormField label="Phạt tiền / thẻ đỏ">
              <input type="number" min="0" step="1000" className={INPUT} value={crud.form.fine_per_red_card} onChange={e => crud.setForm(f => ({ ...f, fine_per_red_card: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Thưởng / bàn thắng">
              <input type="number" min="0" step="1000" className={INPUT} value={crud.form.bonus_per_goal} onChange={e => crud.setForm(f => ({ ...f, bonus_per_goal: e.target.value }))} />
            </FormField>
            <FormField label="Thưởng / kiến tạo">
              <input type="number" min="0" step="1000" className={INPUT} value={crud.form.bonus_per_assist} onChange={e => crud.setForm(f => ({ ...f, bonus_per_assist: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Điểm xử thua bỏ cuộc (forfeit)">
            <input type="number" min="0" max="20" className={INPUT} value={crud.form.forfeit_score} onChange={e => crud.setForm(f => ({ ...f, forfeit_score: e.target.value }))} />
          </FormField>

          <div className={SECTION_LABEL}>Quân số & Bảng đấu</div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Max HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.max_players_per_team} onChange={e => crud.setForm(f => ({ ...f, max_players_per_team: e.target.value }))} />
            </FormField>
            <FormField label="Min HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.min_players_per_team} onChange={e => crud.setForm(f => ({ ...f, min_players_per_team: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Đội đi tiếp/Bảng">
            <input type="number" min="1" className={INPUT} value={crud.form.teams_advance_per_group} onChange={e => crud.setForm(f => ({ ...f, teams_advance_per_group: e.target.value }))} />
          </FormField>

          <div className={SECTION_LABEL}>Tiêu chí phân định</div>
          <FormField label="Tiêu chí phân điểm (chọn ít nhất 1, đúng thứ tự ưu tiên)" required>
            <div className="flex flex-wrap gap-2 mt-1">
              {TIEBREAKER_OPTIONS.map(opt => {
                const idx = crud.form.tiebreaker_order.indexOf(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleTiebreaker(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${idx !== -1
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                  >
                    {idx !== -1 && (
                      <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">{idx + 1}</span>
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {crud.form.tiebreaker_order.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Thứ tự ưu tiên: {crud.form.tiebreaker_order.map(v => TIEBREAKER_OPTIONS.find(o => o.value === v)?.label ?? v).join(' → ')}
              </p>
            )}
          </FormField>

          <div className={SECTION_LABEL}>Áp dụng cho mùa giải</div>
          <FormField label={crud.form.tournament_id ? `Chọn season của "${getTournamentName(Number(crud.form.tournament_id))}" để áp rule này` : 'Chọn giải đấu trước'}>
            {!crud.form.tournament_id ? (
              <p className="text-xs text-gray-500 italic">Chưa chọn giải đấu.</p>
            ) : seasonsForTournament.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Giải đấu này chưa có mùa giải nào.</p>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto border border-navy-light rounded-lg p-2 bg-navy-dark/40">
                {seasonsForTournament.map(s => {
                  const assignable = isSeasonAssignable(s);
                  const checked = selectedSeasonIds.has(s.id);
                  const sm = SEASON_STATUS_META[s.status] ?? SEASON_STATUS_META.upcoming;
                  const alreadyThisRule = crud.modal === 'edit' && (crud.editing?.seasons ?? []).some(x => x.id === s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${assignable ? 'cursor-pointer hover:bg-navy-light/30' : 'opacity-50 cursor-not-allowed'}`}
                      title={assignable ? undefined : `Không thể gán — season đang "${sm.label}"`}
                    >
                      <input
                        type="checkbox"
                        disabled={!assignable}
                        checked={checked}
                        onChange={() => assignable && toggleSeasonSelection(s.id)}
                        className="accent-orange-500 shrink-0"
                      />
                      <span className="text-white flex-1 truncate">{s.name}</span>
                      {alreadyThisRule && (
                        <span className="text-[10px] font-bold text-emerald-400 shrink-0">Đang dùng rule này</span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${sm.cls}`}>{sm.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Chỉ gán được cho season đang "Sắp diễn ra" / "Mở đăng ký". Season đã ongoing/finished/cancelled bị khoá cứng (đổi rule sẽ làm lệch standings/stats đã tính) — tạo TournamentRule mới cho season sau thay vì sửa/gán rule cũ vào đó.
            </p>
          </FormField>

          <div className="flex items-center gap-3 py-2">
            <label className="flex items-center cursor-pointer gap-3">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={crud.form.is_active} onChange={e => crud.setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
              <span className="text-sm font-bold text-gray-300">Trạng thái hoạt động</span>
            </label>
          </div>
        </AdminModal>
      )}

      {crud.deleting && (
        <ConfirmDeleteModal
          title="Xóa luật giải?"
          message={`Xóa luật giải của "${getTournamentName(crud.deleting.tournament_id)}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDelete}
          onCancel={() => crud.setDeleting(null)}
          isDeleting={crud.isDeleting}
        />
      )}
    </section>
  );
}