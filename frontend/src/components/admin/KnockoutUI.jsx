import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { knockoutApi } from '../../api';
import useToastStore from '../../store/toastStore';
import { INPUT, BTN_PRIMARY } from '../../utils/adminStyles';

export default function KnockoutUI({ seasonId }) {
  const toast = useToastStore();
  
  const [phaseId, setPhaseId] = useState('');
  const [seededTeamIds, setSeededTeamIds] = useState('');
  const [venueIds, setVenueIds] = useState('1');
  const [matchTimes, setMatchTimes] = useState(new Date().toISOString());
  const [legs, setLegs] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [bracketData, setBracketData] = useState(null);

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
    if (!phaseId) return toast.error('Vui lòng nhập Phase ID');
    if (!seededTeamIds) return toast.error('Vui lòng nhập danh sách Team ID');

    setLoading(true);
    try {
      const teamIdArray = seededTeamIds.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
      if (teamIdArray.length < 2) throw new Error('Cần ít nhất 2 team');

      const reqBody = {
        seededTeamIds: teamIdArray,
        venueIds: venueIds,
        matchTimes: matchTimes,
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
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Phase ID (Bắt buộc)</label>
            <input 
              type="number"
              value={phaseId}
              onChange={e => setPhaseId(e.target.value)}
              placeholder="VD: 3"
              className={INPUT}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-1">Seeded Team IDs (Cách nhau dấu phẩy)</label>
            <input 
              type="text"
              value={seededTeamIds}
              onChange={e => setSeededTeamIds(e.target.value)}
              placeholder="VD: 1, 2, 3, 4"
              className={INPUT}
            />
          </div>
          <div className="col-span-1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Venue IDs (Sân đấu, cách nhau dấu phẩy)</label>
            <input 
              type="text"
              value={venueIds}
              onChange={e => setVenueIds(e.target.value)}
              className={INPUT}
              placeholder="VD: 1, 2"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 mb-1">Match Times (Cách nhau dấu phẩy)</label>
            <input 
              type="text"
              value={matchTimes}
              onChange={e => setMatchTimes(e.target.value)}
              className={INPUT}
              placeholder="2025-01-01T10:00:00Z"
            />
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
