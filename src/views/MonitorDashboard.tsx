import { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard, FolderKanban, FileText, Calendar, Send,
  LogOut, Bell, CheckCircle, AlertTriangle, Clock,
  Camera, MapPin, ChevronRight, RefreshCw, CalendarCheck, X,
  Activity, CalendarDays, FileCheck, CalendarX, TrendingUp,
} from 'lucide-react';
import { Project, ScheduledVisit, MonitorSubmission, SysNotification, Monitor, getProjectBeneficiaryType } from '@/data';
import { Logo, ProgressBar, CheckIcon } from '@/components/shared';

function MonitorProjectBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-white" style={{ background: '#016630', borderRadius: '0.2rem' }}>
      {status}
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface MonitorDashboardProps {
  onLogout: () => void;
  monitorId: string;
  monitorName: string;
  sharedProjects: Project[];
  visits: ScheduledVisit[];
  setVisits: React.Dispatch<React.SetStateAction<ScheduledVisit[]>>;
  submissions: MonitorSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<MonitorSubmission[]>>;
  sysNotifs: SysNotification[];
  setSysNotifs: React.Dispatch<React.SetStateAction<SysNotification[]>>;
  sharedMonitors: Monitor[];
}

type Tab = 'dashboard' | 'projects' | 'fieldReport' | 'visits' | 'submissions';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'My Projects', icon: FolderKanban },
  { id: 'fieldReport', label: 'Field Report', icon: FileText },
  { id: 'visits', label: 'Visits', icon: Calendar },
  { id: 'submissions', label: 'Submissions', icon: Send },
];

function VisitPill({ status }: { status: ScheduledVisit['status'] }) {
  const bg: Record<string, string> = {
    Upcoming: '#d97706',
    Acknowledged: '#2563eb',
    Completed: '#016630',
    Missed: '#dc2626',
    Rescheduled: '#7c3aed',
  };
  return <span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
}

function SubPill({ status }: { status: MonitorSubmission['status'] }) {
  const bg: Record<string, string> = {
    'Pending Review': '#d97706',
    'Approved': '#016630',
    'Returned': '#dc2626',
  };
  return <span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
}

interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'info' }
function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  const bg = { success: 'bg-green-700', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-xs w-full pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`${bg[t.type]} text-white text-sm px-4 py-3 rounded-xl shadow-lg`}>{t.message}</div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  function show(message: string, type: ToastItem['type'] = 'success') {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }
  return { toasts, show };
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>{children}</div>;
}

function MonitorNotifIcon({ type }: { type: SysNotification['type'] }) {
  if (type === 'visit_scheduled' || type === 'visit_rescheduled') return <CalendarCheck size={14} className="text-amber-500" />;
  if (type === 'acknowledgement') return <CalendarDays size={14} className="text-teal-600" />;
  if (type === 'submission') return <Send size={14} className="text-blue-500" />;
  if (type === 'submission_approved') return <CheckIcon size={14} />;
  if (type === 'submission_returned') return <RefreshCw size={14} className="text-red-500" />;
  if (type === 'project_progress_updated') return <TrendingUp size={14} className="text-emerald-600" />;
  if (type === 'project_assigned') return <FolderKanban size={14} className="text-indigo-500" />;
  if (type === 'ward_assignment') return <MapPin size={14} className="text-purple-500" />;
  return <Bell size={14} className="text-blue-500" />;
}

function MiniStat({ label, value, sub, icon }: { label: string; value: string | number; accent?: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1.5 p-4 bg-white shadow-sm" style={{ border: '1.5px solid #016630', borderRadius: '0.2rem', minHeight: '108px' }}>
      {icon && <div style={{ color: '#016630' }} className="flex items-center justify-center">{icon}</div>}
      <p className="text-xl font-black leading-none" style={{ fontFamily: 'Outfit, sans-serif', color: '#016630' }}>{value}</p>
      <p className="text-[11px] font-semibold leading-tight" style={{ color: '#016630' }}>{label}</p>
      {sub && <p className="text-[10px]" style={{ color: '#016630', opacity: 0.7 }}>{sub}</p>}
    </div>
  );
}

export default function MonitorDashboard({
  onLogout, monitorId, monitorName, sharedProjects, visits, setVisits, submissions, setSubmissions, sysNotifs, setSysNotifs, sharedMonitors,
}: MonitorDashboardProps) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const { toasts, show } = useToast();

  // Derive monitor record from shared list
  const monitorRecord = sharedMonitors.find(m => m.id === monitorId);
  const MONITOR_ID = monitorId;
  const MONITOR_NAME = monitorName;
  const MONITOR_WARDS = monitorRecord?.wards ?? '';
  const MONITOR_LAST_ACTIVE = monitorRecord?.lastActive ?? new Date().toISOString().slice(0, 10);

  const myProjects = sharedProjects.filter(p => p.monitor === MONITOR_NAME);
  const myVisits = visits.filter(v => v.monitorId === MONITOR_ID);
  const mySubmissions = submissions.filter(s => s.monitorId === MONITOR_ID);

  const myNotifs = sysNotifs.filter(n =>
    n.for === 'monitor' && (
      !n.monitorId ||
      n.monitorId === 'all' ||
      n.monitorId === MONITOR_ID ||
      (n.monitorName && n.monitorName.toLowerCase() === MONITOR_NAME.toLowerCase()) ||
      (n.ward && MONITOR_WARDS && MONITOR_WARDS.toLowerCase().includes(n.ward.toLowerCase()))
    )
  );
  const unreadNotifs = myNotifs.filter(n => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const upcomingVisits = myVisits.filter(v => v.status === 'Upcoming');
  const missedVisits = myVisits.filter(v => v.status === 'Missed');
  const pendingSubmissions = mySubmissions.filter(s => s.status === 'Pending Review');
  const approvedSubmissions = mySubmissions.filter(s => s.status === 'Approved');
  const completedProjects = myProjects.filter(p => p.status === 'Completed');

  function acknowledgeVisit(visitId: string, projectName: string, projectId: string) {
    const today = new Date().toISOString().slice(0, 10);
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'Acknowledged', acknowledgedAt: today } : v));
    setSysNotifs(prev => [
      {
        id: `SN-${Date.now()}-adm`, for: 'admin', monitorId: MONITOR_ID,
        type: 'acknowledgement', title: 'Visit Acknowledged',
        message: `${MONITOR_NAME} has acknowledged the scheduled visit to "${projectName}".`,
        date: today, read: false, visitId, projectId,
      },
      {
        id: `SN-${Date.now()}-mon`, for: 'monitor', monitorId: MONITOR_ID,
        type: 'acknowledgement', title: 'Visit Acknowledged',
        message: `You acknowledged the scheduled visit to "${projectName}".`,
        date: today, read: false, visitId, projectId,
      },
      ...prev,
    ]);
    show('Visit acknowledged. Admin has been notified.');
  }

  const [fr, setFr] = useState({ projectId: '', progress: 50, milestone: '', observation: '', gpsLat: '', gpsLng: '', photos: [] as string[] });
  const [photoLightbox, setPhotoLightbox] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setFr(f => ({ ...f, photos: [...f.photos, ev.target?.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removePhoto(idx: number) {
    setFr(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  }
  const [frSubmitting, setFrSubmitting] = useState(false);

  function submitFieldReport(e: React.FormEvent) {
    e.preventDefault();
    if (!fr.projectId) return;
    const project = sharedProjects.find(p => p.id === fr.projectId);
    if (!project) return;
    setFrSubmitting(true);
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      const newSub: MonitorSubmission = {
        id: `SUB-${String(Date.now()).slice(-4)}`,
        projectId: fr.projectId, projectName: project.name,
        monitorId: MONITOR_ID, monitorName: MONITOR_NAME,
        date: today, progress: fr.progress, status: 'Pending Review',
        observation: fr.observation, milestone: fr.milestone,
        photoCount: fr.photos.length, gpsLat: fr.gpsLat, gpsLng: fr.gpsLng,
        adminNote: '', reviewedAt: '', photos: fr.photos,
      };
      setSubmissions(prev => [newSub, ...prev]);
      setSysNotifs(prev => [
        {
          id: `SN-${Date.now()}-adm`, for: 'admin', monitorId: MONITOR_ID,
          type: 'submission', title: 'New Field Report Submitted',
          message: `${MONITOR_NAME} submitted a field report for "${project.name}" - ${fr.progress}% progress, ${fr.photos.length} photo${fr.photos.length !== 1 ? 's' : ''} attached.`,
          date: today, read: false, submissionId: newSub.id, projectId: fr.projectId,
        },
        {
          id: `SN-${Date.now()}-mon`, for: 'monitor', monitorId: MONITOR_ID,
          type: 'submission', title: 'Field Report Submitted',
          message: `You submitted report ${newSub.id} for "${project.name}" (${fr.progress}% progress). Pending admin verification.`,
          date: today, read: false, submissionId: newSub.id, projectId: fr.projectId,
        },
        ...prev,
      ]);
      setFr({ projectId: '', progress: 50, milestone: '', observation: '', gpsLat: '', gpsLng: '', photos: [] });
      setFrSubmitting(false);
      show('Field report submitted. Admin will review it shortly.');
      setTab('submissions');
    }, 800);
  }

  const inp = 'w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#145a32]';

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center h-14 gap-2">
            {/* Logo */}
            <Logo className="h-10 flex-shrink-0" />

            {/* Tabs - centered */}
            <nav className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar">
              <div className="flex gap-0.5">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      tab === id ? 'text-[#145a32] bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{label}</span>
                    {id === 'visits' && upcomingVisits.length > 0 && (
                      <span className="bg-amber-400 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{upcomingVisits.length}</span>
                    )}
                    {id === 'submissions' && pendingSubmissions.length > 0 && (
                      <span className="bg-[#145a32] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{pendingSubmissions.length}</span>
                    )}
                    {tab === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#145a32] rounded-full" />}
                  </button>
                ))}
              </div>
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(v => !v)} className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Bell size={17} />
                  {unreadNotifs > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>}
                </button>
                {notifOpen && (
                  <>
                    {/* Mobile backdrop */}
                    <div
                      className="fixed inset-0 bg-black/25 z-40 sm:hidden"
                      onClick={() => setNotifOpen(false)}
                      onMouseDown={() => setNotifOpen(false)}
                    />
                    <div className="fixed inset-x-3.5 top-14 max-w-sm mx-auto sm:mx-0 sm:inset-x-auto sm:absolute sm:right-0 sm:top-10 sm:w-80 bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-gray-100 z-50 overflow-hidden text-gray-800">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                        {unreadNotifs > 0 && (
                          <button
                            onClick={() => {
                              const ids = new Set(myNotifs.map(n => n.id));
                              setSysNotifs(prev => prev.map(n => ids.has(n.id) ? { ...n, read: true } : n));
                            }}
                            className="text-xs text-[#145a32] font-semibold hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {myNotifs.length === 0 && <div className="py-8 text-center text-gray-400 text-sm">No notifications</div>}
                        {myNotifs.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setSysNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                              if (n.type.includes('visit') || n.visitId || n.type === 'acknowledgement') {
                                setTab('visits');
                                setNotifOpen(false);
                              } else if (n.type.includes('submission') || n.submissionId) {
                                setTab('submissions');
                                setNotifOpen(false);
                              } else if (n.type.includes('project') || n.projectId) {
                                setTab('projects');
                                setNotifOpen(false);
                              }
                            }}
                            className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition-colors ${!n.read ? 'bg-amber-50/60' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-0.5"><MonitorNotifIcon type={n.type} /></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug mb-0.5 ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{n.date}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />}
                          </div>
                        ))}
                      </div>
                      {upcomingVisits.length > 0 && (
                        <div className="p-3 border-t border-gray-100">
                          <button onClick={() => { setTab('visits'); setNotifOpen(false); }} className="w-full text-xs text-[#145a32] font-semibold text-center hover:underline">
                            View {upcomingVisits.length} upcoming visit{upcomingVisits.length > 1 ? 's' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button onClick={onLogout} title="Logout" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome Section - centered */}
        <div className="flex justify-center">
          <div className="rounded-2xl px-8 py-6 text-center w-full max-w-lg shadow-sm" style={{ background: '#145a32' }}>
            <p className="text-xs font-bold text-white/90 tracking-widest uppercase mb-1">Welcome Back</p>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{MONITOR_NAME}</h2>
            {MONITOR_WARDS ? <p className="text-sm text-white/90 mb-0.5">{MONITOR_WARDS}</p> : null}
            <p className="text-xs text-white/75">Last active: {MONITOR_LAST_ACTIVE}</p>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Field Monitor Performance Summary</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MiniStat label="My Projects" value={myProjects.length} sub={`${completedProjects.length} completed`} icon={<FolderKanban size={26} />} />
              <MiniStat label="Upcoming Visits" value={upcomingVisits.length} sub="Scheduled" icon={<CalendarDays size={26} />} />
              <MiniStat label="Pending Reports" value={pendingSubmissions.length} sub="Awaiting review" icon={<FileText size={26} />} />
              <MiniStat label="Approved Reports" value={approvedSubmissions.length} icon={<FileCheck size={26} />} />
              <MiniStat label="Missed Visits" value={missedVisits.length} icon={<CalendarX size={26} />} />
              <MiniStat label="Total Submissions" value={mySubmissions.length} icon={<Send size={26} />} />
            </div>

            {upcomingVisits.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-gray-500" />
                  <p className="text-sm font-semibold text-gray-800">Upcoming Visits - Acknowledgement Required</p>
                </div>
                <div className="space-y-2">
                  {upcomingVisits.slice(0, 3).map(v => (
                    <div key={v.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{v.projectName}</p>
                        <p className="text-xs text-gray-500">{v.date} at {v.time} / {v.ward}</p>
                      </div>
                      <button onClick={() => acknowledgeVisit(v.id, v.projectName, v.projectId)} className="flex items-center gap-1.5 text-xs bg-[#145a32] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#0f4424] whitespace-nowrap ml-3">
                        <CheckCircle size={12} /> Acknowledge
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTab('visits')} className="mt-3 text-xs text-[#145a32] font-semibold flex items-center gap-1 hover:underline">
                  View all visits <ChevronRight size={13} />
                </button>
              </div>
            )}

            {missedVisits.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{missedVisits.length} missed visit{missedVisits.length > 1 ? 's' : ''} on record</p>
                  <p className="text-xs text-red-600 mt-0.5">Admin has been notified. Check visits tab for re-scheduled dates.</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">My Projects</p>
              <div className="space-y-2">
                {myProjects.slice(0, 5).map(p => (
                  <div key={p.id} onClick={() => setTab('projects')} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 cursor-pointer hover:border-green-200 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.id} / {p.ward} / {p.sector}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 max-w-[140px]"><ProgressBar value={p.status === 'Completed' ? 100 : p.progress} /></div>
                        <span className="text-xs text-gray-500">{p.status === 'Completed' ? 100 : p.progress}%</span>
                      </div>
                    </div>
                    <MonitorProjectBadge status={p.status} />
                  </div>
                ))}
                {myProjects.length === 0 && <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-400 text-sm">No projects assigned to you yet.</div>}
              </div>
              {myProjects.length > 5 && (
                <button onClick={() => setTab('projects')} className="mt-2 text-xs text-[#145a32] font-semibold flex items-center gap-1 hover:underline">
                  View all {myProjects.length} projects <ChevronRight size={13} />
                </button>
              )}
            </div>

            {mySubmissions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Recent Submissions</p>
                <div className="space-y-2">
                  {mySubmissions.slice(0, 3).map(s => (
                    <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{s.projectName}</p>
                        <p className="text-xs text-gray-400">{s.id} / {s.date} / {s.progress}% progress</p>
                        {s.adminNote && s.status !== 'Pending Review' && <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">"{s.adminNote}"</p>}
                      </div>
                      <SubPill status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MY PROJECTS ── */}
        {tab === 'projects' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>My Projects</h2>
              <p className="text-sm text-gray-500">{myProjects.length} assigned / {completedProjects.length} completed</p>
            </div>
            {myProjects.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">No projects have been assigned to you yet.</div>
            )}
            {myProjects.map(p => {
              const prog = p.status === 'Completed' ? 100 : p.progress;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.id} / {p.sector} / {p.ward}</p>
                      {p.location && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10} />{p.location}</p>}
                    </div>
                    <MonitorProjectBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1"><ProgressBar value={prog} /></div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-semibold">{prog}%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
                    {([
                      ['Budget', p.budget > 0 ? `MK ${(p.budget / 1000000).toFixed(1)}M` : '—'],
                      ['Beneficiaries', p.beneficiaries > 0 ? p.beneficiaries.toLocaleString() : '—'],
                      ['Beneficiary Type', getProjectBeneficiaryType(p)],
                      ['Expected End', p.expectedCompletion || '—'],
                      ['Contractor', p.contractor || '—'],
                    ] as [string, string][]).map(([l, v]) => (
                      <div key={l} className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">{l}</p>
                        <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{v}</p>
                      </div>
                    ))}
                  </div>
                  {p.description && <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.description}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {p.status !== 'Completed' && (
                      <button onClick={() => { setFr(f => ({ ...f, projectId: p.id })); setTab('fieldReport'); }} className="flex items-center gap-1.5 text-xs bg-[#145a32] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#0f4424]">
                        <FileText size={12} /> Submit Report
                      </button>
                    )}
                    <button onClick={() => setTab('visits')} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                      <Calendar size={12} /> View Visits
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FIELD REPORT ── */}
        {tab === 'fieldReport' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Submit Field Report</h2>
              <p className="text-sm text-gray-500">Document your on-site observations for admin review.</p>
            </div>
            <form onSubmit={submitFieldReport} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <Fld label="Select Project *">
                <select required className={inp} value={fr.projectId} onChange={e => setFr(f => ({ ...f, projectId: e.target.value }))}>
                  <option value="">Choose a project...</option>
                  {myProjects.filter(p => p.status !== 'Completed').map(p => <option key={p.id} value={p.id}>{p.name} &mdash; {p.ward}</option>)}
                </select>
              </Fld>

              {fr.projectId && (
                <>
                  <Fld label={`Progress (${fr.progress}%)`}>
                    <input type="range" min={0} max={100} step={5} className="w-full accent-[#145a32]" value={fr.progress} onChange={e => setFr(f => ({ ...f, progress: Number(e.target.value) }))} />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
                    {fr.progress === 100 && (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-green-700">100% progress - if admin approves this report, the project will be automatically marked as Completed.</p>
                      </div>
                    )}
                  </Fld>

                  <Fld label="Current Milestone">
                    <input type="text" className={inp} value={fr.milestone} onChange={e => setFr(f => ({ ...f, milestone: e.target.value }))} placeholder="e.g. Foundation complete, Roof laid, Pipes installed..." />
                  </Fld>

                  <Fld label="Field Observations *">
                    <textarea required rows={5} className={inp} value={fr.observation} onChange={e => setFr(f => ({ ...f, observation: e.target.value }))} placeholder="Describe what you observed on-site: work completed, challenges, community response, material quality, safety concerns..." style={{ resize: 'vertical' }} />
                  </Fld>

                  <div className="grid grid-cols-2 gap-4">
                    <Fld label="GPS Latitude">
                      <input type="text" className={inp} value={fr.gpsLat} onChange={e => setFr(f => ({ ...f, gpsLat: e.target.value }))} placeholder="-13.xxxx" />
                    </Fld>
                    <Fld label="GPS Longitude">
                      <input type="text" className={inp} value={fr.gpsLng} onChange={e => setFr(f => ({ ...f, gpsLng: e.target.value }))} placeholder="33.xxxx" />
                    </Fld>
                  </div>

                  <Fld label={`Site Photos (${fr.photos.length} selected)`}>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#145a32] hover:bg-green-50/30 transition-colors">
                      <Camera size={18} className="text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500 font-medium">Click to upload photos</p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WEBP supported</p>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                    </label>
                    {fr.photos.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                        {fr.photos.map((photo, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                            <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Fld>
                </>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFr({ projectId: '', progress: 50, milestone: '', observation: '', gpsLat: '', gpsLng: '', photos: [] })} className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">
                  Clear
                </button>
                <button type="submit" disabled={frSubmitting || !fr.projectId} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-[#145a32] text-white rounded-xl font-semibold hover:bg-[#0f4424] disabled:opacity-50 disabled:cursor-not-allowed">
                  {frSubmitting ? <><RefreshCw size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Report</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── VISITS ── */}
        {tab === 'visits' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>My Site Visits</h2>
              <p className="text-sm text-gray-500">{upcomingVisits.length} upcoming / {myVisits.filter(v => v.status === 'Acknowledged').length} acknowledged / {myVisits.filter(v => v.status === 'Completed').length} completed</p>
            </div>

            {myVisits.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">No visits have been scheduled for you yet.</div>
            )}

            {upcomingVisits.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Upcoming - Acknowledge Required</p>
                <div className="space-y-3">
                  {upcomingVisits.map(v => (
                    <div key={v.id} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #d97706' }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{v.projectName}</p>
                          <p className="text-xs text-gray-400 font-mono">{v.id} / {v.ward}</p>
                        </div>
                        <VisitPill status={v.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {v.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {v.time}</span>
                      </div>
                      {v.notes && <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 mb-3 leading-relaxed">{v.notes}</p>}
                      {v.rescheduledFrom && <p className="text-xs text-purple-600 mb-3">Re-scheduled from {v.rescheduledFrom}</p>}
                      <button onClick={() => acknowledgeVisit(v.id, v.projectName, v.projectId)} className="flex items-center gap-1.5 text-xs bg-[#145a32] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0f4424]">
                        <CheckCircle size={13} /> Acknowledge this Visit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {myVisits.filter(v => v.status !== 'Upcoming').length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Visit History</p>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                      {['Project', 'Date', 'Time', 'Ward', 'Status'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {myVisits.filter(v => v.status !== 'Upcoming').map(v => (
                        <tr key={v.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${v.status === 'Missed' ? 'bg-red-50/40' : ''}`}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 text-xs">{v.projectName}</p>
                            {v.rescheduledFrom && <p className="text-[10px] text-purple-500">Was: {v.rescheduledFrom}</p>}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{v.date}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{v.time}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{v.ward}</td>
                          <td className="px-4 py-3"><VisitPill status={v.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {missedVisits.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Missed Visits on Record</p>
                  <p className="text-xs text-red-600 mt-1">You have {missedVisits.length} missed visit{missedVisits.length > 1 ? 's' : ''} on record. Admin has been notified. Check for re-scheduled notifications above.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SUBMISSIONS ── */}
        {tab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>My Submissions</h2>
                <p className="text-sm text-gray-500">{mySubmissions.length} total / {pendingSubmissions.length} pending review</p>
              </div>
              <button onClick={() => setTab('fieldReport')} className="flex items-center gap-1.5 text-xs bg-[#145a32] text-white px-3 py-2 rounded-xl font-semibold hover:bg-[#0f4424]">
                <Send size={12} /> New Report
              </button>
            </div>

            {mySubmissions.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Send size={24} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No field reports submitted yet.</p>
                <button onClick={() => setTab('fieldReport')} className="mt-3 text-xs text-[#145a32] font-semibold hover:underline">Submit your first report</button>
              </div>
            )}

            {mySubmissions.map(s => (
              <div key={s.id} className={`bg-white rounded-2xl border p-5 ${s.status === 'Returned' ? 'border-red-200' : s.status === 'Approved' ? 'border-green-200' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.projectName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.id} / {s.date}</p>
                  </div>
                  <SubPill status={s.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {([
                    ['Progress', `${s.progress}%`],
                    ['Photos', `${s.photos?.length ?? s.photoCount}`],
                    ['GPS', s.gpsLat ? s.gpsLat : '—'],
                    ['Milestone', s.milestone || '—'],
                  ] as [string, string][]).map(([l, v]) => (
                    <div key={l} className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">{l}</p>
                      <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{v}</p>
                    </div>
                  ))}
                </div>
                {/* Photo thumbnails */}
                {s.photos && s.photos.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Your Photos ({s.photos.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {s.photos.map((photo, idx) => (
                        <button key={idx} type="button" onClick={() => setPhotoLightbox(photo)} className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-90 transition-opacity border border-gray-200">
                          <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {s.progress === 100 && s.status === 'Approved' && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 mb-3">
                    <p className="text-xs font-semibold text-green-700">Project was auto-marked Completed after this report was approved.</p>
                  </div>
                )}
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{s.observation}</p>
                {s.adminNote && (
                  <div className={`rounded-xl p-3 ${s.status === 'Returned' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                    <p className={`text-xs font-semibold mb-1 ${s.status === 'Returned' ? 'text-red-700' : 'text-green-700'}`}>
                      Admin Note{s.reviewedAt ? ` - ${s.reviewedAt}` : ''}:
                    </p>
                    <p className={`text-xs ${s.status === 'Returned' ? 'text-red-800' : 'text-green-800'}`}>{s.adminNote}</p>
                  </div>
                )}
                {s.status === 'Returned' && (
                  <div className="mt-3">
                    <button onClick={() => { setFr(f => ({ ...f, projectId: s.projectId })); setTab('fieldReport'); }} className="flex items-center gap-1.5 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600">
                      <RefreshCw size={12} /> Resubmit Report
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Photo lightbox */}
      {photoLightbox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4" onClick={() => setPhotoLightbox(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={photoLightbox} alt="Site photo" className="w-full h-full object-contain rounded-2xl shadow-2xl" style={{ maxHeight: '85vh' }} />
            <button onClick={() => setPhotoLightbox(null)} className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
