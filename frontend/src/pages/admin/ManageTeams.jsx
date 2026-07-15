import { useState, useEffect, useCallback, Fragment } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, AlertTriangle } from 'lucide-react';
import { useCrudModal, useDebouncedValue, useApiQuery } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import useSeasonStore from '../../store/seasonStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import TeamFormModal from '../../components/admin/TeamFormModal';
import PlayerFormModal from '../../components/admin/PlayerFormModal';
import Pagination from '../../components/ui/Pagination';
import ApproveTeamsTab from '../../components/admin/ApproveTeamsTab';
import TeamsHeader from '../../components/admin/teams/TeamsHeader';
import TeamsTabs from '../../components/admin/teams/TeamsTabs';
import TeamsSearch from '../../components/admin/teams/TeamsSearch';
import TeamRow from '../../components/admin/teams/TeamRow';
import { useShallow } from 'zustand/react/shallow';
import useAdminUIStore from '../../store/adminUIStore';
import { playerApi, seasonTeamApi } from '../../api';
import { POSITIONS, EMPTY_TEAM, EMPTY_PLAYER } from '../../data/data';


export default function ManageTeams() {
  const toast = useToastStore();
  const [activeTab, setActiveTab] = useState('teams');

  // ── Zustand store ──────────────────────────────────────────────
  const { teams, meta, isLoading, error: fetchError,
    fetchAll: fetchTeamsStore,
    create: createTeam,
    update: updateTeam,
    softDelete: deleteTeam,
    fetchPlayers, getPlayersFromCache, playersLoading,
    addNewPlayerToTeam, updatePlayerInTeam, removePlayers, } = useTeamStore(useShallow(state => ({ teams: state.teams, meta: state.meta, isLoading: state.isLoading, error: state.error, fetchAll: state.fetchAll, create: state.create, update: state.update, softDelete: state.softDelete, fetchPlayers: state.fetchPlayers, getPlayersFromCache: state.getPlayersFromCache, playersLoading: state.playersLoading, addNewPlayerToTeam: state.addNewPlayerToTeam, updatePlayerInTeam: state.updatePlayerInTeam, removePlayers: state.removePlayers })));

  // ── Pagination & Search ────────────────────────────────────
  const { teamFilters, setTeamFilters } = useAdminUIStore(useShallow(state => ({
    teamFilters: state.teamFilters,
    setTeamFilters: state.setTeamFilters,
  })));
  const { search: searchTerm, page: currentPage, limit: itemsPerPage } = teamFilters;

  const setSearchTerm = useCallback((val) => setTeamFilters({ search: typeof val === 'function' ? val(searchTerm) : val }), [searchTerm, setTeamFilters]);
  const setCurrentPage = useCallback((val) => setTeamFilters({ page: typeof val === 'function' ? val(currentPage) : val }), [currentPage, setTeamFilters]);
  const setItemsPerPage = useCallback((val) => setTeamFilters({ limit: val, page: 1 }), [setTeamFilters]);

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, setCurrentPage]);

  const refetchTeams = useCallback(() => {
    fetchTeamsStore({
      page: currentPage,
      per_page: itemsPerPage,
      q: debouncedSearch || undefined,
      sort: 'id',
      direction: 'asc',
      force: true
    });
  }, [fetchTeamsStore, debouncedSearch, currentPage, itemsPerPage]);

  useEffect(() => { refetchTeams(); }, [refetchTeams]);

  const totalPages = meta?.last_page || 1;
  const paginatedTeams = teams || [];

  const { seasons, fetchAll: fetchSeasons } = useSeasonStore(useShallow(state => ({ seasons: state.seasons, fetchAll: state.fetchAll })));
  
  useEffect(() => {
    fetchSeasons({ per_page: 100, sort: 'id', direction: 'desc' });
  }, [fetchSeasons]);

  const { data: allSeasonTeams } = useApiQuery(
    (params) => seasonTeamApi.getAll(params),
    { autoFetch: true, defaultParams: { per_page: 5000 } }
  );

  const teamsWithSeasons = paginatedTeams.map(team => {
    const teamSeasonTeams = allSeasonTeams?.filter(st => String(st.team_id) === String(team.id)) || [];
    const mappedSeasonTeams = teamSeasonTeams.map(st => {
      const season = seasons.find(s => String(s.id) === String(st.season_id));
      return { ...st, season: season || { id: st.season_id, name: `Season #${st.season_id}` } };
    });
    return { ...team, season_teams: mappedSeasonTeams };
  });

  // ── CRUD Modal: Team (useCrudModal) ───────────────────
  const teamCrud = useCrudModal({ emptyForm: EMPTY_TEAM, onSuccess: refetchTeams });
  const [logoPreview, setLogoPreview] = useState(null);

  const openAddTeam = () => {
    setLogoPreview(null);
    teamCrud.openAdd();
  };

  const openEditTeam = (team) => {
    setLogoPreview(team.logo || null);
    teamCrud.openEdit(team, {
      name: team.name,
      coach_name: team.coach_name ?? '',
      description: team.description ?? '',
      logo: null,
      jersey_color: team.jersey_color ?? '#ffffff',
      is_active: team.is_active ?? true,
    });
  };

  const closeTeamModal = () => {
    setLogoPreview(null);
    teamCrud.closeModal();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    teamCrud.setForm(prev => ({ ...prev, logo: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveTeam = () => {
    if (!teamCrud.form.name.trim()) { teamCrud.setFormError('Vui lòng nhập tên đội bóng.'); return; }
    const payload = {
      name: teamCrud.form.name.trim(),
      coach_name: teamCrud.form.coach_name.trim() || undefined,
      description: teamCrud.form.description.trim() || undefined,
      logo: teamCrud.form.logo instanceof File ? teamCrud.form.logo : undefined,
      jersey_color: teamCrud.form.jersey_color || undefined,
      is_active: teamCrud.form.is_active,
    };
    teamCrud.save(async () => {
      if (teamCrud.modal === 'add') {
        await createTeam(payload);
        toast.success(`Đã tạo đội "${payload.name}" thành công!`);
      } else {
        await updateTeam(teamCrud.editing.id, payload);
        toast.success(`Đã cập nhật thông tin đội "${payload.name}".`);
      }
    });
  };

  const handleDeleteTeam = () => {
    const team = teamCrud.deleting;
    teamCrud.confirmDelete(async () => {
      await deleteTeam(team.id);
      if (expandedTeamId === team.id) setExpandedTeamId(null);
      toast.success(`Đã xóa đội "${team.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa đội bóng.');
    });
  };

  const handleApproveTeam = async (team) => {
    try {
      await updateTeam(team.id, { is_active: true });
      toast.success(`Đã duyệt đội bóng "${team.name}". Đội bóng hiện có thể đăng ký giải đấu.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi duyệt đội bóng.');
    }
  };

  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const toggleTeamExpand = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
      fetchPlayers(teamId); // dùng cache nếu còn hợp lệ
    }
  };

  // ── CRUD Modal: Player (useCrudModal) ─────────────────
  const [playerTargetTeamId, setPlayerTargetTeamId] = useState(null);
  const playerCrud = useCrudModal({
    emptyForm: EMPTY_PLAYER,
    onSuccess: () => { if (playerTargetTeamId) fetchPlayers(playerTargetTeamId, { force: true }); },
  });

  const openAddPlayer = (teamId) => {
    setPlayerTargetTeamId(teamId);
    playerCrud.openAdd();
  };

  const openEditPlayer = (teamId, player) => {
    setPlayerTargetTeamId(teamId);
    playerCrud.openEdit(player, {
      name: player.player?.user?.name ?? player.player?.name ?? player.name ?? '',
      email: player.player?.user?.email ?? '',
      number: player.jersey_number ?? player.number,
      position: player.position || 'forward',
      role: player.role || 'player',
      date_of_birth: player.player?.date_of_birth ?? null,
      height: player.player?.height ?? '',
      weight: player.player?.weight ?? '',
      nationality: player.player?.nationality ?? '',
      student_code: player.player?.user?.student_code ?? '',
      class_id: player.player?.user?.class_id ?? '',
    });
  };

  const handleSavePlayer = () => {
    if (!playerCrud.form.name.trim()) { playerCrud.setFormError('Vui lòng nhập tên cầu thủ.'); return; }
    if (!playerCrud.form.number || isNaN(playerCrud.form.number)) { playerCrud.setFormError('Vui lòng nhập số áo hợp lệ.'); return; }

    const payload = {
      name: playerCrud.form.name.trim(),
      user_email: playerCrud.form.email?.trim() || undefined,
      jersey_number: parseInt(playerCrud.form.number),
      position: playerCrud.form.position,
      role: playerCrud.form.role,
      date_of_birth: playerCrud.form.date_of_birth || undefined,
      height: playerCrud.form.height ? parseFloat(playerCrud.form.height) : undefined,
      weight: playerCrud.form.weight ? parseFloat(playerCrud.form.weight) : undefined,
      nationality: playerCrud.form.nationality?.trim() || undefined,
      student_code: playerCrud.form.student_code?.trim() || undefined,
      class_id: playerCrud.form.class_id ? parseInt(playerCrud.form.class_id) : undefined,
    };

    playerCrud.save(async () => {
      if (playerCrud.modal === 'add') {
        await addNewPlayerToTeam(playerTargetTeamId, payload);
        toast.success(`Đã thêm cầu thủ "${payload.name}" vào đội!`);
      } else {
        await updatePlayerInTeam(playerTargetTeamId, playerCrud.editing.id, playerCrud.editing.player_id, playerCrud.editing.player?.user_id, payload);
        toast.success(`Đã cập nhật cầu thủ "${payload.name}".`);
      }
    });
  };

  // ── Delete Player ──────────────────────────────────────
  const [deletePlayerState, setDeletePlayerState] = useState(null);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState(false);
  const [isImportingExcel, setIsImportingExcel] = useState(false);

  const handleDeletePlayer = async () => {
    const { player, teamId } = deletePlayerState;
    setIsDeletingPlayer(true);
    try {
      // Dùng removePlayers từ teamStore (bulk delete đúng route)
      await removePlayers(teamId, [player.id]);
      toast.success('Đã xóa cầu thủ khỏi đội.');
      setDeletePlayerState(null);
      fetchPlayers(teamId, { force: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa cầu thủ.');
    } finally {
      setIsDeletingPlayer(false);
    }
  };
  const handleDownloadPlayerTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const res = await playerApi.downloadImportTemplate();
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      if (!blob.size) throw new Error('File mẫu rỗng, vui lòng thử lại.');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'import-cau-thu-mau.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Không thể tải file mẫu Excel.');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleImportPlayersExcel = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // cho phép chọn lại cùng 1 file lần sau
    if (!file || !playerTargetTeamId) return;

    setIsImportingExcel(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await playerApi.importTeamPlayers(playerTargetTeamId, formData);
      const result = res?.data ?? res;
      toast.success(`Import xong: ${result?.success ?? 0} thành công, ${result?.failed ?? 0} lỗi.`, 5000);
      fetchPlayers(playerTargetTeamId, { force: true });
      playerCrud.closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Import Excel thất bại.');
    } finally {
      setIsImportingExcel(false);
    }
  };

  const getTeamRoster = (team) => getPlayersFromCache(team.id);

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in">

        {/* Header */}
        <TeamsHeader 
          metaTotal={meta?.total}
          isLoading={isLoading}
          onRefetch={refetchTeams}
          onAddTeam={openAddTeam}
        />

        {/* Tabs Navigation */}
        <TeamsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'teams' ? (
          <div className="space-y-6 animate-fade-in">
            {/* Search */}
            <TeamsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Teams Table */}
            <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                  <thead>
                    <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6 w-16 text-center">ID</th>
                      <th className="py-4 px-6">Đội bóng</th>
                      <th className="py-4 px-6">Mùa giải</th>
                      <th className="py-4 px-6 text-center">Trạng thái</th>
                      <th className="py-4 px-6 text-center">Duyệt</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-navy-light">
                          {[1, 2, 3, 4, 5, 6].map(j => (
                            <td key={j} className="py-4 px-6">
                              <div className="skeleton h-4 w-full rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : fetchError ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-red-400">
                          <div className="flex flex-col items-center gap-3">
                            <AlertTriangle className="w-10 h-10 text-red-500/50" />
                            <p className="font-semibold">{fetchError}</p>
                            <button
                              onClick={refetchTeams}
                              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                            >Thử lại</button>
                          </div>
                        </td>
                      </tr>
                    ) : teamsWithSeasons.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-10 h-10 text-gray-600" />
                            <p className="font-semibold">
                              {searchTerm
                                ? `Không tìm thấy đội nào cho "${searchTerm}"`
                                : 'Chưa có đội bóng nào.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      teamsWithSeasons.map((team, idx) => (
                        <TeamRow 
                          key={team.id}
                          team={team}
                          idx={idx}
                          expandedTeamId={expandedTeamId}
                          onToggleExpand={toggleTeamExpand}
                          onApprove={handleApproveTeam}
                          onEdit={openEditTeam}
                          onDelete={(team) => teamCrud.setDeleting(team)}
                          getTeamRoster={getTeamRoster}
                          playersLoading={playersLoading}
                          onAddPlayer={openAddPlayer}
                          onEditPlayer={openEditPlayer}
                          onDeletePlayer={(player, teamId) => setDeletePlayerState({ player, teamId })}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </div>
              )}

            </div>
          </div>
        ) : (
          <ApproveTeamsTab />
        )}
      </div>

      {/* Team Add/Edit Modal */}
      {teamCrud.modal && (
        <TeamFormModal
          mode={teamCrud.modal}
          form={teamCrud.form}
          setForm={teamCrud.setForm}
          formError={teamCrud.formError}
          logoPreview={logoPreview}
          isSaving={teamCrud.isSaving}
          onSave={handleSaveTeam}
          onClose={closeTeamModal}
          onLogoChange={handleLogoChange}
        />
      )}

      {playerCrud.modal && (
        <PlayerFormModal
          mode={playerCrud.modal}
          form={playerCrud.form}
          setForm={playerCrud.setForm}
          formError={playerCrud.formError}
          isSaving={playerCrud.isSaving}
          onSave={handleSavePlayer}
          onClose={playerCrud.closeModal}
          onImportExcel={handleImportPlayersExcel}
          onDownloadTemplate={handleDownloadPlayerTemplate}
          isDownloadingTemplate={isDownloadingTemplate}
          isImporting={isImportingExcel}
        />
      )}
      {/* Delete Confirm – Team */}
      {teamCrud.deleting && (
        <ConfirmDeleteModal
          title="Xóa đội bóng?"
          message={<>Xóa <strong className="text-white">{teamCrud.deleting.name}</strong>? Hành động này không thể hoàn tác và sẽ xóa toàn bộ cầu thủ.</>}
          onConfirm={handleDeleteTeam}
          onCancel={() => teamCrud.setDeleting(null)}
          isDeleting={teamCrud.isDeleting}
        />
      )}

      {/* Delete Confirm – Player */}
      {deletePlayerState && (
        <ConfirmDeleteModal
          title="Xóa cầu thủ?"
          message={<>Xóa cầu thủ <strong className="text-white">{deletePlayerState.player?.player?.name ?? deletePlayerState.player?.name ?? 'Cầu thủ'}</strong> khỏi đội?</>}
          onConfirm={handleDeletePlayer}
          onCancel={() => setDeletePlayerState(null)}
          isDeleting={isDeletingPlayer}
        />
      )}
    </AdminLayout>
  );
}
