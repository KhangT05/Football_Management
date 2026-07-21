import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, CheckSquare, Square, Save, AlertCircle } from 'lucide-react';
import { useTransferPlayerMutation } from '../../queries/useMyTeamQueries';
import useToastStore from '../../store/toastStore';
import { parseApiError } from '../../utils/errorHelper';
import { POSITION_LABELS } from '../../utils/constants';

export default function TransferPlayerModal({
  isOpen,
  onClose,
  activeSeasonTeamId,
  historyPlayers = [],
  currentPlayers = []
}) {
  const toast = useToastStore();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [playerEdits, setPlayerEdits] = useState({});

  const transferMutation = useTransferPlayerMutation(activeSeasonTeamId);

  // Lọc ra những cầu thủ có trong lịch sử nhưng chưa có trong currentPlayers
  const availablePlayers = useMemo(() => {
    const currentIds = new Set(currentPlayers.map(p => p.player_id || p.id));
    return historyPlayers.filter(p => !currentIds.has(p.player_id));
  }, [historyPlayers, currentPlayers]);

  const displayedPlayers = useMemo(() => {
    const q = search.toLowerCase();
    return availablePlayers.filter(p => (p.player_name || '').toLowerCase().includes(q));
  }, [availablePlayers, search]);

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedPlayers.length && displayedPlayers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedPlayers.map(p => p.player_id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleEditChange = (id, field, value) => {
    setPlayerEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
    // Tự động chọn nếu có chỉnh sửa
    if (!selectedIds.has(id)) {
      const next = new Set(selectedIds);
      next.add(id);
      setSelectedIds(next);
    }
  };

  const handleTransfer = () => {
    if (selectedIds.size === 0) return;

    const payload = Array.from(selectedIds).map(id => {
      const p = availablePlayers.find(x => x.player_id === id);
      const edit = playerEdits[id] || {};
      return {
        player_id: id,
        number: edit.number !== undefined ? edit.number : (p.jersey_number || 1),
        position: edit.position !== undefined ? edit.position : (p.position || 'CM'),
        role: edit.role !== undefined ? edit.role : (p.role || 'player'),
      };
    });

    transferMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Đã thêm ${payload.length} cầu thủ vào mùa giải hiện tại!`);
        onClose();
      },
      onError: (err) => {
        toast.error(parseApiError(err, 'Lỗi khi thêm cầu thủ.'));
      }
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] animate-scale-in overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Thêm từ mùa khác</h3>
            <p className="text-sm text-gray-500 mt-1">Chọn cầu thủ từ lịch sử thi đấu để mang vào mùa giải này</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-hidden flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên cầu thủ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar border border-gray-200 rounded-xl bg-gray-50/50">
            {availablePlayers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 opacity-50" />
                <p>Không có cầu thủ nào để thêm.</p>
                <p className="text-sm">Tất cả cầu thủ cũ đã có mặt trong mùa giải này, hoặc đội chưa từng đá mùa nào.</p>
              </div>
            ) : displayedPlayers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không tìm thấy cầu thủ phù hợp.</div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <button type="button" onClick={toggleSelectAll} className="text-gray-500 hover:text-blue-600">
                        {selectedIds.size === displayedPlayers.length ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                      </button>
                    </th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tên cầu thủ</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] w-24">Số áo</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] w-40">Vị trí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedPlayers.map(p => {
                    const isSelected = selectedIds.has(p.player_id);
                    const edit = playerEdits[p.player_id] || {};
                    const currentNumber = edit.number !== undefined ? edit.number : (p.jersey_number || '');
                    const currentPos = edit.position !== undefined ? edit.position : (p.position || 'CM');

                    return (
                      <tr key={p.player_id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                        <td className="p-3 text-center">
                          <button type="button" onClick={() => toggleSelect(p.player_id)} className="text-gray-500 hover:text-blue-600">
                            {isSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                          </button>
                        </td>
                        <td className="p-3 font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span>{p.player_name}</span>
                            {p.playedSeasons && p.playedSeasons.length > 0 && (
                              <span className="text-[10px] text-gray-500">Đã đá {p.playedSeasons.length} mùa</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                            <input
                              type="number"
                              min="1" max="99"
                              value={currentNumber}
                              onChange={e => handleEditChange(p.player_id, 'number', e.target.value)}
                              className="w-16 bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-center text-gray-900 focus:border-blue-500 outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={currentPos}
                              onChange={e => handleEditChange(p.player_id, 'position', e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-gray-900 focus:border-blue-500 outline-none"
                            >
                            {Object.entries(POSITION_LABELS).map(([val, lbl]) => (
                              <option key={val} value={val}>{lbl}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
            Hủy
          </button>
          <button
            onClick={handleTransfer}
            disabled={selectedIds.size === 0 || transferMutation.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            {transferMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Thêm ({selectedIds.size}) cầu thủ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
