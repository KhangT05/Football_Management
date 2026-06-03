import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, Edit, Edit3, X, Save, Trash2, Goal } from 'lucide-react';
import { Matches } from '../../data/data';

export default function ManageMatches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [goals, setGoals] = useState([]);
  
  const openModal = (match) => {
    setSelectedMatch(match);
    setGoals([]);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
    setGoals([]);
  };

  const addGoal = () => {
    setGoals([...goals, { id: Date.now(), team: 'home', player: '', minute: '' }]);
  };

  const updateGoal = (id, field, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const removeGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
             <h2 className="text-2xl font-extrabold text-white tracking-tight">Manage Matches</h2>
             <p className="text-gray-400 text-sm mt-1">Lập lịch và cập nhật kết quả trận đấu</p>
          </div>
          <button className="w-full sm:w-auto bg-[#003280] hover:bg-navy-light text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Create New Match
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden text-slate-600">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Home Team</th>
                  <th className="py-4 px-6">Away Team</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Matches.map((match) => (
                  <tr key={match.id} className="hover:bg-navy-dark/80 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-700">{match.date}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{match.home}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{match.away}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.status === 'Scheduled' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-neon hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 outline-none" title="Edit Schedule">
                          <Edit className="w-4 h-4" /> 
                        </button>
                        <button 
                          onClick={() => openModal(match)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-navy-dark text-slate-600 hover:bg-slate-800 hover:text-white text-sm font-semibold rounded-md border border-navy-light hover:border-slate-800 transition-colors shrink-0"
                        >
                          <Edit3 className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Update Score</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-navy rounded-2xl shadow-2xl relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Edit3 className="w-5 h-5 text-neon" />
                 Update Match Events
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto space-y-8 flex-1">
               <div className="text-center font-medium text-gray-400 text-sm mb-4 opacity-80 bg-navy-dark py-2 rounded-lg">{selectedMatch?.date}</div>
               
               {/* Final Score Inputs */}
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 bg-navy-dark p-6 rounded-xl border border-slate-100">
                  <div className="flex-1 space-y-3 w-full">
                    <label className="block text-sm font-extrabold text-slate-700 text-center uppercase tracking-wider">{selectedMatch?.home}</label>
                    <input type="number" min="0" placeholder="0" className="w-full text-center text-4xl font-black p-4 border-2 border-navy-light rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-navy-light outline-none transition-all shadow-lg shadow-black/20 bg-navy" />
                  </div>
                  
                  <div className="font-black text-slate-300 text-2xl hidden sm:block">VS</div>
                  
                  <div className="flex-1 space-y-3 w-full">
                    <label className="block text-sm font-extrabold text-slate-700 text-center uppercase tracking-wider">{selectedMatch?.away}</label>
                    <input type="number" min="0" placeholder="0" className="w-full text-center text-4xl font-black p-4 border-2 border-navy-light rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-navy-light outline-none transition-all shadow-lg shadow-black/20 bg-navy" />
                  </div>
               </div>

               {/* Goal Scorers dynamic form */}
               <div>
                  <div className="flex justify-between items-center mb-4 pl-1">
                     <h4 className="font-bold text-white text-lg flex items-center gap-2">
                        <Goal className="w-5 h-5 text-emerald-500" /> Goal Scorers Tracker
                     </h4>
                     <button onClick={addGoal} className="text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Goal
                     </button>
                  </div>

                  {goals.length === 0 ? (
                     <div className="border-2 border-dashed border-navy-light rounded-xl p-8 text-center text-slate-400">
                        No goals recorded yet. Click 'Add Goal' to update events.
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {goals.map((goal, index) => (
                           <div key={goal.id} className="flex flex-col sm:flex-row gap-3 bg-navy border border-navy-light p-3 rounded-xl shadow-lg shadow-black/20 items-end sm:items-center animate-in slide-in-from-top-2">
                              <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-gray-400 shrink-0">
                                 {index + 1}
                              </div>
                              <select 
                                value={goal.team} 
                                onChange={(e) => updateGoal(goal.id, 'team', e.target.value)}
                                className="w-full sm:w-1/3 p-2.5 border border-slate-300 rounded-lg text-sm bg-navy-dark focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                              >
                                 <option value="home">{selectedMatch?.home} (Home)</option>
                                 <option value="away">{selectedMatch?.away} (Away)</option>
                              </select>
                              
                              <select 
                                value={goal.player} 
                                onChange={(e) => updateGoal(goal.id, 'player', e.target.value)}
                                className="w-full sm:flex-1 p-2.5 border border-slate-300 rounded-lg text-sm bg-navy-dark focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                              >
                                 <option value="">-- Select Player --</option>
                                 <option value="1">Nguyễn Văn A (10)</option>
                                 <option value="2">Trần Văn B (8)</option>
                                 <option value="3">Phạm Văn C (9)</option>
                                 {/* Just dummy options for now */}
                              </select>

                              <div className="flex w-full sm:w-auto gap-3 items-center">
                                 <input 
                                    type="number" 
                                    placeholder="Min (e.g. 45)" 
                                    value={goal.minute}
                                    onChange={(e) => updateGoal(goal.id, 'minute', e.target.value)}
                                    className="flex-1 w-24 sm:w-20 p-2.5 border border-slate-300 rounded-lg text-sm bg-navy-dark focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold" 
                                 />
                                 <button 
                                    onClick={() => removeGoal(goal.id)}
                                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg border border-red-100 transition-colors shrink-0" 
                                    title="Remove Goal"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 bg-navy-dark rounded-b-2xl flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="w-full sm:w-auto px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors border border-transparent hover:border-slate-300">
                Cancel
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#003280] hover:bg-navy-light text-white font-bold rounded-lg shadow-md shadow-blue-500/30 transition-colors">
                <Save className="w-4 h-4" /> Save & Update Standings
              </button>
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
