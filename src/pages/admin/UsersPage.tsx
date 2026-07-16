import { useState } from 'react';
import { Ban, Trash2, Users, CheckCircle, Building2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminNav } from './admin-nav';
import { userService, companyService, notificationService } from '../../lib/services';
import { useAsync } from '../../lib/use-async';
import { TableSkeleton } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import Modal from '../../components/Modal';
import { useToast } from '../../lib/toast-context';
import { formatDate } from '../../lib/utils';
import type { Company } from '../../lib/types';

const getFallbackEmail = (displayName: string) => {
  if (!displayName) return '';
  const name = displayName.trim();
  
  if (name === 'FlyNow Admin') return 'admin@flynow.com';
  if (name === 'Sarah Mitchell') return 'user@flynow.com';
  if (name === 'TechNova Electronics') return 'company@flynow.com';
  if (name === 'BloomHome Decor') return 'company1@flynow.com';
  if (name === 'TinyTreasures Baby') return 'company2@flynow.com';
  if (name === 'UrbanThread Fashion') return 'company3@flynow.com';
  if (name === 'StepRight Footwear') return 'company4@flynow.com';
  if (name === 'ChefMaster Cookware') return 'company5@flynow.com';
  if (name === 'GlowPure Skincare') return 'company6@flynow.com';
  if (name === 'FreshCart Grocery') return 'company7@flynow.com';
  if (name === 'ProAthlete Sports') return 'company8@flynow.com';
  
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@flynow.com`;
};

export default function UsersPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  
  // Fetch users and companies
  const { data: users, loading: usersLoading, reload: reloadUsers } = useAsync(() => userService.list(), []);
  const { data: companies, loading: companiesLoading, reload: reloadCompanies } = useAsync(() => companyService.listAll(), []);

  // Filter states
  const [companyFilter, setCompanyFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Modal / Dialog states
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [toDeleteCompany, setToDeleteCompany] = useState<string | null>(null);
  const [toDeleteUser, setToDeleteUser] = useState<string | null>(null);

  // Actions for Companies
  const setCompanyStatus = async (c: Company, status: 'approved' | 'suspended' | 'pending') => {
    try {
      await companyService.update(c.id, { status });
      await notificationService.create({ 
        type: status === 'approved' ? 'company_approval' : 'company_status', 
        title: `Company ${status}`, 
        message: `${c.name} is now ${status}.`, 
        target_role: 'all', 
        ref_id: c.id 
      });
      show(`Company ${status}`, 'success'); 
      reloadCompanies();
    } catch (e) { 
      show((e as Error).message, 'error'); 
    }
  };

  const deleteCompany = async () => {
    if (!toDeleteCompany) return;
    try { 
      await companyService.remove(toDeleteCompany); 
      show('Company deleted', 'success'); 
      reloadCompanies(); 
    } catch (e) { 
      show((e as Error).message, 'error'); 
    }
    setToDeleteCompany(null);
  };

  // Actions for Users
  const setUserStatus = async (id: string, status: 'active' | 'suspended') => {
    try { 
      await userService.updateStatus(id, status); 
      show(`User account ${status}`, 'success'); 
      reloadUsers(); 
    } catch (e) { 
      show((e as Error).message, 'error'); 
    }
  };

  const deleteUser = async () => {
    if (!toDeleteUser) return;
    try { 
      await userService.remove(toDeleteUser); 
      show('User account deleted', 'success'); 
      reloadUsers(); 
    } catch (e) { 
      show((e as Error).message, 'error'); 
    }
    setToDeleteUser(null);
  };

  // Filtered lists
  const filteredCompanies = (companies ?? []).filter((c) => companyFilter === 'all' || c.status === companyFilter);
  const filteredUsers = (users ?? []).filter((u) => userFilter === 'all' || u.role === userFilter);

  const isLoading = activeTab === 'companies' ? companiesLoading : usersLoading;

  return (
    <DashboardLayout items={adminNav} brand="Admin">
      <div className="flex items-center justify-between mb-24 wrap">
        <div>
          <h1 style={{ fontSize: 26 }}>Platform Accounts</h1>
          <p className="text-muted mt-8">Manage company approvals, platform users, and user credentials.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-24 mb-24" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        <button 
          className={`pb-12 font-semibold text-lg relative`}
          onClick={() => setActiveTab('companies')}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            paddingBottom: '12px',
            color: activeTab === 'companies' ? 'var(--primary-dark)' : 'var(--text-muted)',
            fontWeight: activeTab === 'companies' ? 700 : 500,
            transition: 'all 0.2s'
          }}
        >
          Companies
          {activeTab === 'companies' && (
            <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, background: 'var(--primary)', borderRadius: '3px 3px 0 0' }} />
          )}
        </button>
        <button 
          className={`pb-12 font-semibold text-lg relative`}
          onClick={() => setActiveTab('users')}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            paddingBottom: '12px',
            color: activeTab === 'users' ? 'var(--primary-dark)' : 'var(--text-muted)',
            fontWeight: activeTab === 'users' ? 700 : 500,
            transition: 'all 0.2s'
          }}
        >
          User Logins
          {activeTab === 'users' && (
            <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 3, background: 'var(--primary)', borderRadius: '3px 3px 0 0' }} />
          )}
        </button>
      </div>

      {/* Filter and Content Controls */}
      <div className="flex items-center justify-end mb-16">
        {activeTab === 'companies' ? (
          <div className="flex items-center gap-8">
            {['all', 'pending', 'approved', 'suspended'].map((f) => (
              <button 
                key={f} 
                className={`btn btn-sm ${companyFilter === f ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setCompanyFilter(f)} 
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-8">
            {['all', 'user', 'company', 'admin'].map((f) => (
              <button 
                key={f} 
                className={`btn btn-sm ${userFilter === f ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setUserFilter(f)} 
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Content */}
      {isLoading ? (
        <TableSkeleton />
      ) : activeTab === 'companies' ? (
        filteredCompanies.length === 0 ? (
          <EmptyState icon={<Building2 size={48} />} title="No companies" />
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Website</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-12">
                        {c.logo_url ? (
                          <img src={c.logo_url} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                        ) : (
                          <div className="stat-icon" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary-dark)', fontSize: 16, fontWeight: 700 }}>
                            {c.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-muted">{c.description?.slice(0, 45)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{c.contact_email}</div>
                      <div className="text-xs text-muted">{c.phone}</div>
                    </td>
                    <td className="text-sm">
                      {c.website ? (
                        <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-dark)', textDecoration: 'none' }}>
                          {c.website}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-sm">{formatDate(c.created_at)}</td>
                    <td>
                      <span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-8">
                        <button 
                          className="btn-icon btn-secondary" 
                          onClick={() => setViewingCompany(c)} 
                          title="View Details"
                          style={{ width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          disabled={c.status === 'approved'} 
                          onClick={() => setCompanyStatus(c, 'approved')} 
                          title="Approve Company"
                          style={{ 
                            background: c.status === 'approved' ? 'var(--border)' : '#22c55e', 
                            color: '#fff', 
                            border: 'none', 
                            cursor: c.status === 'approved' ? 'not-allowed' : 'pointer', 
                            width: 30, 
                            height: 30, 
                            borderRadius: '50%', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: c.status === 'approved' ? 0.5 : 1
                          }}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          disabled={c.status === 'suspended'} 
                          onClick={() => setCompanyStatus(c, 'suspended')} 
                          title="Suspend Company"
                          style={{ 
                            background: c.status === 'suspended' ? 'var(--border)' : 'var(--surface-dark)', 
                            color: 'var(--text-main)', 
                            border: '1px solid var(--border)', 
                            cursor: c.status === 'suspended' ? 'not-allowed' : 'pointer', 
                            width: 30, 
                            height: 30, 
                            borderRadius: '50%', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: c.status === 'suspended' ? 0.5 : 1
                          }}
                        >
                          <Ban size={14} />
                        </button>
                        <button 
                          onClick={() => setToDeleteCompany(c.id)} 
                          title="Delete Company"
                          style={{ 
                            background: '#ef4444', 
                            color: '#fff', 
                            border: 'none', 
                            cursor: 'pointer', 
                            width: 30, 
                            height: 30, 
                            borderRadius: '50%', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : filteredUsers.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No users" />
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-12">
                      <div className="stat-icon" style={{ width: 36, height: 36, background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontSize: 13, fontWeight: 700 }}>
                        {u.display_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="font-semibold">{u.display_name || 'No Name'}</div>
                    </div>
                  </td>
                  <td className="text-sm">{u.email || getFallbackEmail(u.display_name)}</td>
                  <td>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-sm">{formatDate(u.created_at)}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-8">
                      <button 
                        className="btn-icon btn-secondary" 
                        disabled={u.status === 'suspended'} 
                        onClick={() => setUserStatus(u.id, 'suspended')} 
                        title="Suspend User"
                        style={{ width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Ban size={14} />
                      </button>
                      <button 
                        className="btn-icon btn-success" 
                        disabled={u.status === 'active'} 
                        onClick={() => setUserStatus(u.id, 'active')} 
                        title="Activate User"
                        style={{ 
                          background: u.status === 'active' ? 'var(--border)' : '#22c55e', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: u.status === 'active' ? 'not-allowed' : 'pointer', 
                          width: 30, 
                          height: 30, 
                          borderRadius: '50%', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          opacity: u.status === 'active' ? 0.5 : 1
                        }}
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button 
                        className="btn-icon btn-danger" 
                        onClick={() => setToDeleteUser(u.id)} 
                        title="Delete User"
                        style={{ 
                          background: '#ef4444', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer', 
                          width: 30, 
                          height: 30, 
                          borderRadius: '50%', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Company Modal */}
      <Modal 
        open={!!viewingCompany} 
        onClose={() => setViewingCompany(null)} 
        title="Company Details" 
        maxWidth={540}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setViewingCompany(null)}>
              Close
            </button>
            {viewingCompany?.status === 'pending' && (
              <button className="btn btn-success" onClick={() => { setCompanyStatus(viewingCompany, 'approved'); setViewingCompany(null); }}>
                Approve
              </button>
            )}
          </>
        }
      >
        {viewingCompany && (
          <div className="flex-col gap-16">
            <div className="flex items-center gap-16">
              {viewingCompany.logo_url ? (
                <img src={viewingCompany.logo_url} style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }} />
              ) : (
                <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--primary-50)', color: 'var(--primary-dark)', borderRadius: 14, fontSize: 26, fontWeight: 700 }}>
                  {viewingCompany.name[0]}
                </div>
              )}
              <div>
                <h3>{viewingCompany.name}</h3>
                <span className={`badge ${viewingCompany.status === 'approved' ? 'badge-success' : viewingCompany.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                  {viewingCompany.status}
                </span>
              </div>
            </div>
            <p className="text-muted">{viewingCompany.description}</p>
            <div className="grid grid-2" style={{ gap: 12 }}>
              <div><div className="text-xs text-muted">Email</div><div className="font-semibold">{viewingCompany.contact_email}</div></div>
              <div><div className="text-xs text-muted">Phone</div><div className="font-semibold">{viewingCompany.phone || '—'}</div></div>
              <div><div className="text-xs text-muted">Address</div><div className="font-semibold">{viewingCompany.address || '—'}</div></div>
              <div><div className="text-xs text-muted">Website</div><div className="font-semibold">{viewingCompany.website || '—'}</div></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Deletions */}
      <ConfirmDialog 
        open={!!toDeleteCompany} 
        title="Delete Company" 
        message="This will remove the company and all its coupons." 
        danger 
        confirmLabel="Delete" 
        onConfirm={deleteCompany} 
        onCancel={() => setToDeleteCompany(null)} 
      />

      <ConfirmDialog 
        open={!!toDeleteUser} 
        title="Delete User" 
        message="This will permanently remove the user account." 
        danger 
        confirmLabel="Delete" 
        onConfirm={deleteUser} 
        onCancel={() => setToDeleteUser(null)} 
      />
    </DashboardLayout>
  );
}
