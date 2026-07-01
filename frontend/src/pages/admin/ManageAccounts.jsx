import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { User, Shield, ShieldCheck } from 'lucide-react';

import UsersTab from '../../components/admin/tabs/UsersTab';
import RolesTab from '../../components/admin/tabs/RolesTab';
import ApprovePlayersTab from '../../components/admin/ApprovePlayersTab';

export default function ManageAccounts() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Tài khoản & Phân quyền</h2>
            <p className="text-gray-400 text-sm mt-1">
              Quản lý người dùng, thiết lập vai trò và xét duyệt hồ sơ cầu thủ.
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex bg-navy border-b border-navy-light overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <User className="w-4 h-4" /> Danh sách Người dùng
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <Shield className="w-4 h-4" /> Vai trò (Roles)
          </button>
          <button
            onClick={() => setActiveTab('approve')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'approve'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Duyệt Cầu thủ
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'approve' && <ApprovePlayersTab />}
        </div>
      </div>
    </AdminLayout>
  );
}
