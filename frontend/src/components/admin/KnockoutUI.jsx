import { useState, useEffect } from 'react';
import { Trophy, AlertTriangle, Loader2 } from 'lucide-react';
import { knockoutApi, seasonApi, seasonTeamApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useVenueStore from '../../store/venueStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';
import { INPUT, BTN_PRIMARY } from '../../utils/adminStyles';

const VALID_BRACKET_SIZES = [2, 4, 8, 16];

export default function KnockoutUI({ seasonId }) {
  const toast = useToastStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const { teams } = useTeamStore(useShallow(state => ({ teams: state.teams })));

  // ── Seed mode ──────────────────────────────────────────────────────────
  const [seedMode, setSeedMode] = useState('manual'); // 'manual' | 'standing'

  // manual mode: order in array = seed order (push on check)
  const [seededTeamIds, setSeededTeamIds] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  // standing mode: order in groupConfigs = group priority; interleaved by rank at build time
  const [availableGroups, setAvailableGroups] = useState([]);
  const [groupConfigs, setGroupConfigs] = useState([]); // [{ groupId, name, topN }]

  // ── Shared generate form state ────────────────────────────────────────
  const [venueIds, setVenueIds] = useState([]);
  const [matchTimes, setMatchTimes] = useState('');
  const [legs, setLegs] = useState(1);
  const [generating, setGenerating] = useState(false);

  // ── View state — phase already exists (post-generate) ───────────────────
  const [availablePhases, setAvailablePhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [bracketData, setBracketData] = useState(null);
  const [loadingBracket, setLoadingBracket] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seasonRes = await seasonApi.getById(seasonId);
        const phases = seasonRes?.phases ?? [];

        setAvailablePhases(phases.filter(p => p.format === 'knockout'));

        // ASSUMPTION: group_stage phase carries `.groups` embedded ([{id, name}]).
        // If groups are fetched via a separate groupApi.getBySeason(seasonId) instead,
        // swap this line only.
        const groupPhases = phases.filter(p => p.format === 'group_stage');
        setAvailableGroups(groupPhases.flatMap(p => p.groups ?? []));

        const teamRes = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 500 });
        const allTeams = typeof teamRes?.status === 'boolean' ? teamRes.data : teamRes;
        const seasonTeams = (Array.isArray(allTeams?.data) ? allTeams.data : [])
          .filter(st => String(st.season_id) === String(seasonId) && st.status === 'approved');
        setAvailableTeams(seasonTeams);
      } catch (err) {
        console.error('Error fetching knockout data:', err);
      }
    };
    if (seasonId) fetchData();
  }, [seasonId]);

  const fetchBracket = async (phaseId) => {
    if (!phaseId) return;
    setLoadingBracket(true);
    try {
      const res = await knockoutApi.getBracket(phaseId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      setBracketData(payload);
    } catch (err) {
      console.log('Chưa có bracket hoặc lỗi:', err);
      setBracketData(null);
    } finally {
      setLoadingBracket(false);
    }
  };

  useEffect(() => {
    if (selectedPhaseId) fetchBracket(selectedPhaseId);
  }, [selectedPhaseId]);

  // Interleave standings by rank: all rank-1s first (per group in configured order),
  // then rank-2s. Does not guarantee cross-round group separation beyond round 1 —
  // depends on how buildRound1Pairings pairs seed[0] vs seed[n-1] on the BE.
  const buildStandingSeeds = (configs) => {
    const maxTopN = Math.max(0, ...configs.map(c => c.topN));
    const seeds = [];
    for (let rank = 1; rank <= maxTopN; rank++) {
      for (const c of configs) {
        if (rank <= c.topN) seeds.push({ kind: 'standing', groupId: c.groupId, rank });
      }
    }
    return seeds;
  };

  const moveGroupConfig = (groupId, dir) => {
    setGroupConfigs(prev => {
      const i = prev.findIndex(c => c.groupId === groupId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleGenerate = async () => {
    const seeds = seedMode === 'manual'
      ? seededTeamIds.map(teamId => ({ kind: 'manual', teamId }))
      : buildStandingSeeds(groupConfigs);

    if (seeds.length < 2) return toast.error('Cần ít nhất 2 seed');
    if (!VALID_BRACKET_SIZES.includes(seeds.length)) {
      return toast.error(
        `Số seed phải là ${VALID_BRACKET_SIZES.join('/')} — hiện tại ${seeds.length}. ` +
        (seedMode === 'standing' ? 'Điều chỉnh Top N hoặc số bảng chọn.' : 'Chọn/bỏ bớt đội hạt giống.')
      );
    }
    if (venueIds.length === 0) return toast.error('Vui lòng chọn ít nhất 1 sân đấu');
    if (!matchTimes) return toast.error('Vui lòng nhập giờ thi đấu');

    setGenerating(true);
    try {
      const timesArray = matchTimes.split(',').map(t => t.trim()).filter(Boolean);

      const res = await knockoutApi.generateBracket(seasonId, {
        seeds,
        venueIds,
        matchTimes: timesArray,
        legs: Number(legs),
      });

      const result = typeof res?.status === 'boolean' ? res.data : res;
      const newPhaseId = result?.phaseId;

      if (result?.warnings?.length) {
        result.warnings.forEach(w => toast.error(w));
      } else {
        toast.success(`Đã tạo sơ đồ Knockout — ${result?.round1Matches} trận, ${result?.byeSlots} bye`);
      }

      if (newPhaseId) {
        const seasonRes = await seasonApi.getById(seasonId);
        if (seasonRes?.phases) {
          setAvailablePhases(seasonRes.phases.filter(p => p.format === 'knockout'));
        }
        setSelectedPhaseId(newPhaseId);
        fetchBracket(newPhaseId);
      }
    } catch (err) {
      // CONFLICT ("Còn N match chưa kết thúc...") = expected khi seedMode='standing'
      // và group chưa đá xong — message server đã đủ rõ để hiển thị trực tiếp
      toast.error(err?.response?.data?.message || err.message || 'Lỗi tạo knockout');
    } finally {
      setGenerating(false);
    }
  };

  const currentSeedCount = seedMode === 'manual'
    ? seededTeamIds.length
    : buildStandingSeeds(groupConfigs).length;

  return (
    <div className="space-y-6">
      {/* ── GENERATE FORM ── */}
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" /> Tạo Vòng Loại Trực Tiếp (Knockout)
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Phase sẽ được hệ thống tự tạo dựa trên số đội hạt giống — không cần chọn trước.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSeedMode('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${seedMode === 'manual' ? 'bg-amber-600 text-white' : 'bg-navy-dark text-gray-400'}`}
          >
            Chọn thủ công
          </button>
          <button
            type="button"
            onClick={() => setSeedMode('standing')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${seedMode === 'standing' ? 'bg-amber-600 text-white' : 'bg-navy-dark text-gray-400'}`}
          >
            Seed theo bảng xếp hạng
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-1">Giờ thi đấu (Cách nhau dấu phẩy)</label>
            <input
              type="text"
              value={matchTimes}
              onChange={e => setMatchTimes(e.target.value)}
              className={INPUT}
              placeholder="VD: 08:00, 15:00"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Số lượt trận (Legs)</label>
            <select value={legs} onChange={e => setLegs(e.target.value)} className={INPUT}>
              <option value={1}>1 lượt</option>
              <option value={2}>2 lượt (Đi & về)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* ── Seed source column ── */}
          <div className="col-span-1">
            {seedMode === 'manual' ? (
              <>
                <label className="block text-xs font-bold text-gray-400 mb-2">Đội hạt giống (Seeded Teams)</label>
                <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {availableTeams.length === 0 && <p className="text-gray-500 text-xs">Không có đội nào hợp lệ.</p>}
                  {availableTeams.map(st => {
                    const team = teams.find(t => t.id === st.team_id);
                    return (
                      <label key={st.team_id} className="flex items-center gap-2 cursor-pointer hover:bg-navy p-1 rounded">
                        <input
                          type="checkbox"
                          className="accent-amber-500 w-4 h-4 rounded border-gray-600 bg-gray-700"
                          checked={seededTeamIds.includes(st.team_id)}
                          onChange={(e) => {
                            if (e.target.checked) setSeededTeamIds(prev => [...prev, st.team_id]);
                            else setSeededTeamIds(prev => prev.filter(id => id !== st.team_id));
                          }}
                        />
                        <span className="text-sm text-gray-300">{team?.name || `Team ID: ${st.team_id}`}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-400 mb-2">Seed theo bảng xếp hạng</label>
                <p className="text-xs text-gray-500 mb-2">
                  Thứ tự bảng bên dưới = thứ tự seed (không phải thứ tự đấu thật).
                  Standings sẽ được recompute lại ngay trong transaction tạo bracket
                  — không dùng snapshot cũ.
                </p>
                <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {availableGroups.length === 0 && <p className="text-gray-500 text-xs">Chưa có bảng đấu nào trong season.</p>}
                  {availableGroups.map(g => {
                    const cfg = groupConfigs.find(c => c.groupId === g.id);
                    return (
                      <div key={g.id} className="flex items-center gap-2 bg-navy p-2 rounded">
                        <input
                          type="checkbox"
                          className="accent-amber-500 w-4 h-4"
                          checked={!!cfg}
                          onChange={(e) => {
                            if (e.target.checked) setGroupConfigs(prev => [...prev, { groupId: g.id, name: g.name, topN: 1 }]);
                            else setGroupConfigs(prev => prev.filter(c => c.groupId !== g.id));
                          }}
                        />
                        <span className="text-sm text-gray-300 flex-1">{g.name}</span>
                        {cfg && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveGroupConfig(g.id, -1)}
                              className="text-xs text-gray-400 px-1 hover:text-white"
                              aria-label="Di chuyển lên"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGroupConfig(g.id, 1)}
                              className="text-xs text-gray-400 px-1 hover:text-white"
                              aria-label="Di chuyển xuống"
                            >
                              ↓
                            </button>
                            <select
                              value={cfg.topN}
                              onChange={(e) => setGroupConfigs(prev => prev.map(c => c.groupId === g.id ? { ...c, topN: Number(e.target.value) } : c))}
                              className="bg-navy-dark border border-navy-light rounded px-2 py-1 text-xs text-gray-300"
                            >
                              <option value={1}>Top 1</option>
                              <option value={2}>Top 2</option>
                            </select>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── Venues column ── */}
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-2">Sân thi đấu (Venues)</label>
            <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {venues.length === 0 && <p className="text-gray-500 text-xs">Không có sân nào.</p>}
              {venues.map(v => (
                <label key={v.id} className="flex items-center gap-2 cursor-pointer hover:bg-navy p-1 rounded">
                  <input
                    type="checkbox"
                    className="accent-amber-500 w-4 h-4 rounded border-gray-600 bg-gray-700"
                    checked={venueIds.includes(v.id)}
                    onChange={(e) => {
                      if (e.target.checked) setVenueIds(prev => [...prev, v.id]);
                      else setVenueIds(prev => prev.filter(id => id !== v.id));
                    }}
                  />
                  <span className="text-sm text-gray-300">{v.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`${BTN_PRIMARY} bg-amber-600 hover:bg-amber-500`}
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
            Tạo Sơ Đồ Bracket
          </button>
          <span className="text-xs text-gray-500">
            {currentSeedCount} seed đã chọn
            {!VALID_BRACKET_SIZES.includes(currentSeedCount) && currentSeedCount > 0 && (
              <span className="text-red-400"> — cần {VALID_BRACKET_SIZES.join('/')}</span>
            )}
          </span>
        </div>
      </div>

      {/* ── XEM BRACKET ĐÃ TẠO ── */}
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <label className="block text-xs font-bold text-gray-400 mb-1">Xem Bracket theo Phase</label>
        <select
          value={selectedPhaseId}
          onChange={e => setSelectedPhaseId(Number(e.target.value))}
          className={INPUT}
        >
          <option value="">-- Chọn Phase --</option>
          {availablePhases.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loadingBracket ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        </div>
      ) : bracketData ? (
        <div className="bg-navy border border-navy-light rounded-xl p-5 overflow-x-auto">
          <h4 className="font-bold text-white mb-4">Sơ đồ Knockout (Phase ID: {selectedPhaseId})</h4>
          <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono bg-navy-dark p-4 rounded-lg">
            {JSON.stringify(bracketData, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-center py-12 bg-navy border border-navy-light rounded-xl border-dashed">
          <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="text-gray-400 font-bold">Chưa có dữ liệu sơ đồ</h4>
          <p className="text-gray-500 text-sm mt-1">Tạo mới hoặc chọn Phase để xem bracket.</p>
        </div>
      )}
    </div>
  );
}