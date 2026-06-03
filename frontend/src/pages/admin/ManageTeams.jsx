import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Plus, Edit, Trash2, Users, X, Save, UploadCloud, ChevronDown, ChevronUp } from 'lucide-react';
import { teamsData, rosterData } from '../../data/data';

export default function ManageTeams() {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  const toggleRoster = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
             <h2 className="text-2xl font-extrabold text-white tracking-tight">Manage Teams</h2>
             <p className="text-gray-400 text-sm mt-1">Quản lý thông tin đội bóng và danh sách cầu thủ</p>
          </div>
          <button 
             onClick={() => setIsTeamModalOpen(true)}
             className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Team
          </button>
        </div>

        {/* Teams Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden text-slate-600">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">ID</th>
                  <th className="py-4 px-6 w-20 text-center">Logo</th>
                  <th className="py-4 px-6">Team Name</th>
                  <th className="py-4 px-6 text-center">Total Players</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamsData.map((team) => (
                  <React.Fragment key={team.id}>
                    {/* Main Team Row */}
                    <tr className="hover:bg-navy-dark/80 transition-colors">
                      <td className="py-4 px-6 text-center font-medium text-gray-400">#{team.id}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm mx-auto shadow-inner border border-slate-700">
                           {team.logo}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-slate-900">{team.name}</p>
                          <p className="text-xs text-gray-400">HLV: {team.coach}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-medium text-slate-700">
                        {team.players}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-neon hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 outline-none" title="Edit Team">
                            <Edit className="w-4 h-4" /> 
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 outline-none mr-2" title="Delete Team">
                            <Trash2 className="w-4 h-4" /> 
                          </button>
                          <button 
                            onClick={() => toggleRoster(team.id)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md border transition-colors shrink-0 ${expandedTeamId === team.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-navy-dark text-slate-600 hover:bg-slate-100 border-navy-light'}`}
                          >
                            <Users className="w-4 h-4 shrink-0" /> 
                            <span className="hidden sm:inline">Manage Roster</span>
                            {expandedTeamId === team.id ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Roster Sub-table */}
                    {expandedTeamId === team.id && (
                      <tr className="bg-navy-dark/50">
                        <td colSpan="5" className="p-0 border-b border-navy-light">
                          <div className="p-6 border-l-4 border-slate-800 bg-navy-dark/80 shadow-md inset-y-0">
                            
                            <div className="flex items-center justify-between mb-4">
                               <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                 <Users className="w-4 h-4 text-gray-400" /> Current Players ({team.short})
                               </h4>
                               <button className="text-xs bg-navy hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 shadow-lg shadow-black/20">
                                 <Plus className="w-3.5 h-3.5" /> Add Player
                               </button>
                            </div>

                            <div className="bg-navy border border-navy-light rounded-lg overflow-hidden shadow-lg shadow-black/20">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="bg-slate-100 text-gray-400 font-semibold border-b border-navy-light">
                                    <th className="py-2.5 px-4 w-16 text-center">No.</th>
                                    <th className="py-2.5 px-4">Player Name</th>
                                    <th className="py-2.5 px-4 w-40">Position</th>
                                    <th className="py-2.5 px-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {rosterData.map((player) => (
                                    <tr key={player.id} className="hover:bg-navy-dark transition-colors">
                                      <td className="py-2.5 px-4 text-center font-bold text-slate-400">{player.number}</td>
                                      <td className="py-2.5 px-4 font-medium text-slate-700 flex items-center gap-3">
                                         <img src={player.avatar} alt="avatar" className="w-6 h-6 rounded-full bg-slate-200" />
                                         {player.name}
                                      </td>
                                      <td className="py-2.5 px-4 text-gray-400">{player.position}</td>
                                      <td className="py-2.5 px-4 text-right">
                                         <button className="text-blue-500 hover:text-blue-700 mx-1"><Edit className="w-3.5 h-3.5" /></button>
                                         <button className="text-red-500 hover:text-red-500 mx-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add/Edit Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="bg-navy rounded-2xl shadow-2xl relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-navy-dark text-white">
              <h3 className="text-xl font-bold">Add New Team</h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
               {/* Team Name */}
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Team Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Kỹ thuật Phần mềm K24" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-lg shadow-black/20" />
               </div>

               {/* Logo Upload */}
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Team Logo</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-navy-dark hover:bg-slate-100 transition-colors cursor-pointer group">
                     <div className="w-12 h-12 bg-navy rounded-full shadow-lg shadow-black/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-emerald-500" />
                     </div>
                     <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                     <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                     <input type="file" className="hidden" />
                  </div>
               </div>

               {/* Description */}
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description / Coach Info</label>
                  <textarea rows="3" placeholder="Additional details..." className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-lg shadow-black/20 resize-none"></textarea>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-navy-dark flex justify-end gap-3">
              <button onClick={() => setIsTeamModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md shadow-emerald-500/30 transition-colors">
                <Save className="w-4 h-4" /> Save Team
              </button>
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
