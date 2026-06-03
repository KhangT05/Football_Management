import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Filter, Plus, Edit, Trash2, X, UploadCloud, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { initialPlayers } from '../../data/data';


export default function ManagePlayers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Main Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Manage Players</h2>
              <p className="text-gray-400 text-sm mt-1">Danh sách tổng hợp và quản lý hồ sơ cầu thủ của mọi đội bóng.</p>
           </div>
           <button 
              onClick={() => { setModalMode('add'); setIsModalOpen(true); }}
              className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all"
           >
              <Plus className="w-5 h-5" /> Add New Player
           </button>
        </div>

        {/* Top Controls Toolbar */}
        <div className="bg-navy p-4 rounded-xl shadow-lg shadow-black/20 border border-navy-light flex flex-col sm:flex-row gap-4 justify-between items-center">
           {/* Search */}
           <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                 type="text" 
                 placeholder="Search by Name or Jersey No..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-navy-dark text-slate-700" 
              />
           </div>

           {/* Filter */}
           <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select 
                 value={filterTeam}
                 onChange={(e) => setFilterTeam(e.target.value)}
                 className="p-2 w-full sm:w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 bg-navy-dark"
              >
                 <option value="All">All Teams</option>
                 <option value="KTPM K21">KTPM K21</option>
                 <option value="MMT K22">MMT K22</option>
                 <option value="ATTT K21">ATTT K21</option>
                 {/* Can map teamsData dynamically here */}
              </select>
           </div>
        </div>

        {/* Players Data Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden flex flex-col">
           <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-max">
                 <thead>
                    <tr className="bg-navy-dark text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                       <th className="py-4 px-6 text-center w-16">Avatar</th>
                       <th className="py-4 px-6">Player Name</th>
                       <th className="py-4 px-6 text-center">Jersey No.</th>
                       <th className="py-4 px-6 text-center">Position</th>
                       <th className="py-4 px-6">Team</th>
                       <th className="py-4 px-6 text-center">Total Goals</th>
                       <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm">
                    {initialPlayers.map((p) => (
                       <tr key={p.id} className="hover:bg-navy-dark transition-colors group">
                          <td className="py-3 px-6 text-center">
                             <div className="w-10 h-10 rounded-full border border-navy-light bg-slate-100 mx-auto overflow-hidden">
                                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                             </div>
                          </td>
                          <td className="py-3 px-6">
                             <p className="font-bold text-white">{p.name}</p>
                          </td>
                          <td className="py-3 px-6 text-center font-black text-slate-600">{p.number}</td>
                          <td className="py-3 px-6 text-center">
                             <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md border border-navy-light">
                                {p.position}
                             </span>
                          </td>
                          <td className="py-3 px-6">
                             <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 border border-navy-light flex items-center justify-center text-xs">{p.teamLogo}</span>
                                <span className="font-medium text-slate-600">{p.team}</span>
                             </div>
                          </td>
                          <td className="py-3 px-6 text-center font-bold text-neon">{p.goals > 0 ? p.goals : '-'}</td>
                          <td className="py-3 px-6 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                   onClick={() => { setModalMode('edit'); setIsModalOpen(true); }}
                                   className="p-1.5 text-blue-500 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit"
                                >
                                   <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-red-500 hover:bg-red-50 cursor-pointer rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete">
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Pagination */}
           <div className="p-4 border-t border-navy-light bg-navy-dark flex items-center justify-between text-sm text-gray-400">
               <div>Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">6</span> of <span className="font-bold text-slate-700">45</span> players</div>
               <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-slate-200 text-gray-400 transition-colors disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                  <span className="px-3 py-1 bg-[#003280] text-white font-bold rounded shadow-lg shadow-black/20">1</span>
                  <button className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold rounded transition-colors">2</button>
                  <button className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold rounded transition-colors">3</button>
                  <button className="p-1.5 rounded hover:bg-slate-200 text-gray-400 transition-colors"><ChevronRight className="w-5 h-5"/></button>
               </div>
           </div>
        </div>

      </div>

      {/* Add / Edit Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-navy rounded-3xl shadow-2xl relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-navy-dark/50">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                 {modalMode === 'add' ? 'Add New Player' : 'Edit Player ProfilE'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors shrink-0 bg-navy shadow-lg shadow-black/20 border border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
               
               {/* Avatar Upload */}
               <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 bg-navy-dark flex flex-col items-center justify-center text-slate-400 shadow-inner group hover:bg-slate-100 cursor-pointer transition-colors relative overflow-hidden">
                     {modalMode === 'add' ? (
                        <>
                           <User className="w-8 h-8 mb-1" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                        </>
                     ) : (
                        <>
                           <img src={initialPlayers[0].avatar} alt="" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                              <UploadCloud className="w-6 h-6 text-white" />
                           </div>
                        </>
                     )}
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                     <input type="text" placeholder="Nguyễn Văn A" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white bg-navy-dark" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Jersey Number</label>
                        <input type="number" placeholder="10" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white bg-navy-dark font-bold block" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Position</label>
                        <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white bg-navy-dark">
                           <option value="GK">GK - Goalkeeper</option>
                           <option value="DEF">DEF - Defender</option>
                           <option value="MID">MID - Midfielder</option>
                           <option value="FWD">FW - Forward</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Select Team</label>
                     <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white bg-navy-dark">
                        <option value="">-- Choose Team --</option>
                        <option value="KTPM K21">KTPM K21</option>
                        <option value="MMT K22">MMT K22</option>
                        <option value="ATTT K21">ATTT K21</option>
                        <option value="HTTT K21">HTTT K21</option>
                     </select>
                  </div>

               </div>
               
            </div>

            <div className="p-4 border-t border-slate-100 bg-navy-dark flex items-center justify-end gap-3 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto">
                 Cancel
               </button>
               <button className="flex-1 sm:flex-none px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-sm tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                 {modalMode === 'add' ? 'Create Player' : 'Save Changes'}
               </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
