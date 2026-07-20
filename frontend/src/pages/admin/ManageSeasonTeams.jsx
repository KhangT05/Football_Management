import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, Calendar, Trophy, Plus, CheckCircle2, XCircle,
  Trash2, RefreshCw, AlertTriangle, Loader2, Save, Dices,
  Eraser, Edit, Filter, X, ChevronDown, TrendingUp, ChevronLeft, ChevronRight,
  Search, Shirt, Info
} from 'lucide-react';
import { seasonTeamApi, teamApi, userApi, roleApi, seasonApi } from '../../api';
import { useApiQuery, useApiMutation, useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useSeasonStore from '../../store/seasonStore';
import useAdminUIStore from '../../store/adminUIStore';
import { useShallow } from 'zustand/react/shallow';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import GroupDrawUI from '../../components/admin/GroupDrawUI';
import KnockoutUI from '../../components/admin/KnockoutUI';
import ManageJerseysModal from '../../components/admin/ManageJerseysModal';
import StatusBadge from '../../components/ui/StatusBadge';
import SeasonTeamRow from '../../components/admin/SeasonTeamRow';
import { INPUT, BTN_PRIMARY, BTN_SECONDARY, BTN_ICON } from '../../utils/adminStyles';
import Pagination from '../../components/ui/Pagination';
// Dùng CHUNG 1 nguồn duy nhất cho việc parse lỗi API ra message hiển thị —
// KHÔNG tự viết lại isLikelyVietnameseMessage/getFriendlyErrorMessage ở đây
// nữa (bản cũ bị duplicate logic với utils/errorHelper.js, dễ lệch nhau khi
// 1 trong 2 chỗ được sửa mà chỗ kia quên sửa theo).
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'active', label: 'Đang tham gia' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'withdrawn', label: 'Đã rút' },
];

const STATS_CARDS = [
  { label: 'Tổng số', statusKey: null, icon: Users, color: 'blue' },
  { label: 'Chờ duyệt', statusKey: 'pending', icon: Calendar, color: 'amber' },
  { label: 'Đã duyệt', statusKey: 'approved', icon: CheckCircle2, color: 'emerald' },
  { label: 'Hoạt động', statusKey: 'active', icon: TrendingUp, color: 'sky' },
  { label: 'Từ chối', statusKey: 'rejected', icon: XCircle, color: 'red' },
  { label: 'Đã rút', statusKey: 'withdrawn', icon: X, color: 'gray' },
];

const SEASON_STATUS_COLORS = {
  registration_open: 'text-emerald-400',
  ongoing: 'text-red-400',
  finished: 'text-gray-400',
  upcoming: 'text-amber-400',
  cancelled: 'text-gray-500',
};

// FIX (ẩn tab Bốc thăm/Knockout theo thể thức thực sự của season): khớp
// SeasonFormat enum (Prisma) + FORMAT_META trong TournamentWizardModal.
//   round_robin                 -> chỉ có vòng bảng, KHÔNG có knockout
//   knockout                    -> chỉ có knockout, KHÔNG có vòng bảng
//   round_robin_knockout        -> có cả 2
//   multi_round_robin_knockout  -> có cả 2
// Trước đây 2 tab "Bốc thăm chia bảng" và "Vòng Knockout" LUÔN hiện bất kể
// rule của season là gì — với season thuần round_robin, tab Knockout vẫn
// cho vào, GroupDrawUI/KnockoutUI vẫn cho bấm "tạo" và chỉ bị BE từ chối ở
// bước generate/tạo phase (validateFormatConsistency phía BE), khiến admin
// tưởng bug UI. Ngược lại season thuần knockout thì tab "Bốc thăm chia bảng"
// vĩnh viễn hiện "Chưa có vòng đấu" vì round_robin phase không bao giờ được
// tạo cho thể thức này.
const FORMAT_PHASE_META = {
  round_robin: { hasGroupPhase: true, hasKnockout: false },
  knockout: { hasGroupPhase: false, hasKnockout: true },
  round_robin_knockout: { hasGroupPhase: true, hasKnockout: true },
  multi_round_robin_knockout: { hasGroupPhase: true, hasKnockout: true },
};

const FORMAT_LABEL = {
  round_robin: 'Vòng tròn',
  knockout: 'Loại trực tiếp',
  round_robin_knockout: 'Vòng bảng → Loại trực tiếp',
  multi_round_robin_knockout: 'Nhiều vòng bảng → Loại trực tiếp',
};

const extractRuleFormat = (seasonLike) => seasonLike?.tournamentRule?.format ?? null;

export default function ManageSeasonTeams() {
  const toast = useToastStore(useShallow(state => ({
    success: state.success,
    error: state.error,
    warning: state.warning,
    info: state.info,
    apiError: state.apiError
  })));
  const [activeTab, setActiveTab] = useState('teams');

  const { seasons, fetchAll: fetchSeasons } = useSeasonStore();

  const { seasonTeamFilters, setSeasonTeamFilters } = useAdminUIStore(useShallow(state => ({
    seasonTeamFilters: state.seasonTeamFilters,
    setSeasonTeamFilters: state.setSeasonTeamFilters,
  })));
  const { selectedSeason, filterStatus, filterSeasonStatus } = seasonTeamFilters;

  const setSelectedSeason = (val) => setSeasonTeamFilters({ selectedSeason: val });
  const setFilterStatus = (val) => setSeasonTeamFilters({ filterStatus: val });
  const setFilterSeasonStatus = (val) => setSeasonTeamFilters({ filterSeasonStatus: val });

  useEffect(() => {
    fetchSeasons({ per_page: 100, sort: 'id', direction: 'desc' }).catch(err => {
      toast.error(getFriendlyErrorMessage(err, 'Không tải được danh sách mùa giải.'));
    });
  }, [fetchSeasons]);

  const filteredSeasons = useMemo(() => {
    if (!filterSeasonStatus) return seasons;
    return seasons.filter(s => s.status === filterSeasonStatus);
  }, [seasons, filterSeasonStatus]);

  const { data: allSeasonTeams, isLoading: loadingTeams, fetch: fetchSeasonTeams } = useApiQuery(
    (params) => seasonTeamApi.getAll(params),
    { autoFetch: false, perPage: 200 }
  );

  const reloadTeams = useCallback(() => {
    const params = selectedSeason
      ? { season_id: selectedSeason, per_page: 500, sort: 'id', direction: 'asc' }
      : { per_page: 500, sort: 'id', direction: 'asc' };
    fetchSeasonTeams(params).catch(err => {
      toast.error(getFriendlyErrorMessage(err, 'Không tải được danh sách đội đăng ký.'));
    });
  }, [selectedSeason, fetchSeasonTeams]);

  useEffect(() => { reloadTeams(); }, [reloadTeams, selectedSeason]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const seasonTeams = useMemo(() => {
    let filtered = allSeasonTeams;
    if (selectedSeason) {
      filtered = filtered.filter(st => String(st.season_id) === String(selectedSeason));
    }
    if (filterStatus) {
      filtered = filtered.filter(st => st.status === filterStatus);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(st => st.team?.name?.toLowerCase().includes(lower));
    }
    return [...filtered].sort((a, b) => {
      const nameA = a.team?.name || '';
      const nameB = b.team?.name || '';
      const cmp = nameA.localeCompare(nameB);
      return cmp !== 0 ? cmp : a.id - b.id;
    });
  }, [allSeasonTeams, selectedSeason, filterStatus, debouncedSearch]);

  // ── Group theo team TRƯỚC khi paginate ─────────────────────
  // Đơn vị pagination là "team", không phải "row". Group không bao giờ bị
  // cắt ngang giữa 2 trang -> groupSizeMap không còn là "đếm theo trang hiện
  // tại" nữa, mà là con số thật, không có edge case nào bị mất chính xác.
  const groupedTeams = useMemo(() => {
    const map = new Map();
    seasonTeams.forEach(st => {
      const tid = st.team?.id ?? `noteam-${st.id}`;
      if (!map.has(tid)) map.set(tid, []);
      map.get(tid).push(st);
    });
    return Array.from(map.values());
  }, [seasonTeams]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // = số TEAM/trang, không phải số row

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [filterStatus, selectedSeason, debouncedSearch]);

  const totalPages = Math.ceil(groupedTeams.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedGroups = groupedTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  const paginatedTeams = paginatedGroups.flat();

  const stats = useMemo(() => {
    let base = allSeasonTeams;
    if (selectedSeason) {
      base = base.filter(st => String(st.season_id) === String(selectedSeason));
    }
    return {
      total: base.length,
      pending: base.filter(s => s.status === 'pending').length,
      approved: base.filter(s => s.status === 'approved').length,
      active: base.filter(s => s.status === 'active').length,
      rejected: base.filter(s => s.status === 'rejected').length,
      withdrawn: base.filter(s => s.status === 'withdrawn').length,
    };
  }, [allSeasonTeams, selectedSeason]);

  const statValueMap = {
    'Tổng số': stats.total,
    'Chờ duyệt': stats.pending,
    'Đã duyệt': stats.approved,
    'Hoạt động': stats.active,
    'Từ chối': stats.rejected,
    'Đã rút': stats.withdrawn,
  };

  const statusMutation = useApiMutation();
  const handleUpdateStatus = (id, newStatus) => {
    const st = allSeasonTeams.find(s => s.id === id);
    statusMutation.mutate(async () => {
      if (newStatus === 'approved') {
        await seasonTeamApi.approve(id);
      } else if (newStatus === 'rejected') {
        await seasonTeamApi.delete(id);
      } else {
        await seasonTeamApi.updateStatus(id, { status: newStatus });
      }

      // Auto-cấp quyền Leader khi duyệt team — best-effort, KHÔNG được để
      // fail bước này làm người dùng tưởng cả thao tác duyệt đội thất bại.
      // Nhưng cũng không được nuốt lỗi hoàn toàn (console.error cũ) vì admin
      // cần biết để cấp quyền thủ công — nếu không, leader sẽ không đăng
      // nhập/thao tác được mà không ai biết tại sao.
      if (newStatus === 'approved' && st?.user_id) {
        try {
          const rolesRes = await roleApi.getRoles();
          const rPayload = (typeof rolesRes?.status === 'boolean') ? rolesRes.data : rolesRes;
          const roles = Array.isArray(rPayload?.data) ? rPayload.data : Array.isArray(rPayload) ? rPayload : [];

          const leaderRole = roles.find(r => ['leader', 'đội trưởng', 'doitruong'].includes(r.name.toLowerCase()));

          if (leaderRole) {
            const userRes = await userApi.getUserById(st.user_id);
            const uPayload = (typeof userRes?.status === 'boolean') ? userRes.data : userRes;
            const user = uPayload?.data || uPayload;

            const currentRoleIds = user?.roles?.map(r => r.id) || [];

            if (!currentRoleIds.includes(leaderRole.id)) {
              await userApi.updateProfile(st.team.user_id, { role_ids: [...currentRoleIds, leaderRole.id] });
              toast.success(`Đã tự động cấp quyền Đội trưởng cho user đăng ký.`);
            }
          }
        } catch (e) {
          toast.warning(getFriendlyErrorMessage(
            e,
            'Duyệt đội thành công, nhưng cấp quyền Đội trưởng tự động cho user thất bại — vui lòng vào Quản lý người dùng để cấp quyền thủ công.'
          ));
        }
      }

      toast.success(`Đã cập nhật trạng thái thành "${newStatus}"!`);
      reloadTeams();
    }).catch(err => toast.error(getFriendlyErrorMessage(err, 'Lỗi khi cập nhật trạng thái đội, vui lòng thử lại.')));
  };

  const deleteMutation = useApiMutation();
  const [deletingId, setDeletingId] = useState(null);
  const [jerseyModalTeam, setJerseyModalTeam] = useState(null);
  const confirmDelete = () => {
    deleteMutation.mutate(async () => {
      await seasonTeamApi.delete(deletingId);
      toast.success('Đã xóa đội khỏi mùa giải.');
      setDeletingId(null);
      reloadTeams();
    }).catch(err => toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa đội khỏi mùa giải, vui lòng thử lại.')));
  };

  const [allTeams, setAllTeams] = useState([]);
  const addTeamModal = useCrudModal({ emptyForm: { team_id: '', season_id: '' } });

  const openAddTeam = () => {
    if (allTeams.length === 0) {
      teamApi.getTeams({ per_page: 200 }).then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        setAllTeams(Array.isArray(payload?.data) ? payload.data : []);
      }).catch(err => {
        toast.error(getFriendlyErrorMessage(err, 'Không tải được danh sách đội bóng để thêm vào mùa giải.'));
      });
    }
    addTeamModal.openAdd({ team_id: '', season_id: selectedSeason || '' });
  };

  const handleAddTeam = () => {
    const errors = [];
    if (!addTeamModal.form.season_id) errors.push('Vui lòng chọn mùa giải.');
    if (!addTeamModal.form.team_id) errors.push('Vui lòng chọn đội bóng.');

    if (errors.length > 0) {
      toast.warning(errors.length === 1 ? errors[0] : 'Vui lòng kiểm tra lại thông tin:', { details: errors.length > 1 ? errors : undefined });
      addTeamModal.setFormError(errors.length === 1 ? errors[0] : 'Có một số lỗi cần khắc phục, vui lòng xem thông báo.');
      return;
    }

    addTeamModal.save(async () => {
      await seasonTeamApi.adminAdd({
        season_id: Number(addTeamModal.form.season_id),
        team_id: Number(addTeamModal.form.team_id),
        status: 'approved',
      });
      toast.success('Đã thêm đội vào mùa giải!');
      reloadTeams();
    }).catch(err => {
      const msg = getFriendlyErrorMessage(
        err,
        'Không thể thêm đội — nguyên nhân có thể là: đội đã đăng ký mùa giải này, mùa giải đã đóng đăng ký/hết slot, hoặc đội có cầu thủ trùng với 1 đội khác đã đăng ký mùa giải này.'
      );
      addTeamModal.setFormError(msg);
      toast.error(msg);
    });
  };

  const assignModal = useCrudModal({ emptyForm: { group_id: '' } });
  const openAssignGroup = (st) => assignModal.openEdit(st, { group_id: st.group_id || '' });
  const handleAssign = () => {
    const errors = [];
    if (!assignModal.form.group_id) errors.push('Vui lòng nhập ID bảng!');

    if (errors.length > 0) {
      toast.warning(errors.length === 1 ? errors[0] : 'Vui lòng kiểm tra lại thông tin:', { details: errors.length > 1 ? errors : undefined });
      assignModal.setFormError(errors.length === 1 ? errors[0] : 'Có một số lỗi cần khắc phục, vui lòng xem thông báo.');
      return;
    }

    assignModal.save(async () => {
      await seasonTeamApi.assignGroup(assignModal.editing.id, { group_id: Number(assignModal.form.group_id) });
      toast.success('Đã xếp đội vào bảng thủ công!');
      reloadTeams();
    }).catch(err => {
      const msg = getFriendlyErrorMessage(err, 'Lỗi khi xếp đội vào bảng — kiểm tra lại ID bảng có tồn tại và thuộc đúng mùa giải không.');
      assignModal.setFormError(msg);
      toast.error(msg);
    });
  };

  const transferModal = useCrudModal({ emptyForm: { target_season_id: '' } });
  const openTransferTeam = (st) => {
    transferModal.openEdit(st, { target_season_id: '' });
  };
  const handleTransferTeam = () => {
    const errors = [];
    if (!transferModal.form.target_season_id) errors.push('Vui lòng chọn mùa giải đích.');

    if (errors.length > 0) {
      toast.warning(errors.length === 1 ? errors[0] : 'Vui lòng kiểm tra lại thông tin:', { details: errors.length > 1 ? errors : undefined });
      transferModal.setFormError(errors.length === 1 ? errors[0] : 'Có một số lỗi cần khắc phục, vui lòng xem thông báo.');
      return;
    }

    transferModal.save(async () => {
      await seasonTeamApi.transferSeason(transferModal.editing.id, { season_id: Number(transferModal.form.target_season_id) });
      toast.success('Đã chuyển đội sang mùa giải mới!');
      reloadTeams();
    }).catch(err => {
      const msg = getFriendlyErrorMessage(
        err,
        'Không thể chuyển đội — nguyên nhân có thể là: đội đã được xếp bảng (phải gỡ bảng trước), mùa giải đích đã đóng đăng ký/hết slot, hoặc đội có cầu thủ trùng với 1 đội khác đã ở mùa giải đích.'
      );
      transferModal.setFormError(msg);
      toast.error(msg);
    });
  };

  const selectedSeasonObj = seasons.find(s => String(s.id) === String(selectedSeason));

  // FIX: format của rule quyết định season đó có vòng bảng / knockout hay
  // không — xem giải thích ở FORMAT_PHASE_META phía trên.
  //
  // Nguồn ưu tiên 1: season object trong store `seasons` (nếu BE đã include
  // sẵn tournamentRule khi list). Nếu chưa có (embeddedFormat null) thì
  // fetch riêng seasonApi.getById(seasonId) một lần và cache theo seasonId
  // — tránh gọi lại API mỗi lần re-render, và tránh phải sửa seasonStore
  // hiện có (không biết chắc BE list API có include relation hay không).
  const embeddedFormat = extractRuleFormat(selectedSeasonObj);
  const [seasonFormatCache, setSeasonFormatCache] = useState({});

  useEffect(() => {
    if (!selectedSeason) return;
    if (embeddedFormat) return; // đã có sẵn từ seasons store, khỏi fetch thêm
    if (Object.prototype.hasOwnProperty.call(seasonFormatCache, selectedSeason)) return; // đã fetch (kể cả fail -> null)

    let cancelled = false;
    seasonApi.getById(selectedSeason)
      .then(res => {
        if (cancelled) return;
        const payload = typeof res?.status === 'boolean' ? res.data : res;
        setSeasonFormatCache(prev => ({ ...prev, [selectedSeason]: extractRuleFormat(payload) }));
      })
      .catch(err => {
        console.error('[ManageSeasonTeams] Không tải được thể thức (rule.format) của season:', err);
        if (!cancelled) setSeasonFormatCache(prev => ({ ...prev, [selectedSeason]: null }));
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason, embeddedFormat]);

  // seasonFormat === null/undefined (chưa xác định được, do lỗi tải hoặc
  // chưa gán rule) -> KHÔNG ẩn tab nào cả (an toàn, giữ hành vi cũ) thay vì
  // đoán sai và ẩn nhầm 1 tính năng hợp lệ.
  const seasonFormat = embeddedFormat ?? seasonFormatCache[selectedSeason] ?? null;
  const formatMeta = seasonFormat ? FORMAT_PHASE_META[seasonFormat] : null;
  const showDrawTab = !selectedSeason || !formatMeta || formatMeta.hasGroupPhase;
  const showKnockoutTab = !selectedSeason || !formatMeta || formatMeta.hasKnockout;

  // Nếu đang đứng ở tab mà season vừa chọn không hỗ trợ (VD: đang ở tab
  // Knockout rồi đổi sang 1 season thuần round_robin) -> tự động lùi về
  // tab "Danh sách đội đăng ký" thay vì để trống nội dung hoặc giữ nguyên
  // tab đã bị ẩn nút bấm nhưng nội dung vẫn render ngầm.
  useEffect(() => {
    if (activeTab === 'draw' && !showDrawTab) setActiveTab('teams');
    else if (activeTab === 'knockout' && !showKnockoutTab) setActiveTab('teams');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDrawTab, showKnockoutTab]);

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in pb-20">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" /> Quản lý Mùa giải & Bốc thăm
            </h2>
            <p className="text-gray-400 text-sm mt-1">Duyệt đội đăng ký và tiến hành chia bảng ngẫu nhiên.</p>
          </div>

          <div className="flex flex-col gap-2 min-w-65">
            <div className="flex gap-1.5 flex-wrap">
              {[
                { value: '', label: 'Tất cả' },
                { value: 'registration_open', label: 'Mở Đăng Kí' },
                { value: 'ongoing', label: 'Đang diễn Sắp' },
                { value: 'upcoming', label: 'Sắp diễn ra' },
                { value: 'finished', label: 'Kết thúc' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterSeasonStatus(opt.value); setSelectedSeason(''); }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${filterSeasonStatus === opt.value
                    ? 'bg-neon/10 border-neon/40 text-neon'
                    : 'bg-navy border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                className="w-full bg-navy border border-navy-light rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-neon focus:ring-1 focus:ring-neon/20 text-sm appearance-none cursor-pointer transition-all shadow-md shadow-black/15"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                <option value="">-- Chọn mùa giải --</option>
                {filteredSeasons.map(s => {
                  const statusLabel = { registration_open: 'Mở', ongoing: 'Đang diễn', finished: 'Kết thúc', upcoming: 'Sắp tới', cancelled: 'Đã hủy' }[s.status] ?? s.status;
                  return <option key={s.id} value={s.id}>{s.name} ({statusLabel})</option>;
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {selectedSeasonObj && (
              <div className={`text-xs font-bold flex items-center gap-1.5 ${SEASON_STATUS_COLORS[selectedSeasonObj.status] ?? 'text-gray-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {selectedSeasonObj.name} — {selectedSeasonObj.status}
              </div>
            )}

            {/* FIX: hiện rõ thể thức của season đang chọn — giải thích lý do
                1 trong 2 tab Bốc thăm/Knockout có thể không xuất hiện, thay
                vì để admin tự hỏi "tab biến đâu mất". */}
            {selectedSeason && seasonFormat && (
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <Info className="w-3 h-3 shrink-0" />
                Thể thức: <span className="text-gray-300 font-semibold">{FORMAT_LABEL[seasonFormat] ?? seasonFormat}</span>
              </div>
            )}
          </div>
        </div>

        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STATS_CARDS.map(({ label, statusKey, color, icon }) => {
              const CardIcon = icon;
              return (
                <div
                  key={label}
                  onClick={() => {
                    if (statusKey === null) { setFilterStatus(''); return; }
                    setFilterStatus(prev => prev === statusKey ? '' : statusKey);
                  }}
                  className={`bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/15 hover:border-${color}-500/40 transition-all cursor-pointer group ${filterStatus === statusKey ? `border-${color}-500/60 ring-1 ring-${color}-500/30` : ''}`}
                >
                  <div className={`text-2xl font-black text-${color}-400 group-hover:scale-110 transition-transform`}>{statValueMap[label]}</div>
                  <div className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                    <CardIcon className={`w-3 h-3 text-${color}-400`} />
                    {label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 border-b border-navy-light">
            <button
              className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'teams' ? 'border-neon text-neon' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('teams')}
            >
              Danh sách đội đăng ký
            </button>
            {/* FIX: chỉ hiện khi season chưa chọn (chưa biết rule) hoặc rule
                của season có vòng bảng (round_robin / *_knockout). Season
                thuần 'knockout' sẽ không có nút này — round_robin phase
                không bao giờ tồn tại cho thể thức đó. */}
            {showDrawTab && (
              <button
                className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'draw' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('draw')}
              >
                <Dices className="w-4 h-4" /> Bốc thăm chia bảng
              </button>
            )}
            {/* FIX: tương tự — ẩn khi season thuần 'round_robin' (không bao
                giờ có knockout phase). */}
            {showKnockoutTab && (
              <button
                className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'knockout' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('knockout')}
              >
                <Trophy className="w-4 h-4" /> Vòng Knockout
              </button>
            )}
          </div>

          {activeTab === 'teams' && (
            <div className="bg-navy border border-navy-light rounded-2xl shadow-xl shadow-black/20 overflow-hidden">

              <div className="p-4 border-b border-navy-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-navy-dark">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Danh sách ({seasonTeams.length}
                  {filterStatus && <span className="text-gray-400"> / {allSeasonTeams.length}</span>})
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm đội bóng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-navy border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                    />
                  </div>
                  <div className="relative w-full sm:w-auto shrink-0">
                    <select
                      className="w-full sm:w-auto bg-navy border border-navy-light rounded-lg pl-8 pr-8 py-2 text-white font-bold outline-none focus:border-neon text-sm appearance-none cursor-pointer"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {filterStatus && (
                    <button onClick={() => setFilterStatus('')} className="p-2 rounded-lg text-gray-400 hover:text-white border border-navy-light hover:border-gray-500 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={reloadTeams} disabled={loadingTeams} className={BTN_ICON}>
                    <RefreshCw className={`w-4 h-4 ${loadingTeams ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={openAddTeam} className={BTN_PRIMARY}>
                    <Plus className="w-4 h-4" /> Thêm đội
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap min-w-full">
                  <thead>
                    <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6 w-16 text-center">ID</th>
                      <th className="py-4 px-6 w-auto">Đội bóng</th>
                      {!selectedSeason && <th className="py-4 px-6 w-48">Mùa giải</th>}
                      <th className="py-4 px-6 w-32 text-center">Trạng thái</th>
                      <th className="py-4 px-6 w-24 text-center">Duyệt</th>
                      <th className="py-4 px-6 w-40 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-light/50">
                    {loadingTeams ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i}>
                          {[1, 2, 3, 4, 5, ...(selectedSeason ? [] : [6, 7])].map(j => (
                            <td key={j} className="py-4 px-6"><div className="skeleton h-5 w-full rounded" /></td>
                          ))}
                        </tr>
                      ))
                    ) : seasonTeams.length === 0 ? (
                      <tr>
                        <td colSpan={selectedSeason ? 5 : 7} className="py-16 text-center text-gray-500">
                          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="font-semibold">{filterStatus ? 'Không có đội nào với trạng thái này' : 'Chưa có đội nào đăng ký'}</p>
                          {filterStatus && (
                            <button onClick={() => setFilterStatus('')} className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline">
                              Xóa bộ lọc
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      paginatedTeams.map(st => (
                        <SeasonTeamRow
                          key={st.id}
                          seasonTeam={st}
                          seasons={seasons}
                          hideSeason={!!selectedSeason}
                          onUpdateStatus={handleUpdateStatus}
                          onDeleteRequest={setDeletingId}
                          onAssignGroup={openAssignGroup}
                          onTransfer={openTransferTeam}
                          onManageJerseys={setJerseyModalTeam}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsLabel="đội"
                  />
                </div>
              )}

            </div>
          )}

          {/* FIX: guard thêm showDrawTab/showKnockoutTab phòng trường hợp
              activeTab còn "kẹt" ở tab vừa bị ẩn trong đúng 1 khung render
              trước khi useEffect kịp chạy setActiveTab('teams') — tránh
              render nhầm 1 tab đáng lẽ không tồn tại với season hiện tại. */}
          {activeTab === 'draw' && showDrawTab && (
            <GroupDrawUI seasonId={selectedSeason ? Number(selectedSeason) : null} />
          )}
          {activeTab === 'knockout' && showKnockoutTab && (
            <KnockoutUI seasonId={selectedSeason} />
          )}

        </>
      </div>

      {addTeamModal.modal && (
        <AdminModal
          title="Thêm đội vào mùa giải"
          icon={Plus} iconClass="text-emerald-400"
          onClose={addTeamModal.closeModal}
          footer={<>
            <button onClick={addTeamModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleAddTeam} disabled={addTeamModal.isSaving} className={BTN_PRIMARY}>
              {addTeamModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Thêm đội
            </button>
          </>}
        >
          {addTeamModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{addTeamModal.formError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Chọn mùa giải <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={addTeamModal.form.season_id}
                  onChange={e => addTeamModal.setForm({ ...addTeamModal.form, season_id: e.target.value })}
                  className={INPUT}
                >
                  <option value="">-- Chọn mùa giải --</option>
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Chọn đội bóng <span className="text-red-400">*</span>
              </label>
              <select
                className={INPUT}
                value={addTeamModal.form.team_id}
                onChange={e => addTeamModal.setForm({ ...addTeamModal.form, team_id: e.target.value })}
              >
                <option value="">-- Chọn một đội --</option>
                {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </AdminModal>
      )}

      {assignModal.modal && (
        <AdminModal
          title="Xếp bảng thủ công"
          icon={Edit} iconClass="text-blue-400"
          onClose={assignModal.closeModal}
          footer={<>
            <button onClick={assignModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleAssign} disabled={assignModal.isSaving} className="flex items-center gap-2 px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[.98] disabled:opacity-70">
              {assignModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </>}
        >
          {assignModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{assignModal.formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Group ID <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className={INPUT}
              placeholder="VD: 12"
              value={assignModal.form.group_id}
              onChange={e => assignModal.setForm({ group_id: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Đội <strong className="text-white">{assignModal.editing?.team?.name}</strong> sẽ được xếp vào bảng mang ID này.
            </p>
          </div>
        </AdminModal>
      )}

      {transferModal.modal && (
        <AdminModal
          title="Chuyển mùa giải"
          icon={RefreshCw} iconClass="text-purple-400"
          onClose={transferModal.closeModal}
          footer={<>
            <button onClick={transferModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleTransferTeam} disabled={transferModal.isSaving} className="flex items-center gap-2 px-6 py-2.5 font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all active:scale-[.98] disabled:opacity-70">
              {transferModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Xác nhận chuyển
            </button>
          </>}
        >
          {transferModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{transferModal.formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Mùa giải đích <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={transferModal.form.target_season_id}
                onChange={e => transferModal.setForm({ target_season_id: e.target.value })}
                className={INPUT}
              >
                <option value="">-- Chọn mùa giải --</option>
                {seasons.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id === transferModal.editing?.season_id}>
                    {s.name} - {s.status} {s.id === transferModal.editing?.season_id ? '(Hiện tại)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Đội <strong className="text-white">{transferModal.editing?.team?.name}</strong> sẽ được chuyển khỏi mùa giải hiện tại và sang mùa giải này với trạng thái Chờ duyệt.
            </p>
          </div>
        </AdminModal>
      )}

      {deletingId && (
        <ConfirmModal
          title="Xác nhận xóa?"
          message={`Xóa đội <strong class="text-white">#${deletingId}</strong> khỏi mùa giải hiện tại?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={deleteMutation.isLoading}
        />
      )}
      <ManageJerseysModal
        isOpen={!!jerseyModalTeam}
        onClose={() => setJerseyModalTeam(null)}
        seasonTeam={jerseyModalTeam}
      />

    </AdminLayout>
  );
}