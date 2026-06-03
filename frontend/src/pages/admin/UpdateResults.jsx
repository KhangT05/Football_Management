import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Save, CheckCircle, Plus, Trash2, Clock, Goal, Activity } from 'lucide-react';
import { activeMatches } from '../../data/data';


export default function UpdateResults() {
  const [selectedMatchId, setSelectedMatchId] = useState(activeMatches[0].id);
  const match = activeMatches.find(m => m.id === parseInt(selectedMatchId)) || activeMatches[0];

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const [homeEvents, setHomeEvents] = useState([{ id: 1, player: '1', minute: '15' }]);
  const [awayEvents, setAwayEvents] = useState([]);

  const addHomeEvent = () => setHomeEvents([...homeEvents, { id: Date.now(), player: '', minute: '' }]);
  const removeHomeEvent = (id) => setHomeEvents(homeEvents.filter(e => e.id !== id));
  const updateHomeEvent = (id, field, value) => setHomeEvents(homeEvents.map(e => e.id === id ? { ...e, [field]: value } : e));

  const addAwayEvent = () => setAwayEvents([...awayEvents, { id: Date.now(), player: '', minute: '' }]);
  const removeAwayEvent = (id) => setAwayEvents(awayEvents.filter(e => e.id !== id));
  const updateAwayEvent = (id, field, value) => setAwayEvents(awayEvents.map(e => e.id === id ? { ...e, [field]: value } : e));

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                 <Activity className="w-6 h-6 text-neon" /> Match Controller
              </h2>
              <p className="text-gray-400 text-sm mt-1">Giao diện chuyên biệt cập nhật tỷ số và diễn biến trên sân cỏ theo thời gian thực.</p>
           </div>
        </div>

        {/* Match Selector */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20">
           <label className="block text-sm font-bold text-slate-700 mb-2">Select Target Match</label>
           <select 
             className="w-full text-lg p-3 bg-navy-dark border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-white"
             value={selectedMatchId}
             onChange={(e) => setSelectedMatchId(e.target.value)}
           >
              {activeMatches.map(m => (
                 <option key={m.id} value={m.id}>{m.home} vs {m.away} — [{m.date}]</option>
              ))}
           </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Mobile View -> Left col, Tablet/Desktop -> Col spans 4 */}
           {/* Left Column: Home Events */}
           <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-4">
              <div className="bg-navy p-4 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex-1">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-white flex items-center gap-1.5 uppercase text-sm tracking-wider">
                       <Goal className="w-4 h-4 text-emerald-500" /> Home Goals
                    </h3>
                    <button onClick={addHomeEvent} className="p-1.5 text-neon bg-blue-50 hover:bg-navy-light rounded-lg transition-colors" title="Add Goal">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    {homeEvents.map((evt) => (
                       <div key={evt.id} className="flex flex-col gap-2 p-3 bg-navy-dark rounded-xl border border-slate-100 relative group animate-in slide-in-from-left-2">
                          <button onClick={() => removeHomeEvent(evt.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-navy border border-red-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="flex gap-2">
                             <select className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg outline-none font-medium text-slate-700" value={evt.player} onChange={(e) => updateHomeEvent(evt.id, 'player', e.target.value)}>
                                <option value="">Select Player...</option>
                                <option value="1">Nguyễn Văn A (10)</option>
                                <option value="2">Trần Văn B (8)</option>
                             </select>
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                             <input type="number" placeholder="Min" value={evt.minute} onChange={(e) => updateHomeEvent(evt.id, 'minute', e.target.value)} className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg outline-none text-center font-bold" />
                          </div>
                       </div>
                    ))}
                    {homeEvents.length === 0 && <p className="text-xs text-center text-slate-400 italic py-4">No goals recorded yet.</p>}
                 </div>
              </div>
           </div>

           {/* Central Main Scoreboard: Col spans 6 */}
           <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="bg-navy p-6 md:p-10 rounded-3xl border border-navy-light shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
                 <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-emerald-500 to-amber-500"></div>
                 
                 <div className="text-center mb-8">
                    <span className="bg-red-100 border border-red-200 text-red-500 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full animate-pulse">
                       {match.date}
                    </span>
                 </div>

                 <div className="flex items-center justify-center gap-4 sm:gap-8">
                    
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1 max-w-[120px]">
                       <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-slate-100 bg-navy-dark flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-3">
                         {match.homeLogo}
                       </div>
                       <h3 className="font-extrabold text-white text-center uppercase tracking-wider text-sm sm:text-base line-clamp-1">{match.home}</h3>
                    </div>

                    {/* Scores */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                       <input 
                         type="number" 
                         min="0"
                         value={homeScore}
                         onChange={(e) => setHomeScore(e.target.value)}
                         className="w-16 h-20 sm:w-24 sm:h-28 text-center text-4xl sm:text-6xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-navy-light outline-none transition-all shadow-inner text-white"
                       />
                       <span className="text-2xl sm:text-4xl font-black text-slate-300">-</span>
                       <input 
                         type="number" 
                         min="0"
                         value={awayScore}
                         onChange={(e) => setAwayScore(e.target.value)}
                         className="w-16 h-20 sm:w-24 sm:h-28 text-center text-4xl sm:text-6xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-inner text-white"
                       />
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1 max-w-[120px]">
                       <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-slate-100 bg-navy-dark flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-3">
                         {match.awayLogo}
                       </div>
                       <h3 className="font-extrabold text-white text-center uppercase tracking-wider text-sm sm:text-base line-clamp-1">{match.away}</h3>
                    </div>

                 </div>
              </div>
           </div>

           {/* Right Column: Away Events */}
           <div className="lg:col-span-3 order-3 flex flex-col gap-4">
              <div className="bg-navy p-4 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex-1">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-white flex items-center gap-1.5 uppercase text-sm tracking-wider">
                       <Goal className="w-4 h-4 text-emerald-500" /> Away Goals
                    </h3>
                    <button onClick={addAwayEvent} className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors" title="Add Goal">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    {awayEvents.map((evt) => (
                       <div key={evt.id} className="flex flex-col gap-2 p-3 bg-navy-dark rounded-xl border border-slate-100 relative group animate-in slide-in-from-right-2">
                          <button onClick={() => removeAwayEvent(evt.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-navy border border-red-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="flex gap-2">
                             <select className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg outline-none font-medium text-slate-700" value={evt.player} onChange={(e) => updateAwayEvent(evt.id, 'player', e.target.value)}>
                                <option value="">Select Player...</option>
                                <option value="1">Lê Văn X (11)</option>
                                <option value="2">Hồ Văn Y (9)</option>
                             </select>
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                             <input type="number" placeholder="Min" value={evt.minute} onChange={(e) => updateAwayEvent(evt.id, 'minute', e.target.value)} className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg outline-none text-center font-bold" />
                          </div>
                       </div>
                    ))}
                    {awayEvents.length === 0 && <p className="text-xs text-center text-slate-400 italic py-4">No goals recorded yet.</p>}
                 </div>
              </div>
           </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
           <p className="text-sm font-medium text-gray-400 text-center sm:text-left">
              Hãy kiểm tra kỹ thông tin thẻ phạt và diễn biến trước khi cập nhật dữ liệu public.
           </p>
           <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 shrink-0">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                 <Save className="w-5 h-5" /> Save Draft
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider">
                 <CheckCircle className="w-5 h-5" /> Finish & Update Standings
              </button>
           </div>
        </div>

      </div>
    </AdminLayout>
  );
}
