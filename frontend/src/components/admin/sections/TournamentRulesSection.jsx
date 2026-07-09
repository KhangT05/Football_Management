import { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Edit, Trash2, Save, Loader2, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { tournamentApi, tournamentRuleApi } from '../../../api';
import { useApiQuery, useCrudModal } from '../../../hooks';
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

const DEFAULT_RULE_FORM = {
  tournament_id: '',
  points_per_win: 3,
  points_per_draw: 1,
  points_per_loss: 0,
  forfeit_score: 3,
  yellow_cards_suspension: 3,
  max_players_per_team: 25,
  min_players_per_team: 11,
  teams_advance_per_group: 2,
  tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head'],
  is_active: true,
};

export default function TournamentRulesSection() {
  const toast = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: items, isLoading, fetch: fetchRules } = useApiQuery(
    (params) => tournamentRuleApi.getAll(params),
    {
      autoFetch: true,
      errorMsg: 'Không tải được dữ liệu luật giải.'
    }
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
    return tournamentName.includes(lowerSearch);
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

  // getTournamentName cần được khai báo TRƯỚC khi dùng trong filteredItems, 
  // nên đã di chuyển nó lên trên ở logic thực tế. Ghi đè lại để an toàn.

  const openAdd = () => crud.openAdd({ ...DEFAULT_RULE_FORM, tournament_id: tournaments[0]?.id ?? '' });
  const openEdit = (item) => crud.openEdit(item, {
    tournament_id: item.tournament_id,
    points_per_win: item.points_per_win,
    points_per_draw: item.points_per_draw,
    points_per_loss: item.points_per_loss,
    forfeit_score: item.forfeit_score,
    yellow_cards_suspension: item.yellow_cards_suspension,
    max_players_per_team: item.max_players_per_team,
    min_players_per_team: item.min_players_per_team,
    teams_advance_per_group: item.teams_advance_per_group,
    tiebreaker_order: item.tiebreaker_order ?? DEFAULT_RULE_FORM.tiebreaker_order,
    is_active: item.is_active ?? true,
  });

  const toggleTiebreaker = (value) => {
    crud.setForm(f => ({
      ...f,
      tiebreaker_order: f.tiebreaker_order.includes(value)
        ? f.tiebreaker_order.filter(v => v !== value)
        : [...f.tiebreaker_order, value],
    }));
  };

  const handleSave = () => {
    if (!crud.form.tournament_id) { crud.setFormError('Vui lòng chọn giải đấu.'); return; }
    if (crud.form.tiebreaker_order.length === 0) { crud.setFormError('Chọn ít nhất 1 tiêu chí phân điểm.'); return; }
    crud.save(async () => {
      const payload = {
        ...crud.form,
        tournament_id: Number(crud.form.tournament_id),
        points_per_win: Number(crud.form.points_per_win),
        points_per_draw: Number(crud.form.points_per_draw),
        points_per_loss: Number(crud.form.points_per_loss),
        forfeit_score: Number(crud.form.forfeit_score),
        yellow_cards_suspension: Number(crud.form.yellow_cards_suspension),
        max_players_per_team: Number(crud.form.max_players_per_team),
        min_players_per_team: Number(crud.form.min_players_per_team),
        teams_advance_per_group: Number(crud.form.teams_advance_per_group),
        is_active: crud.form.is_active,
      };
      if (crud.modal === 'add') {
        await tournamentRuleApi.create(payload);
        toast.success('Tạo luật giải thành công!');
      } else {
        await tournamentRuleApi.update(crud.editing.id, payload);
        toast.success('Cập nhật luật giải thành công!');
      }
    });
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
              placeholder="Tìm luật giải..."
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
              <p className="font-bold text-white truncate flex items-center gap-2">
                {getTournamentName(item.tournament_id)}
                {!item.is_active && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase">Tạm ẩn</span>
                )}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                <span className="text-xs text-gray-400">Thắng: <strong className="text-emerald-400">{item.points_per_win}pts</strong></span>
                <span className="text-xs text-gray-400">Hòa: <strong className="text-amber-400">{item.points_per_draw}pts</strong></span>
                <span className="text-xs text-gray-400">Thua: <strong className="text-red-400">{item.points_per_loss}pts</strong></span>
                <span className="text-xs text-gray-400">Max: <strong className="text-white">{item.max_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Min: <strong className="text-white">{item.min_players_per_team} HV</strong></span>
                <span className="text-xs text-gray-400">Thẻ vàng cấm: <strong className="text-amber-300">{item.yellow_cards_suspension}</strong></span>
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
            <button onClick={handleSave} disabled={crud.isSaving} className="px-5 py-2 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 disabled:opacity-70">
              {crud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {crud.modal === 'add' ? 'Tạo luật' : 'Lưu thay đổi'}
            </button>
          </>}
        >
          {crud.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{crud.formError}
            </div>
          )}
          <FormField label="Giải đấu" required>
            <select className={INPUT} value={crud.form.tournament_id} onChange={e => crud.setForm(f => ({ ...f, tournament_id: e.target.value }))}>
              <option value="">-- Chọn giải đấu --</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
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
            <FormField label="Max HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.max_players_per_team} onChange={e => crud.setForm(f => ({ ...f, max_players_per_team: e.target.value }))} />
            </FormField>
            <FormField label="Min HV/Đội">
              <input type="number" min="1" max="50" className={INPUT} value={crud.form.min_players_per_team} onChange={e => crud.setForm(f => ({ ...f, min_players_per_team: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Đội đi tiếp/Bảng">
              <input type="number" min="1" className={INPUT} value={crud.form.teams_advance_per_group} onChange={e => crud.setForm(f => ({ ...f, teams_advance_per_group: e.target.value }))} />
            </FormField>
            <FormField label="Thẻ vàng cấm thi đấu">
              <input type="number" min="1" max="10" className={INPUT} value={crud.form.yellow_cards_suspension} onChange={e => crud.setForm(f => ({ ...f, yellow_cards_suspension: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Tiêu chí phân điểm (chọn ít nhất 1)" required>
            <div className="flex flex-wrap gap-2 mt-1">
              {TIEBREAKER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleTiebreaker(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${crud.form.tiebreaker_order.includes(opt.value)
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-navy-dark border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {crud.form.tiebreaker_order.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Thứ tự ưu tiên: {crud.form.tiebreaker_order.map(v => TIEBREAKER_OPTIONS.find(o => o.value === v)?.label ?? v).join(' → ')}
              </p>
            )}
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
