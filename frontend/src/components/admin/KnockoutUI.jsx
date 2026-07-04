import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { knockoutApi, seasonApi, seasonTeamApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useVenueStore from '../../store/venueStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';
import { INPUT, BTN_PRIMARY } from '../../utils/adminStyles';

export default function KnockoutUI({ seasonId }) {
  const toast = useToastStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const { teams } = useTeamStore(useShallow(state => ({ teams: state.teams })));

  const [phaseId, setPhaseId] = useState('');
  const [seededTeamIds, setSeededTeamIds] = useState([]);
  const [venueIds, setVenueIds] = useState([]);
  const [matchTimes, setMatchTimes] = useState('');
  const [legs, setLegs] = useState(1);

  const [loading, setLoading] = useState(false);
  const [bracketData, setBracketData] = useState(null);

  const [availablePhases, setAvailablePhases] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seasonRes = await seasonApi.getById(seasonId);
        if (seasonRes?.phases) {
          setAvailablePhases(seasonRes.phases.filter(p => p.format === 'knockout'));
        }

        const teamRes = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 500 });
        const allTeams = typeof teamRes?.status === 'boolean' ? teamRes.data : teamRes;
        const seasonTeams = (Array.isArray(allTeams?.data) ? allTeams.data : []).filter(st => String(st.season_id) === String(seasonId) && st.status === 'approved');
        setAvailableTeams(seasonTeams);
      } catch (err) {
        console.error('Error fetching knockout data:', err);
      }
    };
    if (seasonId) fetchData();
  }, [seasonId]);

  const fetchBracket = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await knockoutApi.getBracket(id);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      setBracketData(payload);
    } catch (err) {
      console.log('Chưa có bracket hoặc lỗi:', err);
      setBracketData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phaseId) {
      fetchBracket(phaseId);
    }
  }, [phaseId]);

  const handleGenerate = async () => {
    if (!phaseId) return toast.error('Vui lòng chọn Phase');
    if (seededTeamIds.length < 2) return toast.error('Vui lòng chọn ít nhất 2 đội hạt giống');
    if (venueIds.length === 0) return toast.error('Vui lòng chọn ít nhất 1 sân đấu');
    if (!matchTimes) return toast.error('Vui lòng nhập giờ thi đấu');

    setLoading(true);
    try {
      const timesArray = matchTimes.split(',').map(t => t.trim()).filter(Boolean);

      const reqBody = {
        seededTeamIds: seededTeamIds,
        venueIds: venueIds,
        matchTimes: timesArray,
        legs: Number(legs)
      };

      await knockoutApi.generateBracket(seasonId, phaseId, reqBody);
      toast.success('Đã tạo sơ đồ Knockout thành công!');
      fetchBracket(phaseId);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Lỗi tạo knockout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" /> Tạo Vòng Loại Trực Tiếp (Knockout)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-1">Giai đoạn (Phase)</label>
            <select
              value={phaseId}
              onChange={e => setPhaseId(Number(e.target.value))}
              className={INPUT}
            >
              <option value="">-- Chọn Giai đoạn --</option>
              {availablePhases.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
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
          <div className="col-span-1 lg:col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Số lượt trận (Legs)</label>
            <select
              value={legs}
              onChange={e => setLegs(e.target.value)}
              className={INPUT}
            >
              <option value={1}>1 lượt</option>
              <option value={2}>2 lượt (Đi & về)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
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
          </div>
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

        <button
          onClick={handleGenerate}
          disabled={loading || !phaseId}
          className={`${BTN_PRIMARY} bg-amber-600 hover:bg-amber-500`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
          Tạo Sơ Đồ Bracket
        </button>
      </div>

      {bracketData ? (
        <div className="bg-navy border border-navy-light rounded-xl p-5 overflow-x-auto">
          <h4 className="font-bold text-white mb-4">Sơ đồ Knockout (Phase ID: {phaseId})</h4>
          <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono bg-navy-dark p-4 rounded-lg">
            {JSON.stringify(bracketData, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-center py-12 bg-navy border border-navy-light rounded-xl border-dashed">
          <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="text-gray-400 font-bold">Chưa có dữ liệu sơ đồ</h4>
          <p className="text-gray-500 text-sm mt-1">Hãy nhập Phase ID và tạo sơ đồ để hiển thị ở đây.</p>
        </div>
      )}
    </div>
  );
}
