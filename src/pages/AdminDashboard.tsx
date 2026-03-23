import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, HardHat, LogOut,
  CheckCircle, XCircle, Clock, Shield, AlertTriangle,
  DollarSign, ChevronDown, ChevronUp, RefreshCw,
} from 'lucide-react';

const ADMIN_SECRET = 'hrop2026';
const API_HEADERS = { 'X-Admin-Secret': ADMIN_SECRET };

async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`/api/admin/${path}`, {
    ...options,
    headers: { ...API_HEADERS, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Status badge ───
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#0099A8',
    assigned: '#6366f1',
    in_progress: '#3b82f6',
    accepted: '#3b82f6',
    available: '#8b5cf6',
    completed: '#10b981',
    paid: '#10b981',
    rejected: '#ef4444',
    cancelled: '#6b7280',
    failed: '#ef4444',
    passed: '#10b981',
    submitted: '#f59e0b',
    suspended: '#6b7280',
  };
  const color = colors[status] || '#6b7280';
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    tenant: '#3b82f6',
    landlord: '#8b5cf6',
    service_provider: '#0099A8',
  };
  const color = colors[role] || '#6b7280';
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {role === 'service_provider' ? 'Trade Pro' : role}
    </span>
  );
}

// ─── Overview Tab ───
function OverviewTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('stats').then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!stats) return <p className="text-gray-400">Failed to load stats.</p>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Total Trade Pros', value: stats.totalTradePros, icon: HardHat, color: '#0099A8' },
    { label: 'Pending Onboarding', value: stats.pendingOnboarding, icon: Clock, color: '#f59e0b' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: '#8b5cf6' },
    { label: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle, color: '#10b981' },
    { label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#0099A8' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: '#111F36', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.color}18` }}>
                <c.icon className="w-5 h-5" style={{ color: c.color }} />
              </div>
              <span className="text-gray-400 text-sm">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Recent Maintenance Requests</h3>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111F36' }}>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Title</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Category</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Priority</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Status</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentRequests.map((r: any) => (
              <tr key={r.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3 text-white">{r.title}</td>
                <td className="px-4 py-3 text-gray-300 capitalize">{r.category}</td>
                <td className="px-4 py-3"><StatusBadge status={r.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {stats.recentRequests.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No requests yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Trade Pros Tab ───
function TradeProsTab() {
  const [tradePros, setTradePros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch('trade-pros').then(setTradePros).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateProvider = async (id: string, updates: Record<string, any>) => {
    setUpdating(id);
    try {
      await adminFetch('trade-pros', {
        method: 'PATCH',
        body: JSON.stringify({ id, updates }),
      });
      load();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = tradePros.filter((p) => {
    if (filter === 'pending') return !p.onboarding_complete && p.available;
    if (filter === 'approved') return p.onboarding_complete;
    if (filter === 'suspended') return !p.available;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gray-400 text-sm">Filter:</span>
        {['all', 'pending', 'approved', 'suspended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer capitalize"
            style={{
              backgroundColor: filter === f ? '#0099A8' : 'rgba(255,255,255,0.06)',
              color: filter === f ? '#fff' : '#9ca3af',
            }}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Pending Review' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 rounded-lg cursor-pointer" style={{ color: '#0099A8' }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111F36' }}>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Name</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Business</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Trade</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium text-center">WSIB</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium text-center">Insurance</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium text-center">Background</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium text-center">Stripe</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium text-center">Onboarded</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const name = p.profiles?.full_name || '—';
              const isUpdating = updating === p.id;
              const canApprove = p.wsib_clearance_verified && p.trade_licence_verified && !p.onboarding_complete;

              return (
                <tr key={p.id} className="border-t hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-white font-medium">{name}</td>
                  <td className="px-4 py-3 text-gray-300">{p.business_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{p.service_type}</td>
                  <td className="px-4 py-3 text-center">
                    {p.wsib_clearance_verified ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.insurance_verified ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={p.background_check_status || 'pending'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.stripe_onboarded ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-gray-500 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.onboarding_complete ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-gray-500 mx-auto" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {!p.wsib_clearance_verified && (
                        <ActionBtn
                          label="Verify WSIB"
                          color="#10b981"
                          disabled={isUpdating}
                          onClick={() => updateProvider(p.id, { wsib_clearance_verified: true, wsib_last_verified_at: new Date().toISOString() })}
                        />
                      )}
                      {!p.trade_licence_verified && (
                        <ActionBtn
                          label="Verify Licence"
                          color="#3b82f6"
                          disabled={isUpdating}
                          onClick={() => updateProvider(p.id, { trade_licence_verified: true })}
                        />
                      )}
                      {canApprove && (
                        <ActionBtn
                          label="Approve"
                          color="#0099A8"
                          disabled={isUpdating}
                          onClick={() => updateProvider(p.id, { onboarding_complete: true })}
                        />
                      )}
                      {p.available ? (
                        <ActionBtn
                          label="Suspend"
                          color="#ef4444"
                          disabled={isUpdating}
                          onClick={() => updateProvider(p.id, { available: false })}
                        />
                      ) : (
                        <ActionBtn
                          label="Reactivate"
                          color="#10b981"
                          disabled={isUpdating}
                          onClick={() => updateProvider(p.id, { available: true })}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No trade pros found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({ label, color, disabled, onClick }: { label: string; color: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </button>
  );
}

// ─── Jobs Tab ───
function JobsTab() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    adminFetch('jobs').then(setJobs).finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all' ? jobs : jobs.filter((j) => j.status === statusFilter);
  const statuses = ['all', 'available', 'accepted', 'in_progress', 'completed', 'paid', 'cancelled'];

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-gray-400 text-sm">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm text-white outline-none"
          style={{ backgroundColor: '#111F36', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111F36' }}>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Job ID</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Request</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Address</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Trade Pro</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Status</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Cost</th>
              <th className="text-left text-gray-400 px-4 py-3 font-medium">Created</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => {
              const req = j.maintenance_requests;
              const provider = j.service_providers;
              const expanded = expandedId === j.id;

              return (
                <Fragment key={j.id}>
                  <tr
                    className="border-t hover:bg-white/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    onClick={() => setExpandedId(expanded ? null : j.id)}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{j.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-white">{req?.title || '—'}</td>
                    <td className="px-4 py-3 text-gray-300">{req?.properties?.address ? `${req.properties.address}, ${req.properties.city}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-300">{provider?.profiles?.full_name || provider?.business_name || <span className="text-yellow-400 italic">Unassigned</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                    <td className="px-4 py-3 text-white">{j.cost ? `$${Number(j.cost).toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(j.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                  </tr>
                  {expanded && (
                    <tr style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <td colSpan={8} className="px-6 py-4" style={{ backgroundColor: '#0a1220' }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Category</span>
                            <span className="text-white capitalize">{req?.category || '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Priority</span>
                            <StatusBadge status={req?.priority || 'medium'} />
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Platform Fee</span>
                            <span className="text-white">{j.platform_fee ? `$${Number(j.platform_fee).toFixed(2)}` : '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Provider Earnings</span>
                            <span className="text-white">{j.provider_earnings ? `$${Number(j.provider_earnings).toFixed(2)}` : '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Estimated Cost</span>
                            <span className="text-white">{req?.estimated_cost ? `$${Number(req.estimated_cost).toFixed(2)}` : '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Scheduled</span>
                            <span className="text-white">{j.scheduled_date ? new Date(j.scheduled_date).toLocaleDateString() : '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs mb-1">Completed</span>
                            <span className="text-white">{j.completed_date ? new Date(j.completed_date).toLocaleDateString() : '—'}</span>
                          </div>
                          {j.notes && (
                            <div className="col-span-2">
                              <span className="text-gray-500 block text-xs mb-1">Notes</span>
                              <span className="text-white">{j.notes}</span>
                            </div>
                          )}
                        </div>
                        {req?.description && (
                          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="text-gray-500 block text-xs mb-1">Description</span>
                            <p className="text-gray-300 text-sm">{req.description}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No jobs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Users Tab ───
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    adminFetch('users').then(setUsers).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: '#111F36' }}>
            <th className="text-left text-gray-400 px-4 py-3 font-medium">Name</th>
            <th className="text-left text-gray-400 px-4 py-3 font-medium">Email</th>
            <th className="text-left text-gray-400 px-4 py-3 font-medium">Role</th>
            <th className="text-left text-gray-400 px-4 py-3 font-medium">Created</th>
            <th className="text-left text-gray-400 px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const expanded = expandedId === u.id;
            return (
              <Fragment key={u.id}>
                <tr className="border-t hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-white font-medium">{u.full_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedId(expanded ? null : u.id)}
                      className="px-2 py-1 rounded text-xs font-medium cursor-pointer"
                      style={{ backgroundColor: 'rgba(0,153,168,0.15)', color: '#0099A8', border: '1px solid rgba(0,153,168,0.3)' }}
                    >
                      {expanded ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded && (
                  <tr style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td colSpan={5} className="px-6 py-4" style={{ backgroundColor: '#0a1220' }}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block text-xs mb-1">User ID</span>
                          <span className="text-white font-mono text-xs">{u.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-1">Phone</span>
                          <span className="text-white">{u.phone || '—'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-1">Avatar</span>
                          <span className="text-white">{u.avatar_url ? 'Set' : 'None'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-1">Role</span>
                          <span className="text-white capitalize">{u.role.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {users.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#0099A833', borderTopColor: '#0099A8' }} />
    </div>
  );
}

// ─── Fragment import ───
import { Fragment } from 'react';

// ─── Tabs ───
const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'tradepros', label: 'Trade Pros', icon: HardHat },
  { key: 'jobs', label: 'Jobs', icon: Briefcase },
  { key: 'users', label: 'Users', icon: Users },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('hrop_admin_auth') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('hrop_admin_auth');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0C1628' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: '#0C1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" style={{ color: '#0099A8' }} />
          <h1 className="text-xl font-bold text-white">HROP Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      {/* Tab nav */}
      <nav className="px-6 flex gap-1 pt-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer relative"
            style={{
              color: activeTab === t.key ? '#0099A8' : '#9ca3af',
            }}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            {activeTab === t.key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                style={{ backgroundColor: '#0099A8' }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'tradepros' && <TradeProsTab />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'users' && <UsersTab />}
      </main>
    </div>
  );
}
