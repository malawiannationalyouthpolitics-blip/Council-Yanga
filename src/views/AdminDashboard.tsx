import React, { useState, useCallback, useRef, useEffect, useMemo, type ReactNode } from 'react';
import {
  LayoutDashboard, FolderKanban, Users, MessageSquare, BarChart2,
  ScrollText, Megaphone, LogOut, Menu, X, Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
  Edit2, Trash2, CheckCircle, AlertCircle, FileText, Download,
  Eye, Bell, RefreshCw, XCircle, Mail, Phone, Calendar,
  Send, Clock, AlertTriangle, CalendarCheck, TrendingUp, UserCheck,
  Activity, Wallet, LayoutGrid, CalendarX, Contact, CheckCircle2, CircleUserRound,
  Layers, Banknote, Camera, UploadCloud, Image as ImageIcon, Maximize2,
  ClipboardCheck, Timer, Save, SlidersHorizontal, MapPin,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList, CartesianGrid,
} from 'recharts';
import {
  auditLogs,
  activityData,
  Project, Monitor, Announcement, Feedback, User,
  ScheduledVisit, MonitorSubmission, SysNotification,
  SECTORS, WARDS, CONSTITUENCIES, IMPLEMENTING_DEPTS,
  PROJECT_TYPES, CDF_COMPONENTS, INITIATIVE_COMPONENTS, COMMUNITY_DEVELOPMENT_SECTORS, REGIONS, DISTRICTS,
  BENEFICIARY_TYPES, getProjectBeneficiaryType, getProjectDisbursed, getProjectUtilised,
  getBeneficiaryTypeForInitiativeComponent,
  isInitiative, isProject,
  formatMK, exportToCSV, exportToExcel, exportToPDF,
  WardStatusPhoto, initialWardStatusPhotos, saveStoredWardStatusPhotos,
} from '@/data';
import {
  getDistrictsForRegion,
  getRegionForDistrict,
  getConstituenciesForDistrict,
  getWardsForConstituency,
  getWardsForDistrict,
} from '@/administrativeData';
import { Logo, StatusBadge, ProgressBar, CheckIcon, CategoryBadge } from '@/components/shared';

// ── Props ─────────────────────────────────────────────────────────────────────
interface AdminDashboardProps {
  onLogout: () => void;
  sharedProjects: Project[];
  setSharedProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  visits: ScheduledVisit[];
  setVisits: React.Dispatch<React.SetStateAction<ScheduledVisit[]>>;
  submissions: MonitorSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<MonitorSubmission[]>>;
  sysNotifs: SysNotification[];
  setSysNotifs: React.Dispatch<React.SetStateAction<SysNotification[]>>;
  sharedFeedback: Feedback[];
  setSharedFeedback: React.Dispatch<React.SetStateAction<Feedback[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sharedMonitors: Monitor[];
  setSharedMonitors: React.Dispatch<React.SetStateAction<Monitor[]>>;
  sharedAnnouncements: Announcement[];
  setSharedAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  sharedWardStatusPhotos?: WardStatusPhoto[];
  setSharedWardStatusPhotos?: (action: WardStatusPhoto[] | ((prev: WardStatusPhoto[]) => WardStatusPhoto[])) => void;
}

// ── Toast ────────────────────────────────────────────────────────────────────
interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }, []);
  return { toasts, show };
}
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  const bg = { success: 'bg-green-700', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-xs w-full pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`${bg[t.type]} text-white text-sm px-4 py-3 rounded-xl shadow-lg`}>{t.message}</div>
      ))}
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, size = 'md' }: { title: string; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-2xl';
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-2.5 sm:p-4 pt-3 sm:pt-8 overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxW} mb-10`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"><X size={20} /></button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>{children}</div>;
}
const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32] focus:border-[#145a32] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200';

// ── Downward Select Dropdown (always pops downwards) ───────────────────────────
function DownwardSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[] | string[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <label className={`block text-xs font-semibold mb-1 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); setSearch(''); } }}
        className={`w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#145a32] focus:border-[#145a32] ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white'
        }`}
      >
        <span className={value ? (disabled ? 'text-gray-400 truncate' : 'text-gray-900 truncate font-medium') : 'text-gray-400 truncate'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`ml-2 transition-transform duration-200 flex-shrink-0 ${disabled ? 'text-gray-300' : 'text-gray-400'} ${open ? 'rotate-180' : ''}`} />
      </button>

      {required && !disabled && (
        <input
          type="text"
          value={value}
          required
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          {options.length > 8 && (
            <div className="p-1.5 border-b border-gray-100 bg-gray-50 flex items-center gap-1.5">
              <Search size={13} className="text-gray-400 ml-1 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={`Search ${label.replace('*', '').trim()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs bg-transparent border-none focus:outline-none px-1 py-1 text-gray-800"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 mr-1 text-xs">✕</button>
              )}
            </div>
          )}
          <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[#f0fdf4] hover:text-[#145a32] text-gray-400 italic"
            >
              {placeholder}
            </button>
            {filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f0fdf4] hover:text-[#145a32] flex items-center justify-between ${
                  value === opt ? 'bg-[#f0fdf4] text-[#145a32] font-bold' : 'text-gray-700'
                }`}
              >
                <span>{opt}</span>
                {value === opt && <CheckCircle2 size={13} className="text-[#145a32]" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-center text-gray-400">No matching options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Project Modal ─────────────────────────────────────────────────────────────
type PF = Omit<Project, 'id' | 'createdDate' | 'lastUpdated'>;
function emptyPF(): PF {
  return {
    name: '',
    initiativeName: '',
    initiativeComponent: '',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: '',
    district: '',
    description: '',
    objectives: '',
    sector: 'Agriculture & Environment',
    constituency: '',
    ward: '',
    traditionalAuthority: '',
    location: '',
    gpsLat: '',
    gpsLng: '',
    beneficiaries: 0,
    budget: 0,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '',
    startDate: '',
    expectedCompletion: '',
    actualCompletion: '',
    status: 'Proposed',
    progress: 0,
    implementingDept: '',
    contractor: '',
    monitor: '',
  };
}

function ProjectModal({ initial, onSave, onClose, monitorList }: {
  initial?: Project; onSave: (p: Project) => void; onClose: () => void; monitorList: Monitor[];
}) {
  const [addType, setAddType] = useState<'New Initiative' | 'New Project' | ''>(
    initial
      ? (isInitiative(initial) ? 'New Initiative' : 'New Project')
      : ''
  );

  const isGeneralFieldDisabled = !addType;
  const isProjectSpecificDisabled = !addType || addType === 'New Initiative';
  const isInitiativeFieldDisabled = !addType || addType === 'New Project';

  const [form, setForm] = useState<PF>(initial ? {
    name: initial.name,
    initiativeName: initial.initiativeName ?? '',
    initiativeComponent: initial.initiativeComponent ?? '',
    projectType: initial.projectType ?? 'CDF',
    component: initial.component ?? 'Community Development Project',
    region: initial.region ?? '',
    district: initial.district ?? '',
    description: initial.description,
    objectives: initial.objectives,
    sector: initial.sector || 'Agriculture & Environment',
    constituency: initial.constituency ?? '',
    ward: initial.ward ?? '',
    traditionalAuthority: initial.traditionalAuthority,
    location: initial.location,
    gpsLat: initial.gpsLat,
    gpsLng: initial.gpsLng,
    beneficiaries: initial.beneficiaries,
    budget: initial.budget,
    fundingSource: initial.fundingSource,
    approvalDate: initial.approvalDate,
    startDate: initial.startDate,
    expectedCompletion: initial.expectedCompletion,
    actualCompletion: initial.actualCompletion,
    status: initial.status,
    progress: initial.progress,
    implementingDept: initial.implementingDept,
    contractor: initial.contractor,
    monitor: initial.monitor,
    beneficiaryType: initial.beneficiaryType ?? '',
  } : emptyPF());

  const s = (k: keyof PF, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  // When admin selects Community Development Project in Project Component, automatically populate Sector
  const handleComponentChange = (comp: string) => {
    if (comp === 'Community Development Project') {
      const isCurrentValid = COMMUNITY_DEVELOPMENT_SECTORS.includes(form.sector as (typeof COMMUNITY_DEVELOPMENT_SECTORS)[number]);
      setForm(f => ({
        ...f,
        component: comp,
        sector: isCurrentValid ? f.sector : COMMUNITY_DEVELOPMENT_SECTORS[0],
      }));
    } else {
      setForm(f => ({ ...f, component: comp }));
    }
  };

  const availableSectors = form.component === 'Community Development Project'
    ? COMMUNITY_DEVELOPMENT_SECTORS
    : SECTORS;

  // Hierarchical cascading options for administrative filtering
  const districtOptions = form.region
    ? getDistrictsForRegion(form.region)
    : DISTRICTS;

  const constituencyOptions = form.district
    ? getConstituenciesForDistrict(form.district)
    : CONSTITUENCIES;

  const wardOptions = form.constituency
    ? getWardsForConstituency(form.constituency, form.district)
    : form.district
      ? getWardsForDistrict(form.district)
      : WARDS;

  const handleRegionChange = (reg: string) => {
    const validDists = getDistrictsForRegion(reg);
    const keepDist = form.district && validDists.includes(form.district);
    const nextDist = keepDist ? form.district : '';

    const validConsts = nextDist ? getConstituenciesForDistrict(nextDist) : CONSTITUENCIES;
    const keepConst = nextDist && form.constituency && validConsts.includes(form.constituency);
    const nextConst = keepConst ? form.constituency : '';

    const validWards = nextConst
      ? getWardsForConstituency(nextConst, nextDist)
      : nextDist
        ? getWardsForDistrict(nextDist)
        : WARDS;
    const keepWard = nextDist && form.ward && validWards.includes(form.ward);

    setForm(f => ({
      ...f,
      region: reg,
      district: nextDist,
      constituency: nextConst,
      ward: keepWard ? f.ward : '',
    }));
  };

  const handleDistrictChange = (dist: string) => {
    const inferredRegion = getRegionForDistrict(dist) || form.region;
    const validConsts = getConstituenciesForDistrict(dist);
    const keepConst = form.constituency && validConsts.includes(form.constituency);
    const nextConst = keepConst ? form.constituency : '';
    const validWards = nextConst
      ? getWardsForConstituency(nextConst, dist)
      : getWardsForDistrict(dist);
    const keepWard = form.ward && validWards.includes(form.ward);

    setForm(f => ({
      ...f,
      region: inferredRegion,
      district: dist,
      constituency: nextConst,
      ward: keepWard ? f.ward : '',
    }));
  };

  const handleConstituencyChange = (c: string) => {
    const validWards = getWardsForConstituency(c, form.district);
    const keepWard = form.ward && validWards.includes(form.ward);

    setForm(f => ({
      ...f,
      constituency: c,
      ward: keepWard ? f.ward : '',
    }));
  };

  const handleInitiativeComponentChange = (val: string) => {
    let inferredBeneficiary = form.beneficiaryType;
    if (val === 'Youth Enterprise fund') inferredBeneficiary = 'Youth Entrepreneurs';
    else if (val === 'School Bursaries') inferredBeneficiary = 'Students';
    else if (val === 'Women Economic Empowerment') inferredBeneficiary = 'Women Entrepreneurs';
    else if (val === 'Sports Development Fund' || val === 'Creative Arts & Innovation') inferredBeneficiary = 'Sports, creative arts & Innovation';

    setForm(f => ({
      ...f,
      initiativeComponent: val,
      beneficiaryType: inferredBeneficiary || f.beneficiaryType,
    }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!addType && !initial) return;
    const today = new Date().toISOString().slice(0, 10);
    const isInit = addType === 'New Initiative' || (!addType && initial ? isInitiative(initial) : false);
    const finalName = isInit
      ? (form.initiativeName || form.name || 'New Initiative')
      : (form.name || form.initiativeName || 'New Project');
    const finalComponent = isInit
      ? (form.initiativeComponent || form.component || 'Youth Enterprise fund')
      : (form.component || 'Community Development Project');
    const finalBeneficiaryType = form.beneficiaryType || (
      isInit
        ? (finalComponent ? getBeneficiaryTypeForInitiativeComponent(finalComponent) : 'Youth Entrepreneurs')
        : 'District-Wide'
    );

    onSave({
      ...form,
      itemType: isInit ? 'Initiative' : 'Project',
      name: finalName,
      initiativeName: isInit ? finalName : '',
      initiativeComponent: isInit ? finalComponent : '',
      component: finalComponent,
      beneficiaryType: finalBeneficiaryType,
      id: initial?.id ?? '',
      createdDate: initial?.createdDate ?? today,
      lastUpdated: today,
    });
  }

  return (
    <Modal title={initial ? 'Edit Project' : (addType === 'New Initiative' ? 'Add New Initiative' : addType === 'New Project' ? 'Add New Project' : 'Add New Project')} onClose={onClose} size="lg">
      <form onSubmit={submit} className="space-y-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* On top of Project Component: What do you want to add? */}
          <div className="sm:col-span-2">
            <Fld label="What do you want to add? *">
              <select
                required
                className={`${inp} font-semibold ${!addType ? 'text-gray-600 bg-amber-50/50 border-amber-300' : 'text-gray-900 bg-white border-[#145a32]'}`}
                value={addType}
                onChange={e => setAddType(e.target.value as 'New Initiative' | 'New Project' | '')}
              >
                <option value="">Select either New Initiative or New Project</option>
                <option value="New Initiative">New Initiative</option>
                <option value="New Project">New Project</option>
              </select>
            </Fld>
            {!addType && !initial && (
              <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <span>By default, all sections below are disabled. Please select <strong>New Initiative</strong> or <strong>New Project</strong> above to begin.</span>
              </p>
            )}
          </div>

          {/* Project Component * */}
          <Fld label="Project Component *">
            <select
              required={addType === 'New Project'}
              disabled={isProjectSpecificDisabled}
              className={inp}
              value={form.component || 'Community Development Project'}
              onChange={e => handleComponentChange(e.target.value)}
            >
              {CDF_COMPONENTS.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Fld>

          <Fld label="Project Type / Initiative *">
            <select
              required={!!addType}
              disabled={isGeneralFieldDisabled}
              className={inp}
              value={form.projectType || 'CDF'}
              onChange={e => s('projectType', e.target.value)}
            >
              {PROJECT_TYPES.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Fld>

          {/* Project Name * */}
          <Fld label="Project Name *">
            <input
              required={addType === 'New Project'}
              disabled={isProjectSpecificDisabled}
              className={inp}
              value={form.name}
              onChange={e => s('name', e.target.value)}
              placeholder="e.g. Health Post Construction or Road Rehabilitation"
            />
          </Fld>

          {/* Initiative Name * */}
          <Fld label="Initiative Name *">
            <input
              required={addType === 'New Initiative'}
              disabled={isInitiativeFieldDisabled}
              className={inp}
              value={form.initiativeName ?? ''}
              onChange={e => s('initiativeName', e.target.value)}
              placeholder="e.g. Youth Skills Development or Secondary Bursary Scheme"
            />
          </Fld>

          {/* Initiative Component * */}
          <Fld label="Initiative Component *">
            <select
              required={addType === 'New Initiative'}
              disabled={isInitiativeFieldDisabled}
              className={inp}
              value={form.initiativeComponent ?? ''}
              onChange={e => handleInitiativeComponentChange(e.target.value)}
            >
              <option value="">Select Initiative Component</option>
              {INITIATIVE_COMPONENTS.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Fld>

          <Fld label="Sector *">
            <select
              required={!!addType}
              disabled={isGeneralFieldDisabled}
              className={inp}
              value={form.sector}
              onChange={e => s('sector', e.target.value)}
            >
              <option value="">Select sector</option>
              {availableSectors.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Fld>

          {/* Choose Region Dropdown (opens downwards, defaults to Select region) */}
          <DownwardSelect
            label="Choose Region *"
            value={form.region ?? ''}
            placeholder="Select region"
            options={REGIONS}
            onChange={handleRegionChange}
            required={!!addType}
            disabled={isGeneralFieldDisabled}
          />

          {/* District Dropdown (opens downwards, defaults to Select district, filtered by selected region) */}
          <DownwardSelect
            label="District *"
            value={form.district ?? ''}
            placeholder={
              form.region
                ? `Select district (${districtOptions.length} available in ${form.region} Region)`
                : "Select district"
            }
            options={districtOptions}
            onChange={handleDistrictChange}
            required={!!addType}
            disabled={isGeneralFieldDisabled}
          />

          {/* Constituency Dropdown (opens downwards, defaults to Select constituency) */}
          <DownwardSelect
            label="Constituency *"
            value={form.constituency ?? ''}
            placeholder={form.district ? `Select constituency (${constituencyOptions.length} available)` : "Select constituency"}
            options={constituencyOptions}
            onChange={handleConstituencyChange}
            required={!!addType}
            disabled={isGeneralFieldDisabled}
          />

          {/* Ward Dropdown (opens downwards, defaults to Select ward) */}
          <DownwardSelect
            label="Ward *"
            value={form.ward ?? ''}
            placeholder={
              form.constituency
                ? `Select ward (${wardOptions.length} available)`
                : form.district
                  ? `Select ward (${wardOptions.length} available in district)`
                  : "Select ward"
            }
            options={wardOptions}
            onChange={val => s('ward', val)}
            required={!!addType}
            disabled={isGeneralFieldDisabled}
          />
        </div>

        <Fld label="Description"><textarea rows={2} disabled={isGeneralFieldDisabled} className={inp} value={form.description} onChange={e => s('description', e.target.value)} /></Fld>
        <Fld label="Objectives"><textarea rows={2} disabled={isGeneralFieldDisabled} className={inp} value={form.objectives} onChange={e => s('objectives', e.target.value)} /></Fld>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Fld label="Traditional Authority"><input disabled={isGeneralFieldDisabled} className={inp} value={form.traditionalAuthority} onChange={e => s('traditionalAuthority', e.target.value)} placeholder="e.g. T/A Zulu" /></Fld>
          <Fld label="Location"><input disabled={isGeneralFieldDisabled} className={inp} value={form.location} onChange={e => s('location', e.target.value)} /></Fld>
          <Fld label="GPS Latitude"><input disabled={isGeneralFieldDisabled} className={inp} value={form.gpsLat} onChange={e => s('gpsLat', e.target.value)} placeholder="-13.xxxx" /></Fld>
          <Fld label="GPS Longitude"><input disabled={isGeneralFieldDisabled} className={inp} value={form.gpsLng} onChange={e => s('gpsLng', e.target.value)} placeholder="33.xxxx" /></Fld>
          <Fld label="Beneficiaries"><input type="number" min={0} disabled={isGeneralFieldDisabled} className={inp} value={form.beneficiaries || ''} onChange={e => s('beneficiaries', Number(e.target.value))} /></Fld>
          <Fld label="Beneficiary Type">
            <select disabled={isGeneralFieldDisabled} className={inp} value={form.beneficiaryType ?? ''} onChange={e => s('beneficiaryType', e.target.value)}>
              <option value="">Select beneficiary type (optional)</option>
              {BENEFICIARY_TYPES.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </Fld>
          <Fld label="Budget (MK)"><input type="number" min={0} step={50000} disabled={isGeneralFieldDisabled} className={inp} value={form.budget || ''} onChange={e => s('budget', Number(e.target.value))} /></Fld>
          <Fld label="Funding Source"><input disabled={isGeneralFieldDisabled} className={inp} value={form.fundingSource} onChange={e => s('fundingSource', e.target.value)} /></Fld>
          <Fld label="Status">
            <select disabled={isGeneralFieldDisabled} className={inp} value={form.status} onChange={e => s('status', e.target.value as Project['status'])}>
              {['Proposed','Assessed','Approved','Not Started','Ongoing','Near Completion','Completed','Suspended','On Hold','Stalled'].map(x => <option key={x}>{x}</option>)}
            </select>
          </Fld>
          <Fld label="Progress (%)"><input type="number" min={0} max={100} disabled={isProjectSpecificDisabled} className={inp} value={form.progress} onChange={e => s('progress', Number(e.target.value))} /></Fld>
          <Fld label="Implementing Department">
            <select disabled={isGeneralFieldDisabled} className={inp} value={form.implementingDept} onChange={e => s('implementingDept', e.target.value)}>
              <option value="">Select department</option>
              {IMPLEMENTING_DEPTS.map(x => <option key={x}>{x}</option>)}
            </select>
          </Fld>
          <Fld label="Contractor"><input disabled={isProjectSpecificDisabled} className={inp} value={form.contractor} onChange={e => s('contractor', e.target.value)} /></Fld>
          <Fld label="Assigned Monitor">
            <select disabled={isGeneralFieldDisabled} className={inp} value={form.monitor} onChange={e => s('monitor', e.target.value)}>
              <option value="">Select monitor</option>
              {monitorList.filter(m => m.status === 'Active').map(m => <option key={m.id}>{m.name}</option>)}
            </select>
          </Fld>
          <Fld label="Approval Date"><input type="date" disabled={isGeneralFieldDisabled} className={inp} value={form.approvalDate} onChange={e => s('approvalDate', e.target.value)} /></Fld>
          <Fld label="Start Date"><input type="date" disabled={isProjectSpecificDisabled} className={inp} value={form.startDate} onChange={e => s('startDate', e.target.value)} /></Fld>
          <Fld label="Expected Completion"><input type="date" disabled={isProjectSpecificDisabled} className={inp} value={form.expectedCompletion} onChange={e => s('expectedCompletion', e.target.value)} /></Fld>
          <Fld label="Actual Completion"><input type="date" disabled={isProjectSpecificDisabled} className={inp} value={form.actualCompletion} onChange={e => s('actualCompletion', e.target.value)} /></Fld>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            type="submit"
            disabled={!addType}
            className="px-5 py-2 rounded-lg text-sm bg-[#145a32] text-white font-semibold hover:bg-[#0f4424] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initial ? 'Save Changes' : (addType === 'New Initiative' ? 'Add Initiative' : 'Add Project')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Monitor Modal ─────────────────────────────────────────────────────────────
function MonitorModal({ initial, onSave, onClose }: {
  initial?: Monitor; onSave: (m: Monitor) => void; onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [wards, setWards] = useState(initial?.wards ?? '');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    onSave({
      id: initial?.id ?? `M${String(Date.now()).slice(-3)}`,
      name, email, phone, wards,
      assignedProjects: initial?.assignedProjects ?? 0,
      submitted: initial?.submitted ?? 0, approved: initial?.approved ?? 0, returned: initial?.returned ?? 0,
      lastActive: today, status: initial?.status ?? 'Active', joinDate: initial?.joinDate ?? today,
    });
  }

  return (
    <Modal title={initial ? 'Edit Monitor' : 'Add New Monitor'} onClose={onClose} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <Fld label="Full Name *"><input required className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grace Banda" /></Fld>
        <Fld label="Email Address *">
          <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="email" className={`${inp} pl-8`} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@councilyanga.mw" />
          </div>
        </Fld>
        <Fld label="Phone Number">
          <div className="relative"><Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className={`${inp} pl-8`} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+265 8xx xxx xxx" />
          </div>
        </Fld>
        <Fld label="Assigned Wards"><input className={inp} value={wards} onChange={e => setWards(e.target.value)} placeholder="e.g. Chizumulu North, Likoma South" /></Fld>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg text-sm bg-[#145a32] text-white font-semibold hover:bg-[#0f4424]">{initial ? 'Save Changes' : 'Add Monitor'}</button>
        </div>
      </form>
    </Modal>
  );
}

// ── Announcement Modal ────────────────────────────────────────────────────────
function AnnouncementModal({ initial, onSave, onClose }: {
  initial?: Announcement; onSave: (a: Announcement) => void; onClose: () => void;
}) {
  const CATS = ['New Projects', 'Project Completion', 'Progress Update', 'Community Meeting', 'CDF Notice', 'General'];
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'New Projects');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [body, setBody] = useState(initial?.body ?? '');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ id: initial?.id ?? `AN-${String(Date.now()).slice(-4)}`, title, category, date, body, published: initial?.published ?? true, createdBy: initial?.createdBy ?? 'Admin' });
  }

  return (
    <Modal title={initial ? 'Edit Announcement' : 'New Announcement'} onClose={onClose} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <Fld label="Title *"><input required className={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" /></Fld>
        <div className="grid grid-cols-2 gap-4">
          <Fld label="Category"><select className={inp} value={category} onChange={e => setCategory(e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select></Fld>
          <Fld label="Date"><input type="date" className={inp} value={date} onChange={e => setDate(e.target.value)} /></Fld>
        </div>
        <Fld label="Body *"><textarea required rows={5} className={inp} value={body} onChange={e => setBody(e.target.value)} placeholder="Announcement content..." /></Fld>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg text-sm bg-[#145a32] text-white font-semibold hover:bg-[#0f4424]">{initial ? 'Save Changes' : 'Publish'}</button>
        </div>
      </form>
    </Modal>
  );
}

// ── Schedule Visit Modal ──────────────────────────────────────────────────────
function ScheduleVisitModal({ onSave, onClose, monitorList, projectList, prefill }: {
  onSave: (data: { monitorId: string; monitorName: string; projectId: string; projectName: string; date: string; time: string; notes: string; ward: string }) => void;
  onClose: () => void;
  monitorList: Monitor[];
  projectList: Project[];
  prefill?: ScheduledVisit;
}) {
  const [monitorId, setMonitorId] = useState(prefill?.monitorId ?? '');
  const [projectId, setProjectId] = useState(prefill?.projectId ?? '');
  const [date, setDate] = useState(prefill ? '' : '');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState(prefill?.notes ?? '');

  const selectedMonitor = monitorList.find(m => m.id === monitorId);
  const availableProjects = projectId
    ? projectList
    : monitorId && selectedMonitor
    ? projectList.filter(p => p.monitor === selectedMonitor.name)
    : projectList;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const project = projectList.find(p => p.id === projectId)!;
    const monitor = monitorList.find(m => m.id === monitorId)!;
    onSave({ monitorId, monitorName: monitor.name, projectId, projectName: project.name, date, time, notes, ward: project.ward });
  }

  return (
    <Modal title={prefill ? 'Re-schedule Visit' : 'Schedule Monitor Visit'} onClose={onClose} size="sm">
      <form onSubmit={submit} className="space-y-4">
        {prefill && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <span className="font-semibold">Re-scheduling:</span> {prefill.projectName} - Original date was {prefill.date}
          </div>
        )}
        <Fld label="Monitor *">
          <select required className={inp} value={monitorId} onChange={e => { setMonitorId(e.target.value); setProjectId(''); }}>
            <option value="">Select monitor</option>
            {monitorList.filter(m => m.status === 'Active').map(m => <option key={m.id} value={m.id}>{m.name} ({m.wards})</option>)}
          </select>
        </Fld>
        <Fld label="Project *">
          <select required className={inp} value={projectId} onChange={e => setProjectId(e.target.value)}>
            <option value="">Select project</option>
            {availableProjects.map(p => <option key={p.id} value={p.id}>{p.name} - {p.ward}</option>)}
          </select>
        </Fld>
        <div className="grid grid-cols-2 gap-3">
          <Fld label="Visit Date *"><input required type="date" className={inp} value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></Fld>
          <Fld label="Visit Time *"><input required type="time" className={inp} value={time} onChange={e => setTime(e.target.value)} /></Fld>
        </div>
        <Fld label="Instructions / Notes">
          <textarea rows={3} className={inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What to inspect, what to bring, special instructions..." />
        </Fld>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg text-sm bg-[#145a32] text-white font-semibold hover:bg-[#0f4424]">{prefill ? 'Re-schedule & Notify Monitor' : 'Schedule & Notify Monitor'}</button>
        </div>
      </form>
    </Modal>
  );
}

// ── Submission Review Modal ───────────────────────────────────────────────────
function SubmissionReviewModal({ sub, action, onConfirm, onClose }: {
  sub: MonitorSubmission; action: 'approve' | 'return'; onConfirm: (note: string, progress?: number) => void; onClose: () => void;
}) {
  const [note, setNote] = useState('');
  const [progress, setProgress] = useState(sub.progress);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (action === 'return' && !note.trim()) return;
    onConfirm(note, isApprove ? progress : undefined);
  }
  const isApprove = action === 'approve';

  return (
    <Modal title={isApprove ? 'Approve Report & Update Project' : 'Return Report for Correction'} onClose={onClose} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-800">{sub.projectName}</p>
          <p className="text-xs text-gray-500">{sub.monitorName} / {sub.date} / {sub.progress}% progress reported</p>
          <p className="text-xs text-gray-600 leading-relaxed">{sub.observation}</p>
          {sub.photos && sub.photos.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1.5">Site Photos ({sub.photos.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {sub.photos.map((photo, idx) => (
                  <a key={idx} href={photo} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-90 transition-opacity border border-gray-200">
                    <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {progress === 100 && isApprove && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mt-2">
              <p className="text-xs font-semibold text-gray-700">100% progress detected - approving this report will automatically mark the project as <span className="underline font-bold">Completed</span>.</p>
            </div>
          )}
        </div>

        {isApprove && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Confirmed Project Progress Percentage</label>
              <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">{progress}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="flex-1 accent-[#145a32] cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={e => setProgress(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg text-center font-bold text-gray-700 bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-500">Quick set:</span>
              <button
                type="button"
                onClick={() => setProgress(sub.progress)}
                className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Reported ({sub.progress}%)
              </button>
              {[25, 50, 75, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProgress(val)}
                  className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        )}

        <Fld label={`Admin Note ${action === 'return' ? '* (required)' : '(optional)'}`}>
          <textarea
            required={action === 'return'}
            rows={3}
            className={inp}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={isApprove ? 'e.g. Report verified and project progress updated.' : 'e.g. Insufficient photos - please add at least 4 site photos and resubmit.'}
          />
        </Fld>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button type="submit" className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${isApprove ? 'bg-[#145a32] hover:bg-[#0f4424] text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
            {isApprove ? 'Approve & Update Progress' : 'Return for Correction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-start gap-3 mb-5"><AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={22} /><p className="text-sm text-gray-700">{message}</p></div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Ward Status Photo Modal ──────────────────────────────────────────────────
function WardStatusPhotoModal({
  initial,
  onSave,
  onClose,
  projects,
  defaultWard,
  defaultStatus,
  defaultCategory,
}: {
  initial?: WardStatusPhoto;
  onSave: (photo: WardStatusPhoto) => void;
  onClose: () => void;
  projects: Project[];
  defaultWard?: string;
  defaultStatus?: string;
  defaultCategory?: 'Project' | 'Initiative';
}) {
  // Constituencies maintained as inside new project or initiative in projects
  const availableConstituencies = useMemo(() => {
    const list = [...CONSTITUENCIES];
    const likomaIdx = list.indexOf('Likoma Island');
    if (likomaIdx > -1) {
      list.splice(likomaIdx, 1);
      list.unshift('Likoma Island');
    }
    if (initial?.constituency && !list.includes(initial.constituency)) {
      list.push(initial.constituency);
    }
    return list;
  }, [initial?.constituency]);

  const [constituency, setConstituency] = useState(
    initial?.constituency || 'Likoma Island'
  );

  // Wards maintained as inside new project or initiative in projects
  const availableWards = useMemo(() => {
    const list = constituency ? getWardsForConstituency(constituency) : WARDS;
    const res = list && list.length > 0 ? [...list] : [...WARDS];
    if (initial?.ward && !res.includes(initial.ward)) {
      res.unshift(initial.ward);
    }
    return res;
  }, [constituency, initial?.ward]);

  const [ward, setWard] = useState(
    initial?.ward || defaultWard || availableWards[0] || 'Likoma North Ward'
  );
  const [category, setCategory] = useState<'Project' | 'Initiative'>(initial?.category || defaultCategory || 'Project');
  const [status, setStatus] = useState(initial?.status || defaultStatus || 'Ongoing');
  const [projectId, setProjectId] = useState(initial?.projectId || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [caption, setCaption] = useState(initial?.caption || '');
  const [monitor, setMonitor] = useState(initial?.monitor || 'District Monitoring Officer');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().split('T')[0]);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>(initial?.url?.startsWith('data:') ? 'upload' : 'upload');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When constituency changes, update ward from available wards
  const handleConstituencyChange = (c: string) => {
    setConstituency(c);
    const nextWards = c ? getWardsForConstituency(c) : WARDS;
    if (nextWards && nextWards.length > 0) {
      if (!nextWards.includes(ward)) {
        setWard(nextWards[0]);
      }
    }
  };

  // Projects filtered by current ward and category
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchWard = !ward ||
        p.ward?.toLowerCase() === ward.toLowerCase() ||
        p.ward?.toLowerCase().includes(ward.toLowerCase().replace(/\s*ward/i, '')) ||
        ward.toLowerCase().includes(p.ward?.toLowerCase().replace(/\s*ward/i, ''));
      const isInit = isInitiative(p);
      const matchCat = category === 'Initiative' ? isInit : !isInit;
      return matchWard && matchCat;
    });
  }, [projects, ward, category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFileError('Image is larger than 8MB. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setFileError('Please upload an image or provide a valid image URL.');
      return;
    }
    if (!caption.trim()) {
      setFileError('Please provide a caption describing this status photo.');
      return;
    }

    let selectedProjectName = '';
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      if (found) {
        selectedProjectName = found.initiativeName || found.name;
      }
    }

    const item: WardStatusPhoto = {
      id: initial?.id || `wsp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ward,
      constituency,
      category,
      status,
      projectId: projectId || undefined,
      projectName: selectedProjectName || undefined,
      url: url.trim(),
      caption: caption.trim(),
      monitor: monitor.trim() || 'Ward Monitor',
      date: date || new Date().toISOString().split('T')[0],
      uploadedAt: initial?.uploadedAt || new Date().toISOString(),
    };

    onSave(item);
  };

  return (
    <Modal
      title={initial ? 'Update Projects Status' : 'Upload Photo'}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload Box */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-nowrap w-full">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap shrink-0">
              Ward Tracking Photo *
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0 flex-nowrap">
              <button
                type="button"
                onClick={() => setUploadMode('upload')}
                className={`whitespace-nowrap px-2.5 py-1 sm:py-0.5 rounded-lg text-[11px] sm:text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  uploadMode === 'upload' ? 'bg-[#145a32] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`whitespace-nowrap px-2.5 py-1 sm:py-0.5 rounded-lg text-[11px] sm:text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  uploadMode === 'url' ? 'bg-[#145a32] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Paste URL
              </button>
            </div>
          </div>

          {uploadMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {url ? (
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 overflow-hidden group">
                  <img
                    src={url}
                    alt="Status Preview"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#145a32] rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-50"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#145a32] flex items-center justify-center mx-auto mb-2">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Click to select or drag & drop status photo
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Supports PNG, JPG, JPEG, WEBP (recommended max 8MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                type="url"
                className={inp}
                placeholder="https://example.com/field-photo.jpg"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              {url && (
                <div className="mt-2 rounded-xl border border-gray-200 overflow-hidden h-36 bg-gray-100">
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setFileError('Could not load image from URL. Please check the address.')}
                  />
                </div>
              )}
            </div>
          )}

          {fileError && <p className="text-xs text-red-600 mt-1 font-medium">{fileError}</p>}
        </div>

        {/* Location & Category Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Fld label="Constituency *">
            <select
              className={inp}
              value={constituency}
              onChange={e => handleConstituencyChange(e.target.value)}
            >
              {availableConstituencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Fld>

          <Fld label="Ward *">
            <select
              className={inp}
              value={ward}
              onChange={e => setWard(e.target.value)}
            >
              {availableWards.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </Fld>

          <Fld label="Category *">
            <select
              className={inp}
              value={category}
              onChange={e => setCategory(e.target.value as 'Project' | 'Initiative')}
            >
              <option value="Project">Project</option>
              <option value="Initiative">Initiative</option>
            </select>
          </Fld>
        </div>

        {/* Tracking Status */}
        <Fld label="Tracking Status (Stage) *">
          <select
            className={inp}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="Proposed">Proposed</option>
            <option value="Assessed">Assessed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Near Completion">Near Completion</option>
            <option value="Completed">Completed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </Fld>

        {/* Caption */}
        <Fld label="Caption / Status Description *">
          <textarea
            required
            rows={2}
            className={inp}
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="e.g. Field inspection of foundation works for the solar-powered community cold storage"
          />
        </Fld>

        {/* Monitor & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Fld label="Monitor / Inspector Name">
            <input
              type="text"
              className={inp}
              value={monitor}
              onChange={e => setMonitor(e.target.value)}
              placeholder="e.g. Kondwani Chirwa (Ward Monitor)"
            />
          </Fld>

          <Fld label="Observation / Capture Date *">
            <input
              type="date"
              required
              className={inp}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </Fld>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-sm text-white font-semibold bg-[#145a32] hover:bg-[#0f4424] cursor-pointer shadow-sm"
          >
            {initial ? 'Save Changes' : 'Upload Photo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Ward Photo Lightbox Modal ────────────────────────────────────────────────
function WardPhotoLightboxModal({
  photo,
  onClose,
  onEdit,
}: {
  photo: WardStatusPhoto;
  onClose: () => void;
  onEdit: (photo: WardStatusPhoto) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-full h-auto max-h-[60vh] object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('photo-1590486803833')) {
                target.src = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80';
              }
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 text-white rounded"
              style={{
                background:
                  photo.status === 'Completed'
                    ? '#16a34a'
                    : photo.status === 'Ongoing'
                    ? '#2563eb'
                    : photo.status === 'Assessed'
                    ? '#7c3aed'
                    : photo.status === 'Near Completion'
                    ? '#0891b2'
                    : photo.status === 'Proposed'
                    ? '#d97706'
                    : '#dc2626',
              }}
            >
              {photo.status}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
              {photo.ward}
            </span>
            <CategoryBadge category={photo.category} />
            {photo.projectName && (
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-800 rounded truncate max-w-xs">
                Linked: {photo.projectName}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-gray-900 mb-2 leading-snug">
            {photo.caption}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-3">
            <span className="font-medium text-gray-700">{photo.ward}</span>
            <span>Captured: {photo.date}</span>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                onClose();
                onEdit(photo);
              }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#145a32] text-white hover:bg-[#0f4424] cursor-pointer"
            >
              Change Picture / Edit Details
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function MiniStat({ label, value, sub, icon }: { label: string; value: string | number; accent?: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1.5 p-4 shadow-sm" style={{ background: '#016630', borderRadius: '0.2rem', minHeight: '108px' }}>
      {icon && <div className="text-white flex items-center justify-center">{icon}</div>}
      <p className="text-xl font-black text-white leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>{value}</p>
      <p className="text-[11px] font-semibold text-white/90 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-white/75">{sub}</p>}
    </div>
  );
}

const PCOLORS = ['#16a34a', '#2563eb', '#d97706', '#0891b2', '#dc2626', '#7c3aed', '#db2777'];
const CHART_COLORS = ['#16a34a', '#2563eb', '#d97706', '#0891b2', '#dc2626', '#7c3aed', '#db2777'];

const SECTOR_COLORS: Record<string, string> = {
  Roads: '#16a34a',
  'Roads and Bridges': '#16a34a',
  Education: '#2563eb',
  Agriculture: '#d97706',
  'Agriculture and Irrigation Projects': '#d97706',
  Energy: '#7c3aed',
  Health: '#dc2626',
  'Health and Nutrition': '#dc2626',
  'Water & Sanitation': '#0891b2',
  'Water and Sanitation': '#0891b2',
  'Community Infrastructure': '#9ca3af',
  'Court Rooms': '#6366f1',
  'Continuing projects transferred from the other center': '#059669',
  'Projects from other sectors': '#e11d48',
  'Agriculture & Environment': '#d97706',
};

const BENEFICIARY_ORDER = [
  'District-Wide',
  'Women Entrepreneurs',
  'Students',
  'Youth Entrepreneurs',
  'Sports, creative arts & Innovation',
] as const;

const BENEFICIARY_COLORS: Record<string, string> = {
  'District-Wide': '#16a34a',
  'Women Entrepreneurs': '#ec4899',
  'Students': '#2563eb',
  'Youth Entrepreneurs': '#f97316',
  'Sports, creative arts & Innovation': '#8b5cf6',
};

// Donut chart outside value callout label with elbow leader lines
function renderDonutCalloutLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, value } = props;
  if (!value || value === 0) return null;

  const RADIAN = Math.PI / 180;
  const sx = cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN);

  const mx = cx + (outerRadius + 7) * Math.cos(-midAngle * RADIAN);
  const my = cy + (outerRadius + 7) * Math.sin(-midAngle * RADIAN);

  const isRight = Math.cos(-midAngle * RADIAN) >= 0;
  const ex = mx + (isRight ? 7 : -7);
  const ey = my;
  const textAnchor = isRight ? 'start' : 'end';

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke="#94a3b8"
        strokeWidth={1.2}
        fill="none"
      />
      <text
        x={ex + (isRight ? 3 : -3)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="#334155"
        fontSize={10.5}
        fontWeight={700}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </text>
    </g>
  );
}

// Beneficiaries Distribution Callout Label: displays figure + percentage on the same line
function renderBeneficiaryDonutCalloutLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, value, percent } = props;
  if (!value || value === 0) return null;

  const RADIAN = Math.PI / 180;
  const sx = cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN);

  const mx = cx + (outerRadius + 7) * Math.cos(-midAngle * RADIAN);
  const my = cy + (outerRadius + 7) * Math.sin(-midAngle * RADIAN);

  const isRight = Math.cos(-midAngle * RADIAN) >= 0;
  const ex = mx + (isRight ? 7 : -7);
  const ey = my;
  const textAnchor = isRight ? 'start' : 'end';

  const pct = typeof percent === 'number'
    ? `${(percent * 100).toFixed(1).replace(/\.0$/, '')}%`
    : '';
  const valStr = typeof value === 'number' ? value.toLocaleString() : String(value);

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke="#94a3b8"
        strokeWidth={1.2}
        fill="none"
      />
      <text
        x={ex + (isRight ? 3 : -3)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="#334155"
        fontSize={10.5}
        fontWeight={700}
      >
        {valStr}
        {pct && (
          <tspan fill="#64748b" fontSize={9.5} fontWeight={500}>
            {` (${pct})`}
          </tspan>
        )}
      </text>
    </g>
  );
}

// Top Bar Label for Constituency Funds Disbursed vs Utilised grouped bar chart
function renderFundsBarTopLabel(props: any, color: string) {
  const { x, y, width, value } = props;
  if (value === undefined || value === null || value === 0) return null;
  const label = value >= 1_000_000
    ? `${Math.round(value / 1_000_000)}M`
    : `${Math.round(value / 1_000)}k`;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill={color}
      textAnchor="middle"
      fontSize={10}
      fontWeight={600}
    >
      {label}
    </text>
  );
}

function ConstituencyFundsTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-xs min-w-[210px]">
      <p className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{data.constituency}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-blue-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
            Amount Disbursed:
          </span>
          <span className="font-bold text-gray-900">{formatMK(data.disbursed)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#016630] inline-block" />
            Amount Utilised:
          </span>
          <span className="font-bold text-gray-900">{formatMK(data.utilised)}</span>
        </div>
        <div className="pt-1.5 mt-1 border-t border-gray-100 flex items-center justify-between text-gray-500">
          <span>Total Projects:</span>
          <span className="font-medium text-gray-700">{data.projectCount} projects</span>
        </div>
      </div>
    </div>
  );
}

// White Inside Bar Label for Projects by Ward bar chart
function renderWardBarInsideLabel(props: any) {
  const { x, y, width, height, value } = props;
  if (value === undefined || value === null || value === 0 || height < 12) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10.5}
      fontWeight={700}
    >
      {value}
    </text>
  );
}

function VisitStatusPill({ status }: { status: ScheduledVisit['status'] }) {
  const bg: Record<string, string> = {
    Upcoming: '#d97706',
    Acknowledged: '#2563eb',
    Completed: '#016630',
    Missed: '#dc2626',
    Rescheduled: '#7c3aed',
  };
  return <span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
}

function SubStatusPill({ status }: { status: MonitorSubmission['status'] }) {
  const bg: Record<string, string> = {
    'Pending Review': '#d97706',
    'Approved': '#016630',
    'Returned': '#dc2626',
  };
  return <span className="text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'wardPhotos', label: 'Update Projects Status', icon: Camera },
  { id: 'monitors', label: 'Monitors', icon: Users },
  { id: 'schedule', label: 'Schedule Visits', icon: Calendar },
  { id: 'monitorReports', label: 'Monitor Reports', icon: Send },
  { id: 'feedback', label: 'Citizen Feedback', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'audit', label: 'Audit Trail', icon: ScrollText },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
] as const;

type Section = typeof NAV[number]['id'];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard({
  onLogout, sharedProjects, setSharedProjects,
  visits, setVisits, submissions, setSubmissions,
  sysNotifs, setSysNotifs,
  sharedFeedback, setSharedFeedback,
  users, setUsers,
  sharedMonitors, setSharedMonitors,
  sharedAnnouncements, setSharedAnnouncements,
  sharedWardStatusPhotos, setSharedWardStatusPhotos,
}: AdminDashboardProps) {
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, show } = useToast();

  const localMonitors = sharedMonitors;
  const setLocalMonitors = setSharedMonitors;
  const localAnnouncements = sharedAnnouncements;
  const setLocalAnnouncements = setSharedAnnouncements;
  const localFeedback = sharedFeedback;
  const setLocalFeedback = setSharedFeedback;
  const localWardPhotos = sharedWardStatusPhotos ?? initialWardStatusPhotos;
  const [monitorPopup, setMonitorPopup] = useState<{ name: string; email: string; wards: string } | null>(null);

  // Admin notification bell
  const adminNotifs = sysNotifs.filter(n => n.for === 'admin');
  const adminUnread = adminNotifs.filter(n => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  type Modal =
    | { kind: 'new-project' }
    | { kind: 'edit-project'; project: Project }
    | { kind: 'view-project'; project: Project }
    | { kind: 'upload-ward-photo'; initialPhoto?: WardStatusPhoto; defaultWard?: string; defaultStatus?: string; defaultCategory?: 'Project' | 'Initiative' }
    | { kind: 'view-ward-photo'; photo: WardStatusPhoto }
    | { kind: 'add-monitor' }
    | { kind: 'edit-monitor'; monitor: Monitor }
    | { kind: 'new-announcement' }
    | { kind: 'edit-announcement'; announcement: Announcement }
    | { kind: 'schedule-visit' }
    | { kind: 'reschedule-visit'; visit: ScheduledVisit }
    | { kind: 'review-submission'; submission: MonitorSubmission; action: 'approve' | 'return' }
    | { kind: 'confirm'; message: string; action: () => void };

  const [modal, setModal] = useState<Modal | null>(null);

  const [projSearch, setProjSearch] = useState('');
  const [projStatus, setProjStatus] = useState('All');
  const [projComponent, setProjComponent] = useState('All Project Components');
  const [dashboardComponent, setDashboardComponent] = useState('All Project Components');
  const [monSearch, setMonSearch] = useState('');
  const [fbFilter, setFbFilter] = useState('All');
  const [auditSearch, setAuditSearch] = useState('');
  const [visitFilter, setVisitFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [photoLightbox, setPhotoLightbox] = useState<string | null>(null);

  // Ward Status Photos state
  const [wardPhotoSearch, setWardPhotoSearch] = useState('');
  const [wardPhotoConstituency, setWardPhotoConstituency] = useState('All');
  const [wardPhotoWard, setWardPhotoWard] = useState('All');
  const [wardPhotoCategory, setWardPhotoCategory] = useState<'All' | 'Project' | 'Initiative'>('All');
  const [wardPhotoStatus, setWardPhotoStatus] = useState('All');
  const [wardPhotoDesktopSlide, setWardPhotoDesktopSlide] = useState(0);
  const [wardPhotoMobileSlide, setWardPhotoMobileSlide] = useState(0);
  const [wardStatusSubTab, setWardStatusSubTab] = useState<'progress' | 'photos'>('progress');
  const [editingWardProgress, setEditingWardProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setWardPhotoDesktopSlide(0);
    setWardPhotoMobileSlide(0);
  }, [wardPhotoSearch, wardPhotoConstituency, wardPhotoWard, wardPhotoCategory, wardPhotoStatus]);

  // Constituencies maintained as inside new project or initiative in projects
  const wardPhotoConstituencyOptions = useMemo(() => {
    const list = [...CONSTITUENCIES];
    const likomaIdx = list.indexOf('Likoma Island');
    if (likomaIdx > -1) {
      list.splice(likomaIdx, 1);
      list.unshift('Likoma Island');
    }
    localWardPhotos.forEach(p => {
      if (p.constituency && !list.includes(p.constituency)) {
        list.push(p.constituency);
      }
    });
    return list;
  }, [localWardPhotos]);

  // Wards maintained as inside new project or initiative in projects
  const wardPhotoWardOptions = useMemo(() => {
    if (wardPhotoConstituency && wardPhotoConstituency !== 'All') {
      const list = getWardsForConstituency(wardPhotoConstituency);
      const res = list && list.length > 0 ? [...list] : [];
      localWardPhotos.forEach(p => {
        if (p.ward && !res.includes(p.ward)) {
          if (
            p.constituency === wardPhotoConstituency ||
            (wardPhotoConstituency === 'Likoma Island' &&
              (p.constituency === 'Chizumulu Island' ||
                p.ward.toLowerCase().includes('chizumulu') ||
                p.ward.toLowerCase().includes('likoma')))
          ) {
            res.push(p.ward);
          }
        }
      });
      return res.length > 0 ? res : [...WARDS];
    }
    const all = [...WARDS];
    localWardPhotos.forEach(p => {
      if (p.ward && !all.includes(p.ward)) {
        all.push(p.ward);
      }
    });
    return all;
  }, [wardPhotoConstituency, localWardPhotos]);

  const saveWardStatusPhoto = (photo: WardStatusPhoto) => {
    if (setSharedWardStatusPhotos) {
      setSharedWardStatusPhotos(prev => {
        const existing = prev.some(p => p.id === photo.id);
        const updated = existing
          ? prev.map(p => p.id === photo.id ? photo : p)
          : [photo, ...prev];
        saveStoredWardStatusPhotos(updated);
        return updated;
      });
    }
    setModal(null);
    show('Ward tracking status photo saved successfully!');
  };

  const deleteWardStatusPhoto = (id: string) => {
    setModal({
      kind: 'confirm',
      message: 'Are you sure you want to delete this ward status photo? It will be removed from the tracking carousels on the public portal.',
      action: () => {
        if (setSharedWardStatusPhotos) {
          setSharedWardStatusPhotos(prev => {
            const updated = prev.filter(p => p.id !== id);
            saveStoredWardStatusPhotos(updated);
            return updated;
          });
        }
        setModal(null);
        show('Ward status photo deleted.');
      }
    });
  };

  function saveEditedNote(subId: string) {
    const today = new Date().toISOString().slice(0, 10);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, adminNote: editNoteText, reviewedAt: today } : s));
    setEditNoteId(null);
    setEditNoteText('');
    show('Admin note updated.');
  }

  const dashboardFilteredProjects = React.useMemo(() => {
    if (dashboardComponent === 'All Project Components' || dashboardComponent === 'All') {
      return sharedProjects;
    }
    return sharedProjects.filter(p => p.component === dashboardComponent || p.initiativeComponent === dashboardComponent);
  }, [sharedProjects, dashboardComponent]);

  const projectItems = dashboardFilteredProjects.filter(p => !isInitiative(p));
  const initiativeItems = dashboardFilteredProjects.filter(p => isInitiative(p));
  const totalProjectsCount = projectItems.length;
  const totalInitiativesCount = initiativeItems.length;
  const completed = dashboardFilteredProjects.filter(p => p.status === 'Completed').length;
  const ongoing = dashboardFilteredProjects.filter(p => ['Ongoing', 'Near Completion'].includes(p.status)).length;
  const totalBudget = dashboardFilteredProjects.reduce((s, p) => s + p.budget, 0);
  const totalBeneficiaries = dashboardFilteredProjects.reduce((s, p) => s + p.beneficiaries, 0);
  const totalFundsDisbursed = dashboardFilteredProjects.reduce((s, p) => s + getProjectDisbursed(p), 0);
  const unresolved = localFeedback.filter(f => f.status !== 'Resolved' && f.status !== 'Rejected').length;
  const pendingReports = submissions.filter(s => s.status === 'Pending Review').length;
  const approvedReports = submissions.filter(s => s.status === 'Approved').length;
  const returnedReports = submissions.filter(s => s.status === 'Returned').length;
  const missedVisits = visits.filter(v => v.status === 'Missed').length;

  // Dynamic Projects by Ward Data
  const activeWardsWithProjects = Array.from(new Set(dashboardFilteredProjects.map(p => p.ward))).filter(Boolean);
  const dynamicWardData = (activeWardsWithProjects.length > 0 ? activeWardsWithProjects : WARDS).map(ward => {
    const wardProjects = dashboardFilteredProjects.filter(p => p.ward === ward);
    return {
      ward: ward.replace('Chizumulu ', 'Chiz. ').replace('Likoma ', 'Lik. ').replace(' Ward', ''),
      total: wardProjects.length,
      ongoing: wardProjects.filter(p => ['Ongoing', 'Near Completion'].includes(p.status)).length,
      completed: wardProjects.filter(p => p.status === 'Completed').length,
      notStarted: wardProjects.filter(p => ['Not Started', 'Approved', 'Assessed', 'Proposed'].includes(p.status)).length,
    };
  });

  // Dynamic Projects by Sector Data
  const dynamicSectorData = React.useMemo(() => {
    const map: Record<string, number> = {};
    dashboardFilteredProjects.forEach(p => {
      if (p.sector) {
        map[p.sector] = (map[p.sector] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [dashboardFilteredProjects]);
  const totalSectorProjects = dynamicSectorData.reduce((s, d) => s + d.value, 0);

  // Dynamic Beneficiaries Distribution Data
  const dynamicBeneficiaryDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    dashboardFilteredProjects.forEach(p => {
      const type = getProjectBeneficiaryType(p);
      map[type] = (map[type] || 0) + (p.beneficiaries || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => {
        const idxA = (BENEFICIARY_ORDER as readonly string[]).indexOf(a.name);
        const idxB = (BENEFICIARY_ORDER as readonly string[]).indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return b.value - a.value;
      });
  }, [dashboardFilteredProjects]);
  const totalBeneficiariesInDistribution = dynamicBeneficiaryDistribution.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic Funds Disbursed vs Utilised by Constituency Data
  const constituencyFundsData = React.useMemo(() => {
    const constituencyMap: Record<string, {
      constituency: string;
      constituencyShort: string;
      disbursed: number;
      utilised: number;
      budget: number;
      projectCount: number;
    }> = {};

    dashboardFilteredProjects.forEach(p => {
      const constName = p.constituency || 'Likoma Island';
      if (!constituencyMap[constName]) {
        constituencyMap[constName] = {
          constituency: constName,
          constituencyShort: constName.replace(/\s*Constituency\s*/gi, '').trim(),
          disbursed: 0,
          utilised: 0,
          budget: 0,
          projectCount: 0,
        };
      }

      const item = constituencyMap[constName];
      item.disbursed += getProjectDisbursed(p);
      item.utilised += getProjectUtilised(p);
      item.budget += (p.budget || 0);
      item.projectCount += 1;
    });

    return Object.values(constituencyMap)
      .filter(c => c.disbursed > 0 || c.utilised > 0 || c.projectCount > 0)
      .sort((a, b) => b.disbursed - a.disbursed);
  }, [dashboardFilteredProjects]);

  // Project CRUD
  function saveProject(p: Project) {
    const today = new Date().toISOString().slice(0, 10);
    const isInit = isInitiative(p);
    if (sharedProjects.find(x => x.id === p.id)) {
      setSharedProjects(prev => prev.map(x => x.id === p.id ? { ...p, lastUpdated: today } : x));
      show(`${isInit ? 'Initiative' : 'Project'} "${p.name}" updated.`);
    } else {
      const prefix = isInit ? 'CY-INIT' : 'CY-2026';
      const newId = `${prefix}-${String(sharedProjects.length + 1).padStart(3, '0')}`;
      setSharedProjects(prev => [{ ...p, id: newId, createdDate: today, lastUpdated: today }, ...prev]);
      show(`${isInit ? 'Initiative' : 'Project'} "${p.name}" added.`);
    }
    setModal(null);
  }

  function deleteProject(id: string) {
    const p = sharedProjects.find(x => x.id === id);
    setModal({ kind: 'confirm', message: `Delete project "${p?.name}"? This cannot be undone.`, action: () => {
      setSharedProjects(prev => prev.filter(x => x.id !== id));
      show('Project deleted.', 'info');
      setModal(null);
    }});
  }

  // Monitor CRUD
  function saveMonitor(m: Monitor) {
    if (localMonitors.find(x => x.id === m.id)) {
      setLocalMonitors(prev => prev.map(x => x.id === m.id ? m : x));
      setUsers(prev => prev.map(u => u.monitorId === m.id ? { ...u, name: m.name, email: m.email } : u));
      show(`Monitor "${m.name}" updated.`);
    } else {
      setLocalMonitors(prev => [...prev, m]);
      setMonitorPopup({ name: m.name, email: m.email, wards: m.wards });
      setTimeout(() => setMonitorPopup(null), 10000);
      show(`Monitor "${m.name}" added. Ward assignment details sent.`);
    }
    setModal(null);
  }

  function toggleMonitorStatus(m: Monitor) {
    const action = m.status === 'Active' ? 'Deactivate' : 'Reactivate';
    setModal({ kind: 'confirm', message: `${action} monitor "${m.name}"?`, action: () => {
      setLocalMonitors(prev => prev.map(x => x.id === m.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x));
      show(`Monitor ${m.status === 'Active' ? 'deactivated' : 'reactivated'}.`, 'info');
      setModal(null);
    }});
  }

  // Announcement CRUD
  function saveAnnouncement(a: Announcement) {
    if (localAnnouncements.find(x => x.id === a.id)) {
      setLocalAnnouncements(prev => prev.map(x => x.id === a.id ? a : x));
      show('Announcement updated.');
    } else {
      setLocalAnnouncements(prev => [a, ...prev]);
      show(`Announcement published.`);
      if (a.published) {
        setSysNotifs(prev => [{
          id: `SN-${Date.now()}`,
          type: 'submission' as const,
          title: 'Announcement Published',
          message: `"${a.title}" is now visible on the public portal.`,
          date: new Date().toISOString().slice(0, 10),
          read: false,
          for: 'admin' as const,
        }, ...prev]);
      }
    }
    setModal(null);
  }

  function togglePublished(a: Announcement) {
    setModal({ kind: 'confirm', message: `${a.published ? 'Unpublish' : 'Republish'} "${a.title}"?`, action: () => {
      setLocalAnnouncements(prev => prev.map(x => x.id === a.id ? { ...x, published: !x.published } : x));
      show(`Announcement ${a.published ? 'unpublished' : 'republished'}.`, 'info');
      setModal(null);
    }});
  }

  // Feedback
  function resolveFb(id: string) {
    setLocalFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'Resolved', resolvedDate: new Date().toISOString().slice(0, 10) } : f));
    show('Feedback marked Resolved.');
  }
  function reviewFb(id: string) {
    setLocalFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'Under Review' } : f));
    show('Feedback moved to Under Review.', 'info');
  }
  function verifyFb(id: string) {
    setLocalFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'Verification Requested' } : f));
    show('Verification request sent.', 'info');
  }

  // Schedule Visit
  function scheduleVisit(data: { monitorId: string; monitorName: string; projectId: string; projectName: string; date: string; time: string; notes: string; ward: string }) {
    const today = new Date().toISOString().slice(0, 10);
    const newId = `V-${String(Date.now()).slice(-4)}`;
    const newVisit: ScheduledVisit = {
      id: newId, ...data,
      status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: today,
    };
    setVisits(prev => [newVisit, ...prev]);
    // Notify monitor
    setSysNotifs(prev => [{
      id: `SN-${Date.now()}`, for: 'monitor', monitorId: data.monitorId,
      type: 'visit_scheduled', title: 'New Site Visit Scheduled',
      message: `Admin scheduled a site visit to "${data.projectName}" on ${data.date} at ${data.time}. Please acknowledge.`,
      date: today, read: false, visitId: newId, projectId: data.projectId,
    }, ...prev]);
    show(`Visit scheduled for ${data.monitorName} on ${data.date}.`);
    setModal(null);
  }

  // Re-schedule Visit
  function rescheduleVisit(oldVisit: ScheduledVisit, data: { monitorId: string; monitorName: string; projectId: string; projectName: string; date: string; time: string; notes: string; ward: string }) {
    const today = new Date().toISOString().slice(0, 10);
    const newId = `V-${String(Date.now()).slice(-4)}`;
    // Mark old as rescheduled
    setVisits(prev => prev.map(v => v.id === oldVisit.id ? { ...v, status: 'Rescheduled' } : v));
    // Create new visit
    const newVisit: ScheduledVisit = {
      id: newId, ...data,
      status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: today,
      rescheduledFrom: oldVisit.date,
    };
    setVisits(prev => [newVisit, ...prev]);
    // Notify monitor
    setSysNotifs(prev => [{
      id: `SN-${Date.now()}`, for: 'monitor', monitorId: data.monitorId,
      type: 'visit_rescheduled', title: 'Visit Re-scheduled',
      message: `Admin re-scheduled your missed visit to "${data.projectName}". New date: ${data.date} at ${data.time}. Please acknowledge.`,
      date: today, read: false, visitId: newId, projectId: data.projectId,
    }, ...prev]);
    show(`Visit re-scheduled for ${data.date}. Monitor notified.`);
    setModal(null);
  }

  // Approve Submission
  function approveSubmission(sub: MonitorSubmission, note: string, updatedProgress?: number) {
    const today = new Date().toISOString().slice(0, 10);
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Approved', adminNote: note, reviewedAt: today } : s));
    const progToSet = typeof updatedProgress === 'number' ? updatedProgress : sub.progress;
    const isCompleted = progToSet === 100;

    setSharedProjects(prev => prev.map(p => {
      if (p.id === sub.projectId || p.name.toLowerCase() === sub.projectName.toLowerCase()) {
        return {
          ...p,
          progress: progToSet,
          status: isCompleted ? 'Completed' : (progToSet >= 80 ? 'Near Completion' : (progToSet > 0 ? 'Ongoing' : p.status)),
          actualCompletion: isCompleted ? today : p.actualCompletion,
          lastUpdated: today,
        };
      }
      return p;
    }));

    // Notify monitor
    setSysNotifs(prev => [{
      id: `SN-${Date.now()}`, for: 'monitor', monitorId: sub.monitorId,
      type: 'submission_approved', title: 'Report Approved & Progress Updated',
      message: `Your field report ${sub.id} for "${sub.projectName}" has been approved. Project progress is set to ${progToSet}%.`,
      date: today, read: false, submissionId: sub.id, projectId: sub.projectId,
    }, ...prev]);
    show(`Report approved and progress set to ${progToSet}%. Monitor notified.`);
    setModal(null);
  }

  // Save Ward Project Progress
  function saveWardProjectProgress(project: Project, newProgress: number, report?: MonitorSubmission) {
    const today = new Date().toISOString().slice(0, 10);
    const isCompleted = newProgress === 100;
    const newStatus = isCompleted ? 'Completed' : (newProgress >= 80 ? 'Near Completion' : (newProgress > 0 ? 'Ongoing' : project.status));

    setSharedProjects(prev => prev.map(p => p.id === project.id ? {
      ...p,
      progress: newProgress,
      status: newStatus,
      actualCompletion: isCompleted ? today : p.actualCompletion,
      lastUpdated: today,
    } : p));

    // Find monitor to notify
    const monitor = localMonitors.find(m =>
      (project.monitor && m.name.toLowerCase() === project.monitor.toLowerCase()) ||
      (project.ward && m.wards?.toLowerCase().includes(project.ward.toLowerCase()))
    );

    const monitorId = report?.monitorId || monitor?.id;
    if (monitorId) {
      setSysNotifs(prev => [{
        id: `SN-${Date.now()}`,
        for: 'monitor',
        monitorId,
        type: 'project_progress_updated',
        title: 'Project Progress Updated',
        message: `Admin updated progress of "${project.name}" (${project.ward}) to ${newProgress}%${report ? ` following approved report ${report.id}` : ''}.`,
        date: today,
        read: false,
        projectId: project.id,
      }, ...prev]);
    }

    show(`Progress for "${project.name}" updated to ${newProgress}%. Monitor notified.`);
  }

  // Return Submission
  function returnSubmission(sub: MonitorSubmission, note: string) {
    const today = new Date().toISOString().slice(0, 10);
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'Returned', adminNote: note, reviewedAt: today } : s));
    setSysNotifs(prev => [{
      id: `SN-${Date.now()}`, for: 'monitor', monitorId: sub.monitorId,
      type: 'submission_returned', title: 'Report Returned for Correction',
      message: `Your field report ${sub.id} for "${sub.projectName}" was returned. Admin note: ${note}`,
      date: today, read: false, submissionId: sub.id, projectId: sub.projectId,
    }, ...prev]);
    show('Report returned for correction.', 'info');
    setModal(null);
  }

  // Exports
  function doCSV() {
    exportToCSV(sharedProjects.map(p => ({
      'Project ID': p.id, 'Project Name': p.name, Sector: p.sector,
      Constituency: p.constituency, Ward: p.ward, Status: p.status,
      'Progress (%)': p.progress, 'Budget (MK)': p.budget, Beneficiaries: p.beneficiaries,
      Monitor: p.monitor, 'Expected Completion': p.expectedCompletion,
    })), 'CouncilYanga_Projects');
    show('CSV downloaded.');
  }
  function doExcel() {
    exportToExcel(sharedProjects.map(p => ({
      'Project ID': p.id, 'Project Name': p.name, Sector: p.sector,
      Ward: p.ward, Status: p.status, 'Progress (%)': p.progress,
      'Budget (MK)': p.budget, Beneficiaries: p.beneficiaries, Monitor: p.monitor,
    })), 'CouncilYanga_Projects');
    show('Excel file downloaded.');
  }
  function doPDF() {
    const tot = sharedProjects.reduce((s,p)=>s+p.budget,0);
    const benef = sharedProjects.reduce((s,p)=>s+p.beneficiaries,0);
    const comp = sharedProjects.filter(p=>p.status==='Completed').length;
    const ong = sharedProjects.filter(p=>p.status==='Ongoing').length;
    const kpiHtml = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
      ${[['Total Projects',sharedProjects.length,'#145a32'],['Completed',comp,'#16a34a'],['Ongoing',ong,'#2563eb'],['Total Budget',formatMK(tot),'#d97706'],['Beneficiaries',benef.toLocaleString(),'#0891b2'],['Active Monitors',localMonitors.filter(m=>m.status==='Active').length,'#7c3aed'],['Pending Feedback',localFeedback.filter(f=>f.status!=='Resolved'&&f.status!=='Rejected').length,'#dc2626'],['Announcements',localAnnouncements.filter(a=>a.published).length,'#145a32']].map(([l,v,c])=>`<div style="background:#f0fdf4;border:1px solid #d1fae5;border-radius:8px;padding:10px;"><div style="font-size:10px;color:#6b7280;">${l}</div><div style="font-size:18px;font-weight:bold;color:${c};">${v}</div></div>`).join('')}
    </div>`;
    const headers = ['ID','Project Name','Sector','Ward','Status','Progress','Budget','Beneficiaries'];
    const rows = sharedProjects.map(p => {
      const prog = p.status==='Completed'?100:p.status==='Not Started'||p.status==='Proposed'?0:p.progress;
      return [p.id,p.name,p.sector,p.ward,p.status,`${prog}%`,formatMK(p.budget),p.beneficiaries.toLocaleString()];
    });
    exportToPDF('Council Yanga - CDF Projects Report 2025/2026', headers, rows, kpiHtml);
    show('PDF opened in print preview.', 'info');
  }

  function nav(s: Section) { setSection(s); setSidebarOpen(false); }

  const filteredProjects = sharedProjects.filter(p => {
    const s = projSearch.toLowerCase();
    const matchSearch = !s || p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s);
    const matchStatus = projStatus === 'All' || p.status === projStatus;
    const matchComponent =
      projComponent === 'All Project Components' ||
      projComponent === 'All' ||
      p.component === projComponent ||
      p.initiativeComponent === projComponent;
    return matchSearch && matchStatus && matchComponent;
  });
  const filteredMonitors = localMonitors.filter(m =>
    m.name.toLowerCase().includes(monSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(monSearch.toLowerCase()) ||
    m.wards.toLowerCase().includes(monSearch.toLowerCase())
  );
  const filteredFeedback = localFeedback.filter(f => fbFilter === 'All' || f.status === fbFilter);
  const filteredAudit = auditLogs.filter(a =>
    a.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.action.toLowerCase().includes(auditSearch.toLowerCase())
  );
  const filteredVisits = visitFilter === 'All' ? visits : visits.filter(v => v.status === visitFilter);
  const filteredSubmissions = subFilter === 'All' ? submissions : submissions.filter(s => s.status === subFilter);

  function FbPill({ status }: { status: string }) {
    const bg: Record<string, string> = {
      Received: '#2563eb', 'Under Review': '#d97706',
      'Verification Requested': '#7c3aed', Resolved: '#016630', Rejected: '#dc2626',
    };
    return <span className="text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
  }

  function Sidebar() {
    return (
      <div className="flex flex-col h-full bg-[#145a32] text-white w-56">
        <div className="px-4 py-5 border-b border-white/10">
          <Logo className="h-14 brightness-0 invert flex-shrink-0" />
          <p className="text-xs text-white/60 mt-2">Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => nav(id)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${section === id ? 'bg-white/15 font-semibold' : 'hover:bg-white/10 text-white/80'}`}>
              <Icon size={16} />
              {label}
              {id === 'feedback' && unresolved > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{unresolved}</span>}
              {id === 'monitorReports' && pendingReports > 0 && <span className="ml-auto bg-amber-400 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{pendingReports}</span>}
              {id === 'schedule' && missedVisits > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{missedVisits}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10">
          <LogOut size={16} /> Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0fdf4]">
      <aside className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0"><Sidebar /></aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full w-56 flex flex-col"><Sidebar /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="bg-[#016630] lg:bg-white border-b border-[#015226] lg:border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white lg:text-gray-500 p-1 rounded-lg hover:bg-white/10 lg:hover:bg-gray-100 transition-colors"><Menu size={20} /></button>
            <h1 className="text-base font-bold text-white lg:text-gray-900 hidden sm:block" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {NAV.find(n => n.id === section)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Admin notification bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(v => !v)} className="relative p-1.5 rounded-lg hover:bg-white/10 lg:hover:bg-gray-100 text-white lg:text-gray-500 transition-colors" title="Notifications">
                <Bell size={18} />
                {adminUnread > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{adminUnread}</span>}
              </button>
              {notifOpen && (
                <>
                  {/* Mobile backdrop */}
                  <div
                    className="fixed inset-0 bg-black/25 z-40 sm:hidden"
                    onClick={() => setNotifOpen(false)}
                    onMouseDown={() => setNotifOpen(false)}
                  />
                  <div className="fixed inset-x-3.5 top-14 max-w-sm mx-auto sm:mx-0 sm:inset-x-auto sm:absolute sm:right-0 sm:top-10 sm:w-80 bg-white rounded-2xl shadow-2xl sm:shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 text-sm">Admin Notifications</span>
                      {adminUnread > 0 && (
                        <button onClick={() => setSysNotifs(prev => prev.map(n => n.for === 'admin' ? { ...n, read: true } : n))} className="text-xs text-[#145a32] font-semibold hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {adminNotifs.length === 0 && <div className="py-8 text-center text-gray-400 text-sm">No notifications</div>}
                      {adminNotifs.map(n => {
                        const icon = n.type === 'missed_visit' ? <AlertTriangle size={13} className="text-red-500" /> : n.type === 'acknowledgement' ? <CalendarCheck size={13} className="text-blue-500" /> : <Send size={13} className="text-[#145a32]" />;
                        return (
                          <div key={n.id} onClick={() => setSysNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${!n.read ? 'bg-amber-50/60' : ''}`}>
                            <div className="flex-shrink-0 mt-0.5">{icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug mb-0.5 ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{n.date}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />}
                          </div>
                        );
                      })}
                    </div>
                    {missedVisits > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button onClick={() => { nav('schedule'); setNotifOpen(false); }} className="w-full text-xs text-[#145a32] font-semibold text-center hover:underline">
                          View {missedVisits} missed visit{missedVisits > 1 ? 's' : ''} → Re-schedule
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <CircleUserRound size={28} className="text-white lg:text-[#145a32]" />
              <span className="hidden sm:inline text-sm font-medium text-white lg:text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Dashboard Overview</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h3 className="text-base font-bold text-gray-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Community Projects and Initiatives Performance Summary</h3>
                <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto min-w-0">
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap shrink-0">Project Component:</span>
                  <div className="relative flex-1 sm:flex-initial min-w-0 max-w-full">
                    <select
                      className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white text-gray-800 font-medium cursor-pointer w-full max-w-full truncate"
                      value={dashboardComponent}
                      onChange={e => setDashboardComponent(e.target.value)}
                    >
                      {['All Project Components', ...CDF_COMPONENTS].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStat label="Total Projects" value={totalProjectsCount} icon={<FolderKanban size={26} />} />
                <MiniStat label="Total Initiatives" value={totalInitiativesCount} icon={<Layers size={26} />} />
                <MiniStat label="Completed Projects" value={completed} icon={<CheckCircle2 size={26} />} />
                <MiniStat label="Ongoing Projects" value={ongoing} icon={<Activity size={26} />} />
                <MiniStat label="Total Budget" value={formatMK(totalBudget)} icon={<Wallet size={26} />} />
                <MiniStat label="Beneficiaries" value={totalBeneficiaries.toLocaleString()} icon={<Users size={26} />} />
                <MiniStat label="Sectors" value={dynamicSectorData.length} icon={<LayoutGrid size={26} />} />
                <MiniStat label="Total Funds Disbursed" value={formatMK(totalFundsDisbursed)} icon={<Banknote size={26} />} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MiniStat label="Active Monitors" value={localMonitors.filter(m => m.status === 'Active').length} icon={<UserCheck size={26} />} />
                <MiniStat label="Pending Reports" value={pendingReports} icon={<FileText size={26} />} />
                <MiniStat label="Missed Visits" value={missedVisits} icon={<CalendarX size={26} />} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Projects by Ward */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Projects by Ward</p>
                  {dynamicWardData.every(d => d.total === 0) ? (
                    <p className="text-sm text-gray-400 text-center py-10">No projects recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto pb-1 -mx-1 sm:mx-0 px-1 sm:px-0">
                      <div className="h-56 min-w-[340px] sm:min-w-[480px] w-full">
                        <ResponsiveContainer width="100%" height={224}>
                          <BarChart data={dynamicWardData} margin={{ top: 8, right: 10, left: -18, bottom: 25 }}>
                            <XAxis
                              dataKey="ward"
                              tick={{ fontSize: 10 }}
                              interval={0}
                              angle={-10}
                              textAnchor="end"
                              height={34}
                            />
                            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="ongoing" name="Ongoing" fill="#2563eb" radius={[4, 4, 0, 0]}>
                              <LabelList dataKey="ongoing" content={renderWardBarInsideLabel} />
                            </Bar>
                            <Bar dataKey="completed" name="Completed" fill="#16a34a" radius={[4, 4, 0, 0]}>
                              <LabelList dataKey="completed" content={renderWardBarInsideLabel} />
                            </Bar>
                            <Bar dataKey="notStarted" name="Not Started" fill="#9ca3af" radius={[4, 4, 0, 0]}>
                              <LabelList dataKey="notStarted" content={renderWardBarInsideLabel} />
                            </Bar>
                            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Projects by Sector */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Projects by Sector</p>
                  {dynamicSectorData.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No sector data recorded yet.</p>
                  ) : (
                    <div className="flex flex-col items-center justify-start w-full min-w-0">
                      <div className="w-full h-56 sm:h-64 relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                            <Pie
                              data={dynamicSectorData}
                              cx="50%" cy="50%"
                              innerRadius={44}
                              outerRadius={68}
                              dataKey="value"
                              nameKey="name"
                              isAnimationActive={false}
                              labelLine={false}
                              label={renderDonutCalloutLabel}
                            >
                              {dynamicSectorData.map((entry, i) => (
                                <Cell key={i} fill={SECTOR_COLORS[entry.name] ?? CHART_COLORS[i % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Center total */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              {totalSectorProjects}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full min-w-0 flex flex-row flex-nowrap justify-start items-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 overflow-x-auto px-1 py-1 scroll-smooth">
                        {dynamicSectorData.map((s, i) => (
                          <div
                            key={s.name}
                            className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap shrink-0"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: SECTOR_COLORS[s.name] ?? CHART_COLORS[i % CHART_COLORS.length] }}
                            />
                            <span
                              className="text-[11px] sm:text-xs text-gray-700 font-medium whitespace-nowrap"
                              title={s.name}
                            >
                              {s.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Beneficiaries Distribution */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Beneficiaries Distribution</p>
                      <p className="text-xs text-gray-400">Total estimated reach across target groups</p>
                    </div>
                  </div>
                  {dynamicBeneficiaryDistribution.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No beneficiaries data recorded yet.</p>
                  ) : (
                    <div className="flex flex-col items-center justify-start w-full min-w-0">
                      <div className="w-full h-56 sm:h-64 relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                            <Pie
                              data={dynamicBeneficiaryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={44}
                              outerRadius={68}
                              dataKey="value"
                              nameKey="name"
                              isAnimationActive={false}
                              labelLine={false}
                              label={renderBeneficiaryDonutCalloutLabel}
                            >
                              {dynamicBeneficiaryDistribution.map((entry, i) => (
                                <Cell
                                  key={`b-cell-${i}`}
                                  fill={BENEFICIARY_COLORS[entry.name] ?? CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              {(totalBeneficiariesInDistribution > 0 ? totalBeneficiariesInDistribution : totalBeneficiaries).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full min-w-0 flex flex-row flex-nowrap justify-start items-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 overflow-x-auto px-1 py-1 scroll-smooth">
                        {dynamicBeneficiaryDistribution.map((b) => {
                          const color = BENEFICIARY_COLORS[b.name] ?? CHART_COLORS[0];
                          return (
                            <div
                              key={b.name}
                              className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap shrink-0"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ background: color }}
                              />
                              <span
                                className="text-[11px] sm:text-xs text-gray-700 font-medium whitespace-nowrap"
                                title={b.name}
                              >
                                {b.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Funds Disbursed vs Utilised by Constituency */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Funds Disbursed vs Utilised by Constituency</p>
                      <p className="text-xs text-gray-400">Comparison of funds disbursed against funds utilised within each constituency</p>
                    </div>
                  </div>
                  {constituencyFundsData.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10">No financial data available.</p>
                  ) : (
                    <div className="w-full">
                      <div className="flex justify-center">
                        <div className="h-56 w-full max-w-[540px]">
                          <ResponsiveContainer width="100%" height={224}>
                            <BarChart
                              data={constituencyFundsData}
                              margin={{ top: 22, right: 10, left: -14, bottom: 18 }}
                              barGap={6}
                              barCategoryGap="12%"
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis
                                dataKey="constituencyShort"
                                tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
                                interval={0}
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                tickFormatter={v => v === 0 ? '0' : v >= 1000000 ? `${Math.round(v / 1000000)}M` : `${Math.round(v / 1000)}k`}
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickLine={false}
                              />
                              <Tooltip content={<ConstituencyFundsTooltip />} />
                              <Bar
                                dataKey="disbursed"
                                name="Amount Disbursed"
                                fill="#2563eb"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={44}
                              >
                                <LabelList
                                  dataKey="disbursed"
                                  content={(props: any) => renderFundsBarTopLabel(props, '#1d4ed8')}
                                />
                              </Bar>
                              <Bar
                                dataKey="utilised"
                                name="Amount Utilised"
                                fill="#016630"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={44}
                              >
                                <LabelList
                                  dataKey="utilised"
                                  content={(props: any) => renderFundsBarTopLabel(props, '#016630')}
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Legend below the graph */}
                      <div className="flex items-center justify-center gap-6 mt-3 pt-2.5 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#2563eb] inline-block" />
                          <span>Amount Disbursed</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#016630] inline-block" />
                          <span>Amount Utilised</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Monitor Activity Trend (commented out)
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Monitor Activity Trend</p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={activityData} margin={{ left: -20 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="updates" stroke="#145a32" strokeWidth={2} dot={false} name="Updates" />
                      <Line type="monotone" dataKey="visits" stroke="#00cc00" strokeWidth={2} dot={false} name="Site Visits" />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              */}
              {/* Completed projects list */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Completed Projects</p>
                {sharedProjects.filter(p => p.status === 'Completed').length === 0
                  ? <p className="text-sm text-gray-400">No completed projects yet.</p>
                  : <div className="space-y-2">{sharedProjects.filter(p => p.status === 'Completed').map(p => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                      <CheckIcon size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.id} / {p.ward} / {p.actualCompletion || 'Completion date not set'}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}</div>
                }
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {section === 'projects' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Projects & Initiatives</h2>
                  <p className="text-sm text-gray-500">{totalProjectsCount} projects / {totalInitiativesCount} initiatives / {completed} completed / {ongoing} ongoing</p>
                </div>
                <button onClick={() => setModal({ kind: 'new-project' })} className="flex items-center gap-2 bg-[#145a32] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0f4424] self-start sm:self-auto">
                  <Plus size={16} /> New Project/Initiative
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1 min-w-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder="Search by name or ID..." value={projSearch} onChange={e => setProjSearch(e.target.value)} />
                </div>
                <div className="relative w-full sm:w-auto min-w-0 max-w-full">
                  <select
                    className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white text-gray-800 font-medium cursor-pointer w-full max-w-full truncate"
                    value={projComponent}
                    onChange={e => setProjComponent(e.target.value)}
                  >
                    {['All Project Components', ...CDF_COMPONENTS].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative w-full sm:w-auto min-w-0 max-w-full">
                  <select className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white text-gray-800 font-medium cursor-pointer w-full max-w-full truncate" value={projStatus} onChange={e => setProjStatus(e.target.value)}>
                    {['All','Ongoing','Completed','Not Started','Near Completion','Approved','Assessed','Proposed','Suspended'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-max w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                    {['ID','Project Name','Sector','Ward','Status','Progress','Budget','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredProjects.map(p => {
                      const prog = p.status==='Completed'?100:p.status==='Not Started'||p.status==='Proposed'||p.status==='Assessed'?0:p.status==='Near Completion'?Math.max(p.progress,80):p.progress;
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{p.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{p.sector}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{p.ward}</td>
                          <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                          <td className="px-4 py-3 w-36"><div className="flex items-center gap-1.5"><ProgressBar value={prog} /><span className="text-xs text-gray-500 whitespace-nowrap">{prog}%</span></div></td>
                          <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{formatMK(p.budget)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setModal({ kind: 'view-project', project: p })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14} /></button>
                              <button onClick={() => setModal({ kind: 'edit-project', project: p })} className="p-1.5 text-gray-400 hover:text-[#145a32] hover:bg-green-50 rounded-lg"><Edit2 size={14} /></button>
                              <button onClick={() => deleteProject(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
                {filteredProjects.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No projects match your filters.</div>}
              </div>
              <div className="md:hidden space-y-3">
                {filteredProjects.map(p => {
                  const prog = p.status==='Completed'?100:p.status==='Not Started'||p.status==='Proposed'||p.status==='Assessed'?0:p.progress;
                  return (
                    <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-400 font-mono">{p.id} / {p.sector}</p></div>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="flex items-center gap-1.5 mb-2"><ProgressBar value={prog} /><span className="text-xs text-gray-500">{prog}%</span></div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">{formatMK(p.budget)}</span>
                        <div className="flex gap-3">
                          <button onClick={() => setModal({ kind: 'edit-project', project: p })} className="text-xs text-[#145a32] font-semibold">Edit</button>
                          <button onClick={() => deleteProject(p.id)} className="text-xs text-red-500 font-semibold">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WARD STATUS PHOTOS */}
          {section === 'wardPhotos' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-5 space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Update Projects Status
                  </h2>
                  {wardStatusSubTab === 'photos' && (
                    <button
                      onClick={() => setModal({ kind: 'upload-ward-photo' })}
                      className="flex items-center gap-1.5 sm:gap-2 bg-[#145a32] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#0f4424] shrink-0 whitespace-nowrap cursor-pointer shadow-xs transition-colors active:scale-[0.99]"
                    >
                      <Plus size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Upload Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Update progress percentages of projects or initiatives in wards after receiving and approving reports from monitors of that ward, or manage ward tracking status photos.
                </p>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-2 border-b border-gray-200 mb-5 overflow-x-auto no-scrollbar scrollbar-none pb-1">
                <button
                  type="button"
                  onClick={() => setWardStatusSubTab('progress')}
                  className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    wardStatusSubTab === 'progress'
                      ? 'border-[#145a32] text-[#145a32]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <SlidersHorizontal size={15} className="shrink-0" />
                  <span className="whitespace-nowrap">Ward Projects & Initiatives Progress</span>
                  <span
                    className="text-[11px] px-2 py-0.5 text-white font-bold whitespace-nowrap shrink-0"
                    style={{ borderRadius: '0.2rem', backgroundColor: '#145a32' }}
                  >
                    {sharedProjects.filter(p => submissions.some(s => s.status === 'Approved' && (s.projectId === p.id || s.projectName.toLowerCase() === p.name.toLowerCase() || (p.ward && s.ward === p.ward)))).length} Verified
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setWardStatusSubTab('photos')}
                  className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    wardStatusSubTab === 'photos'
                      ? 'border-[#145a32] text-[#145a32]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Camera size={15} className="shrink-0" />
                  <span className="whitespace-nowrap">Ward Status Photos & Gallery</span>
                  <span
                    className="text-[11px] px-2 py-0.5 text-white font-bold whitespace-nowrap shrink-0"
                    style={{ borderRadius: '0.2rem', backgroundColor: '#145a32' }}
                  >
                    {localWardPhotos.length} Photos
                  </span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Search */}
                  <div className="relative lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search photo, project, caption..."
                      value={wardPhotoSearch}
                      onChange={e => setWardPhotoSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#145a32]"
                    />
                  </div>

                  {/* Constituency */}
                  <div>
                    <select
                      value={wardPhotoConstituency}
                      onChange={e => {
                        setWardPhotoConstituency(e.target.value);
                        setWardPhotoWard('All');
                      }}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white"
                    >
                      <option value="All">All Constituencies</option>
                      {wardPhotoConstituencyOptions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ward */}
                  <div>
                    <select
                      value={wardPhotoWard}
                      onChange={e => setWardPhotoWard(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white"
                    >
                      <option value="All">All Wards</option>
                      {wardPhotoWardOptions.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <select
                      value={wardPhotoCategory}
                      onChange={e => setWardPhotoCategory(e.target.value as 'All' | 'Project' | 'Initiative')}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white"
                    >
                      <option value="All">All Categories</option>
                      <option value="Project">Project</option>
                      <option value="Initiative">Initiative</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={wardPhotoStatus}
                      onChange={e => setWardPhotoStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white"
                    >
                      <option value="All">All Tracking Statuses</option>
                      <option value="Proposed">Proposed</option>
                      <option value="Assessed">Assessed</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Near Completion">Near Completion</option>
                      <option value="Completed">Completed</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Quick Status Pill Filters & Reset */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-gray-500 mr-1">Quick Status:</span>
                    {['All', 'Proposed', 'Assessed', 'Ongoing', 'Near Completion', 'Completed'].map(st => (
                      <button
                        key={st}
                        onClick={() => setWardPhotoStatus(st)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                          wardPhotoStatus === st
                            ? 'bg-[#145a32] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {(wardPhotoSearch || wardPhotoConstituency !== 'All' || wardPhotoWard !== 'All' || wardPhotoCategory !== 'All' || wardPhotoStatus !== 'All') && (
                    <button
                      onClick={() => {
                        setWardPhotoSearch('');
                        setWardPhotoConstituency('All');
                        setWardPhotoWard('All');
                        setWardPhotoCategory('All');
                        setWardPhotoStatus('All');
                      }}
                      className="text-xs text-[#145a32] font-semibold hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION: WARD PROJECTS & INITIATIVES PROGRESS TRACKER */}
              {wardStatusSubTab === 'progress' && (
                <div className="space-y-4">
                  {/* Info Banner */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Ward Field Progress Management</h3>
                      <p className="text-xs text-gray-500">
                        Progress percentages can be updated after receiving and approving verified inspection reports from a monitor of that ward.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-nowrap shrink-0 overflow-x-auto">
                      <span className="px-2.5 py-1 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 shadow-2xs flex items-center gap-1.5 whitespace-nowrap shrink-0">
                        <CheckCircle size={13} className="text-[#145a32] shrink-0" />
                        Approved Reports: {submissions.filter(s => s.status === 'Approved').length}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 shadow-2xs flex items-center gap-1.5 whitespace-nowrap shrink-0">
                        <Clock size={13} className="text-gray-400 shrink-0" />
                        Pending Review: {submissions.filter(s => s.status === 'Pending Review').length}
                      </span>
                    </div>
                  </div>

                  {/* Project Cards Grid */}
                  {(() => {
                    const projectsToDisplay = sharedProjects.filter(item => {
                      const matchSearch = !wardPhotoSearch ||
                        item.name?.toLowerCase().includes(wardPhotoSearch.toLowerCase()) ||
                        item.id?.toLowerCase().includes(wardPhotoSearch.toLowerCase()) ||
                        item.ward?.toLowerCase().includes(wardPhotoSearch.toLowerCase()) ||
                        item.sector?.toLowerCase().includes(wardPhotoSearch.toLowerCase());
                      const matchConstituency = wardPhotoConstituency === 'All' ||
                        item.constituency?.toLowerCase() === wardPhotoConstituency.toLowerCase() ||
                        (wardPhotoConstituency === 'Likoma Island' && (item.constituency === 'Chizumulu Island' || item.constituency === 'Likoma Island'));
                      const matchWard = wardPhotoWard === 'All' ||
                        item.ward?.toLowerCase() === wardPhotoWard.toLowerCase() ||
                        (item.ward && wardPhotoWard && (
                          item.ward.toLowerCase().includes(wardPhotoWard.toLowerCase().replace(/\s*ward/i, '')) ||
                          wardPhotoWard.toLowerCase().includes(item.ward.toLowerCase().replace(/\s*ward/i, ''))
                        ));
                      const matchCategory = wardPhotoCategory === 'All' ||
                        (wardPhotoCategory === 'Initiative' ? isInitiative(item) : !isInitiative(item));
                      const matchStatus = wardPhotoStatus === 'All' ||
                        item.status?.toLowerCase() === wardPhotoStatus.toLowerCase();
                      return matchSearch && matchConstituency && matchWard && matchCategory && matchStatus;
                    });

                    if (projectsToDisplay.length === 0) {
                      return (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 text-sm">
                          <AlertCircle size={28} className="mx-auto text-gray-400 mb-2" />
                          <p className="font-semibold text-gray-700">No projects or initiatives match the selected criteria.</p>
                          <p className="text-xs text-gray-400 mt-1">Try resetting your search query or filters above.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectsToDisplay.map(p => {
                          const isInit = isInitiative(p);
                          const projSubs = submissions.filter(s =>
                            s.projectId === p.id ||
                            s.projectName.toLowerCase() === p.name.toLowerCase() ||
                            (p.ward && s.ward === p.ward)
                          );
                          const approvedSub = projSubs.find(s => s.status === 'Approved');
                          const pendingSub = projSubs.find(s => s.status === 'Pending Review');
                          const hasApprovedReport = !!approvedSub;
                          const curProg = editingWardProgress[p.id] ?? p.progress;

                          return (
                            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between gap-3 transition-all hover:shadow-md">
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isInit ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {isInit ? 'Initiative' : 'Project'}
                                    </span>
                                    <span className="text-[11px] font-semibold text-gray-500">{p.id}</span>
                                    <span className="text-[11px] text-gray-400">{p.sector}</span>
                                  </div>
                                  <StatusBadge status={p.status} />
                                </div>

                                <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1">{p.name}</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 flex-wrap">
                                  <MapPin size={12} className="text-gray-400 shrink-0" />
                                  <span>{p.ward} ({p.constituency})</span>
                                  <span>Monitor: <strong className="text-gray-700">{p.monitor || 'Unassigned'}</strong></span>
                                </p>

                                {/* Current Progress Bar */}
                                <div className="space-y-1 mb-3">
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-gray-600">Current Progress</span>
                                    <span className="text-[#145a32]">{p.progress}%</span>
                                  </div>
                                  <ProgressBar value={p.progress} />
                                </div>

                                {/* Report & Progress Control Section */}
                                {hasApprovedReport ? (
                                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2.5">
                                    <div className="flex items-center justify-between gap-1 flex-wrap text-gray-700">
                                      <span className="font-semibold flex items-center gap-1 text-gray-700">
                                        <CheckCircle size={14} className="text-[#145a32]" />
                                        Approved Report
                                      </span>
                                      <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        {approvedSub.progress}% reported by {approvedSub.monitorName}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 italic bg-white p-2 rounded-lg border border-gray-200">
                                      "{approvedSub.observation}"
                                    </p>

                                    {/* Interactive Progress Adjustment */}
                                    <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                                        <span>Adjust Progress Percentage:</span>
                                        <span className="text-gray-700 font-bold text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{curProg}%</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="range"
                                          min={0}
                                          max={100}
                                          value={curProg}
                                          onChange={e => setEditingWardProgress(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                                          className="flex-1 accent-[#145a32] cursor-pointer"
                                        />
                                        <input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={curProg}
                                          onChange={e => setEditingWardProgress(prev => ({ ...prev, [p.id]: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                                          className="w-16 px-2 py-1 text-xs border border-gray-200 rounded text-center font-bold text-gray-700"
                                        />
                                      </div>
                                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 pt-1">
                                        <div className="flex items-center gap-1 flex-wrap justify-center xl:justify-start">
                                          <span className="text-[10px] text-gray-500">Quick set:</span>
                                          <button
                                            type="button"
                                            onClick={() => setEditingWardProgress(prev => ({ ...prev, [p.id]: approvedSub.progress }))}
                                            className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium cursor-pointer transition-colors"
                                          >
                                            Reported ({approvedSub.progress}%)
                                          </button>
                                          {[25, 50, 75, 100].map(val => (
                                            <button
                                              key={val}
                                              type="button"
                                              onClick={() => setEditingWardProgress(prev => ({ ...prev, [p.id]: val }))}
                                              className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors"
                                            >
                                              {val}%
                                            </button>
                                          ))}
                                        </div>
                                        <div className="flex justify-center xl:justify-end w-full xl:w-auto">
                                          <button
                                            type="button"
                                            onClick={() => saveWardProjectProgress(p, curProg, approvedSub)}
                                            className="px-3.5 py-1.5 bg-[#145a32] hover:bg-[#0f4424] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                                          >
                                            <Save size={13} className="text-white" />
                                            <span className="text-white">Save Progress</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : pendingSub ? (
                                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
                                    <div className="flex items-center justify-between gap-1 flex-wrap text-gray-700">
                                      <span className="font-semibold flex items-center gap-1">
                                        <Clock size={14} className="text-[#145a32]" />
                                        Pending Monitor Report
                                      </span>
                                      <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        {pendingSub.progress}% reported
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500">
                                      Submitted by monitor <strong className="text-gray-700">{pendingSub.monitorName}</strong> on {pendingSub.date}. Review and approve this report to confirm and apply the progress percentage.
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => setModal({ kind: 'review-submission', submission: pendingSub, action: 'approve' })}
                                      className="w-full py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                      <CheckCircle size={13} className="text-[#145a32]" />
                                      <span>Review & Approve Report ({pendingSub.progress}%)</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
                                    <div className="flex items-center justify-between gap-1 flex-wrap text-gray-700">
                                      <span className="font-semibold flex items-center gap-1">
                                        <AlertCircle size={14} className="text-gray-400" />
                                        Awaiting Ward Monitor Field Report
                                      </span>
                                      <span className="text-[11px] text-gray-500">{p.ward}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500">
                                      Progress percentage can be modified after receiving and approving a field verification report from the monitor of this ward.
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setModal({
                                          kind: 'schedule-visit',
                                        });
                                      }}
                                      className="w-full py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                      <CalendarCheck size={13} className="text-[#145a32]" />
                                      <span>Schedule Ward Field Inspection</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Photo Cards Carousel */}
              {wardStatusSubTab === 'photos' && (() => {
                const photosToDisplay = localWardPhotos.filter(item => {
                  const matchSearch = !wardPhotoSearch ||
                    item.caption?.toLowerCase().includes(wardPhotoSearch.toLowerCase()) ||
                    item.projectName?.toLowerCase().includes(wardPhotoSearch.toLowerCase()) ||
                    item.ward?.toLowerCase().includes(wardPhotoSearch.toLowerCase());
                  const matchConstituency = wardPhotoConstituency === 'All' ||
                    item.constituency?.toLowerCase() === wardPhotoConstituency.toLowerCase() ||
                    (wardPhotoConstituency === 'Likoma Island' && (item.constituency === 'Chizumulu Island' || item.constituency === 'Likoma Island'));
                  const matchWard = wardPhotoWard === 'All' ||
                    item.ward?.toLowerCase() === wardPhotoWard.toLowerCase() ||
                    (item.ward && wardPhotoWard && (
                      item.ward.toLowerCase().includes(wardPhotoWard.toLowerCase().replace(/\s*ward/i, '')) ||
                      wardPhotoWard.toLowerCase().includes(item.ward.toLowerCase().replace(/\s*ward/i, ''))
                    ));
                  const matchCategory = wardPhotoCategory === 'All' || item.category === wardPhotoCategory;
                  const matchStatus = wardPhotoStatus === 'All' || item.status === wardPhotoStatus;
                  return matchSearch && matchConstituency && matchWard && matchCategory && matchStatus;
                });

                if (photosToDisplay.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
                      <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#145a32] flex items-center justify-center mx-auto mb-3">
                        <ImageIcon size={28} />
                      </div>
                      <h3 className="text-base font-bold text-gray-800 mb-1">No Status Photos Found</h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                        No tracking status photos match your active search or filters. Try adjusting your filters or upload a new photo.
                      </p>
                      <button
                        onClick={() => setModal({
                          kind: 'upload-ward-photo',
                          defaultWard: wardPhotoWard !== 'All' ? wardPhotoWard : undefined,
                          defaultStatus: wardPhotoStatus !== 'All' ? wardPhotoStatus : undefined,
                          defaultCategory: wardPhotoCategory !== 'All' ? wardPhotoCategory : undefined,
                        })}
                        className="inline-flex items-center gap-2 bg-[#145a32] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#0f4424] cursor-pointer"
                      >
                        <Plus size={15} /> Upload Photo
                      </button>
                    </div>
                  );
                }

                // Desktop: 2 slides in a row; Mobile/Tablet: 1 slide in a row centered
                const desktopSlides: WardStatusPhoto[][] = [];
                for (let i = 0; i < photosToDisplay.length; i += 2) {
                  desktopSlides.push(photosToDisplay.slice(i, i + 2));
                }
                const mobileSlides: WardStatusPhoto[][] = photosToDisplay.map(p => [p]);

                const prevSlide = () => {
                  setWardPhotoDesktopSlide(s => (s - 1 + desktopSlides.length) % (desktopSlides.length || 1));
                  setWardPhotoMobileSlide(s => (s - 1 + mobileSlides.length) % (mobileSlides.length || 1));
                };

                const nextSlide = () => {
                  setWardPhotoDesktopSlide(s => (s + 1) % (desktopSlides.length || 1));
                  setWardPhotoMobileSlide(s => (s + 1) % (mobileSlides.length || 1));
                };

                const renderPhotoCard = (photo: WardStatusPhoto) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
                  >
                    {/* Photo with Overlay Badges */}
                    <div className="relative h-52 bg-gray-100 overflow-hidden group">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('photo-1590486803833')) {
                            target.src = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80';
                          }
                        }}
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none">
                        <StatusBadge status={photo.status} />
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 bg-black/60 text-white backdrop-blur-xs shadow-xs"
                          style={{ borderRadius: '0.2rem' }}
                        >
                          {photo.ward}
                        </span>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setModal({ kind: 'view-ward-photo', photo })}
                          className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow hover:bg-gray-100 cursor-pointer flex items-center gap-1.5"
                        >
                          <Maximize2 size={13} /> View Full
                        </button>
                        <button
                          onClick={() => setModal({ kind: 'upload-ward-photo', initialPhoto: photo })}
                          className="px-3 py-1.5 bg-[#145a32] text-white text-xs font-semibold rounded-lg shadow hover:bg-[#0f4424] cursor-pointer flex items-center justify-center"
                        >
                          Change Picture
                        </button>
                      </div>
                    </div>

                    {/* Card Body - monitor name removed */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <CategoryBadge category={photo.category} className="text-[10px] px-2 py-0.5" />
                          {photo.projectName && (
                            <span className="text-[10px] font-medium text-gray-500 truncate max-w-[200px]" title={photo.projectName}>
                              {photo.projectName}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mb-2" title={photo.caption}>
                          {photo.caption}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100 mb-3">
                          <span className="font-medium text-gray-700">{photo.ward}</span>
                          <span className="flex-shrink-0 text-gray-400">{photo.date}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setModal({ kind: 'upload-ward-photo', initialPhoto: photo })}
                            className="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-[#145a32] hover:bg-[#0f4424] py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                          >
                            Change Picture
                          </button>
                          <button
                            onClick={() => setModal({ kind: 'upload-ward-photo', initialPhoto: photo })}
                            className="text-xs text-gray-500 hover:text-gray-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => deleteWardStatusPhoto(photo.id)}
                            className="text-xs text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                const currentDesktopIndex = Math.min(wardPhotoDesktopSlide, Math.max(0, desktopSlides.length - 1));
                const currentMobileIndex = Math.min(wardPhotoMobileSlide, Math.max(0, mobileSlides.length - 1));

                return (
                  <div className="space-y-4">
                    {/* Carousel Header Controls & Counter */}
                    <div className="flex items-center justify-between px-1">
                      <div className="text-xs font-medium text-gray-500">
                        <span className="hidden lg:inline">
                          Showing slide {desktopSlides.length > 0 ? currentDesktopIndex + 1 : 0} of {desktopSlides.length}
                        </span>
                        <span className="lg:hidden">
                          Showing slide {mobileSlides.length > 0 ? currentMobileIndex + 1 : 0} of {mobileSlides.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={prevSlide}
                          disabled={photosToDisplay.length <= 1}
                          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                          aria-label="Previous slide"
                          title="Previous slide"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={nextSlide}
                          disabled={photosToDisplay.length <= 1}
                          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                          aria-label="Next slide"
                          title="Next slide"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop view: two slides in a row */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-5 items-stretch">
                      {desktopSlides[currentDesktopIndex]?.map(renderPhotoCard)}
                      {(desktopSlides[currentDesktopIndex]?.length ?? 0) === 1 && <div className="invisible" />}
                    </div>

                    {/* Mobile and tablet view: a single slide in a row while on center */}
                    <div className="lg:hidden flex justify-center w-full">
                      <div className="w-full max-w-md mx-auto">
                        {mobileSlides[currentMobileIndex]?.map(renderPhotoCard)}
                      </div>
                    </div>

                    {/* Carousel navigation indicators */}
                    {photosToDisplay.length > 1 && (
                      <div className="flex justify-center items-center gap-1.5 pt-2">
                        {/* Desktop indicators */}
                        <div className="hidden lg:flex items-center gap-1.5">
                          {desktopSlides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setWardPhotoDesktopSlide(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                currentDesktopIndex === i ? 'w-6 bg-[#145a32]' : 'w-2 bg-gray-200 hover:bg-gray-300'
                              }`}
                              aria-label={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                        {/* Mobile and tablet indicators */}
                        <div className="lg:hidden flex items-center gap-1.5 flex-wrap max-w-xs justify-center">
                          {mobileSlides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setWardPhotoMobileSlide(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                currentMobileIndex === i ? 'w-5 bg-[#145a32]' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                              }`}
                              aria-label={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* MONITORS */}
          {section === 'monitors' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Field Monitors</h2>
                  <p className="text-sm text-gray-500">{localMonitors.filter(m => m.status === 'Active').length} active monitors</p>
                </div>
                <button onClick={() => setModal({ kind: 'add-monitor' })} className="flex items-center gap-2 bg-[#145a32] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0f4424] self-start sm:self-auto">
                  <Plus size={16} /> Add Monitor
                </button>
              </div>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder="Search monitors..." value={monSearch} onChange={e => setMonSearch(e.target.value)} />
              </div>
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                    {['Monitor','Contact','Wards','Projects','Reports','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredMonitors.map(m => (
                      <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {(() => { const mu = users.find(u => u.monitorId === m.id); return mu?.photoUrl ? (
                              <img src={mu.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <Contact size={14} className="text-gray-400" />
                              </div>
                            ); })()}
                            <div><p className="font-semibold text-gray-900">{m.name}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><p className="text-xs text-gray-600">{m.email}</p><p className="text-xs text-gray-400">{m.phone}</p></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{m.wards}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">{m.assignedProjects}</td>
                        <td className="px-4 py-3 text-xs text-gray-600"><span className="text-green-600 font-semibold">{m.approved}</span> / {m.submitted}</td>
                        <td className="px-4 py-3"><span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: m.status === 'Active' ? '#016630' : '#dc2626', borderRadius: '0.2rem' }}>{m.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setModal({ kind: 'edit-monitor', monitor: m })} className="p-1.5 text-gray-400 hover:text-[#145a32] hover:bg-green-50 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={() => toggleMonitorStatus(m)} className={`p-1.5 rounded-lg ${m.status === 'Active' ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>
                              {m.status === 'Active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                            </button>
                            <button onClick={() => { setSection('schedule'); setVisitFilter('All'); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Schedule visit"><Calendar size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-3">
                {filteredMonitors.map(m => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {(() => { const mu = users.find(u => u.monitorId === m.id); return mu?.photoUrl ? (
                          <img src={mu.photoUrl} alt={m.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <Contact size={16} className="text-gray-400" />
                          </div>
                        ); })()}
                        <div><p className="font-semibold text-gray-900 text-sm">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: m.status === 'Active' ? '#016630' : '#dc2626', borderRadius: '0.2rem' }}>{m.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{m.wards}</p>
                    <div className="flex gap-3">
                      <button onClick={() => setModal({ kind: 'edit-monitor', monitor: m })} className="text-xs text-[#145a32] font-semibold">Edit</button>
                      <button onClick={() => toggleMonitorStatus(m)} className={`text-xs font-semibold ${m.status === 'Active' ? 'text-red-500' : 'text-green-600'}`}>{m.status === 'Active' ? 'Deactivate' : 'Reactivate'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULE VISITS */}
          {section === 'schedule' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Schedule Monitor Visits</h2>
                  <p className="text-sm text-gray-500">{visits.length} total / {visits.filter(v=>v.status==='Upcoming').length} upcoming / {missedVisits} missed</p>
                </div>
                <button onClick={() => setModal({ kind: 'schedule-visit' })} className="flex items-center gap-2 bg-[#145a32] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0f4424] self-start sm:self-auto">
                  <Plus size={16} /> Schedule Visit
                </button>
              </div>

              {missedVisits > 0 && (
                <div className="bg-white border border-red-500 rounded-2xl p-4 flex items-start gap-3 mb-4">
                  <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-600">{missedVisits} Missed Visit{missedVisits > 1 ? 's' : ''}</p>
                    <p className="text-xs text-red-600 mt-0.5">These monitors did not complete their scheduled visits. Use the Re-schedule button to set a new date and notify them.</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {['All','Upcoming','Acknowledged','Completed','Missed','Rescheduled'].map(f => (
                  <button key={f} onClick={() => setVisitFilter(f)} style={{ borderRadius: '0.2rem' }} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${visitFilter===f ? 'bg-[#145a32] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>
                ))}
              </div>

              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-x-auto">
                <table className="min-w-max w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                    {['Visit ID','Monitor','Project','Ward','Date','Time','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredVisits.map(v => (
                      <tr key={v.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${v.status==='Missed' ? 'bg-red-50/40' : ''}`}>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{v.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm whitespace-nowrap">{v.monitorName}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{v.projectName}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{v.ward}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{v.date}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{v.time}</td>
                        <td className="px-4 py-3 whitespace-nowrap"><VisitStatusPill status={v.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {v.status === 'Missed' && (
                              <button onClick={() => setModal({ kind: 'reschedule-visit', visit: v })} className="flex items-center gap-1 text-xs bg-amber-500 text-white px-2 py-1 rounded-lg font-semibold hover:bg-amber-600 whitespace-nowrap">
                                <RefreshCw size={11} /> Re-schedule
                              </button>
                            )}
                            {v.acknowledgedAt && <span className="text-[10px] text-gray-400 whitespace-nowrap">Ack: {v.acknowledgedAt.slice(0,10)}</span>}
                            {v.rescheduledFrom && <span className="text-[10px] text-purple-500 whitespace-nowrap">Was: {v.rescheduledFrom}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredVisits.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No visits match this filter.</div>}
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredVisits.map(v => (
                  <div key={v.id} className={`bg-white rounded-xl border p-4 ${v.status==='Missed' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{v.projectName}</p>
                        <p className="text-xs text-gray-500">{v.monitorName} / {v.id}</p>
                      </div>
                      <VisitStatusPill status={v.status} />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{v.date} at {v.time} / {v.ward}</p>
                    {v.notes && <p className="text-xs text-gray-600 mb-2 leading-relaxed">{v.notes}</p>}
                    {v.status === 'Missed' && (
                      <button onClick={() => setModal({ kind: 'reschedule-visit', visit: v })} className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600">
                        <RefreshCw size={11} /> Re-schedule Visit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MONITOR REPORTS */}
          {section === 'monitorReports' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Monitor Field Reports</h2>
                <p className="text-sm text-gray-500">{pendingReports} pending review / {submissions.length} total submissions</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['All','Pending Review','Approved','Returned'].map(f => (
                  <button key={f} onClick={() => setSubFilter(f)} style={{ borderRadius: '0.2rem' }} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${subFilter===f ? 'bg-[#145a32] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                    {f}
                    {f==='Pending Review' && pendingReports > 0 ? ` (${pendingReports})` : ''}
                    {f==='Approved' && approvedReports > 0 ? ` (${approvedReports})` : ''}
                    {f==='Returned' && returnedReports > 0 ? ` (${returnedReports})` : ''}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredSubmissions.map(s => (
                  <div key={s.id} className={`bg-white rounded-2xl border p-5 ${s.status==='Pending Review' ? 'border-amber-200' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{s.projectName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.monitorName} / {s.id} / {s.date}</p>
                      </div>
                      <SubStatusPill status={s.status} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {[
                        ['Progress', `${s.progress}%`],
                        ['Photos', `${s.photos?.length ?? s.photoCount} attached`],
                        ['GPS', s.gpsLat ? `${s.gpsLat}, ${s.gpsLng}` : 'Not captured'],
                        ['Milestone', s.milestone || '—'],
                      ].map(([l, v]) => (
                        <div key={l} className="bg-gray-50 rounded-xl p-2">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">{l}</p>
                          <p className="text-xs text-gray-800 font-medium mt-0.5 truncate">{v}</p>
                        </div>
                      ))}
                    </div>
                    {/* Photo thumbnails */}
                    {s.photos && s.photos.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Site Photos ({s.photos.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {s.photos.map((photo, idx) => (
                            <button key={idx} onClick={() => setPhotoLightbox(photo)} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-90 transition-opacity border border-gray-200">
                              <img src={photo} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {s.progress === 100 && s.status !== 'Approved' && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 mb-3">
                        <p className="text-xs font-semibold text-green-700">100% progress reported - approving this will auto-mark the project as Completed.</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.observation}</p>
                    {/* Admin Note - editable */}
                    {(s.adminNote || s.status !== 'Pending Review') && editNoteId === s.id ? (
                      <div className={`rounded-xl p-3 mb-3 border ${s.status==='Returned' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <p className={`text-xs font-semibold mb-2 ${s.status==='Returned' ? 'text-red-700' : 'text-green-700'}`}>Edit Admin Note:</p>
                        <textarea
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#145a32] bg-white"
                          value={editNoteText}
                          onChange={e => setEditNoteText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveEditedNote(s.id)} className="text-xs bg-[#145a32] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#0f4424]">Save Note</button>
                          <button onClick={() => { setEditNoteId(null); setEditNoteText(''); }} className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    ) : s.adminNote ? (
                      <div className={`rounded-xl p-3 mb-3 ${s.status==='Returned' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold mb-1 ${s.status==='Returned' ? 'text-red-700' : 'text-green-700'}`}>
                            Admin Note {s.reviewedAt ? `— ${s.reviewedAt}` : ''}:
                          </p>
                          <button onClick={() => { setEditNoteId(s.id); setEditNoteText(s.adminNote); }} className="text-[10px] text-gray-500 hover:text-[#145a32] flex items-center gap-0.5 flex-shrink-0">
                            <Edit2 size={10} /> Edit
                          </button>
                        </div>
                        <p className={`text-xs ${s.status==='Returned' ? 'text-red-800' : 'text-green-800'}`}>{s.adminNote}</p>
                      </div>
                    ) : null}
                    <div className="flex gap-2 flex-wrap">
                      {s.status === 'Pending Review' && (
                        <>
                          <button onClick={() => setModal({ kind: 'review-submission', submission: s, action: 'approve' })} className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700">
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => setModal({ kind: 'review-submission', submission: s, action: 'return' })} className="flex items-center gap-1.5 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600">
                            <RefreshCw size={12} /> Return for Correction
                          </button>
                        </>
                      )}
                      {s.status !== 'Pending Review' && !s.adminNote && (
                        <button onClick={() => { setEditNoteId(s.id); setEditNoteText(''); }} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                          <Edit2 size={12} /> Add Note
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredSubmissions.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No submissions match this filter.</div>}
              </div>
            </div>
          )}

          {/* FEEDBACK */}
          {section === 'feedback' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Citizen Feedback</h2>
                <p className="text-sm text-gray-500">{unresolved} pending / {localFeedback.length} total</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['All','Received','Under Review','Verification Requested','Resolved'].map(f => (
                  <button key={f} onClick={() => setFbFilter(f)} style={{ borderRadius: '0.2rem' }} className={`px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${fbFilter===f ? 'bg-[#145a32] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f}</button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredFeedback.map(f => (
                  <div key={f.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0"><p className="font-semibold text-gray-900 text-sm">{f.type}</p><p className="text-xs text-gray-500 truncate">{f.id} / {f.project} / {f.date}</p></div>
                      <div className="flex-shrink-0"><FbPill status={f.status} /></div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{f.message}</p>
                    {f.response && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">
                        <p className="text-xs font-semibold text-green-700 mb-1">Council Response:</p>
                        <p className="text-xs text-green-800">{f.response}</p>
                      </div>
                    )}
                    {f.status !== 'Resolved' && f.status !== 'Rejected' && (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => resolveFb(f.id)} className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.25"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Mark Resolved
                        </button>
                        {f.status !== 'Under Review' && (
                          <button onClick={() => reviewFb(f.id)} className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600">
                            <RefreshCw size={12} /> Under Review
                          </button>
                        )}
                        {f.status !== 'Verification Requested' && (
                          <button onClick={() => verifyFb(f.id)} className="flex items-center gap-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-700">
                            <AlertCircle size={12} /> Request Verification
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {filteredFeedback.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No feedback items match the filter.</div>}
              </div>
            </div>
          )}

          {/* REPORTS */}
          {section === 'reports' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Reports</h2>
                  <p className="text-sm text-gray-500">CDF Project Summary - 2025/2026</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={doPDF} className="flex items-center gap-1.5 text-xs bg-red-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-red-700"><FileText size={13} /> Export PDF</button>
                  <button onClick={doExcel} className="flex items-center gap-1.5 text-xs bg-green-700 text-white px-3 py-2 rounded-xl font-semibold hover:bg-green-800"><Download size={13} /> Export Excel</button>
                  <button onClick={doCSV} className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-blue-700"><Download size={13} /> Export CSV</button>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-base font-bold text-gray-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Project Portfolio Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <MiniStat label="Total Projects" value={sharedProjects.length} icon={<FolderKanban size={24} />} />
                <MiniStat label="Completed" value={completed} icon={<CheckCircle2 size={24} />} />
                <MiniStat label="Total Budget" value={formatMK(totalBudget)} icon={<Wallet size={24} />} />
                <MiniStat label="Beneficiaries" value={totalBeneficiaries.toLocaleString()} icon={<Users size={24} />} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Status Distribution</p>
                  <div className="h-60 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(sharedProjects.reduce<Record<string,number>>((acc,p)=>{acc[p.status]=(acc[p.status]||0)+1;return acc;},{})).map(([name,value])=>({name,value}))}
                          cx="50%" cy="50%" innerRadius={48} outerRadius={82} dataKey="value"
                        >
                          {sharedProjects.reduce<string[]>((acc,p)=>acc.includes(p.status)?acc:[...acc,p.status],[]).map((_,i)=><Cell key={i} fill={PCOLORS[i%PCOLORS.length]} />)}
                        </Pie>
                        <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Budget by Sector (MK M)</p>
                  <div className="overflow-x-auto pb-1">
                    <div className="h-56 min-w-[500px] w-full">
                      <ResponsiveContainer width="100%" height={224}>
                        <BarChart data={SECTORS.map(s=>({sector:s.substring(0,8),budget:sharedProjects.filter(p=>p.sector===s).reduce((t,p)=>t+p.budget,0)/1000000})).filter(d=>d.budget>0)} margin={{ top: 8, right: 16, left: -15, bottom: 25 }}>
                          <XAxis dataKey="sector" tick={{ fontSize: 10 }} interval={0} height={30} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(v)=>[`MK ${Number(v).toFixed(1)}M`]} />
                          <Bar dataKey="budget" name="Budget" fill="#145a32" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100"><p className="text-sm font-semibold text-gray-700">Full Project List</p></div>
                <div className="overflow-x-auto">
                  <table className="min-w-max w-full text-xs">
                    <thead><tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      {['ID','Project Name','Sector','Ward','Status','Progress','Budget','Beneficiaries','Monitor'].map(h => <th key={h} className="text-left px-3 py-2.5 font-medium whitespace-nowrap">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sharedProjects.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{p.id}</td>
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{p.sector}</td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{p.ward}</td>
                          <td className="px-3 py-2 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                          <td className="px-3 py-2 whitespace-nowrap">{p.status==='Completed'?100:p.progress}%</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatMK(p.budget)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{p.beneficiaries.toLocaleString()}</td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{p.monitor || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT */}
          {section === 'audit' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Audit Trail</h2>
                <p className="text-sm text-gray-500">All system activity log</p>
              </div>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder="Search audit log..." value={auditSearch} onChange={e => setAuditSearch(e.target.value)} />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-max w-full text-xs">
                    <thead><tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                      {['Date','Time','User','Action','Target','Before','After'].map(h => <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {filteredAudit.map(a => (
                        <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{a.date}</td>
                          <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{a.time}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-700 whitespace-nowrap">{a.user}</td>
                          <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{a.action}</td>
                          <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{a.target}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">{a.oldValue && <span className="px-2 py-0.5 text-white text-xs font-semibold" style={{ background: '#00cc00', borderRadius: '0.2rem' }}>{a.oldValue}</span>}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">{a.newValue && <span className="px-2 py-0.5 text-white text-xs font-semibold" style={{ background: '#00cc00', borderRadius: '0.2rem' }}>{a.newValue}</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredAudit.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No entries match your search.</div>}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {section === 'announcements' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Announcements</h2>
                  <p className="text-sm text-gray-500">{localAnnouncements.filter(a => a.published).length} published</p>
                </div>
                <button onClick={() => setModal({ kind: 'new-announcement' })} className="flex items-center gap-2 bg-[#145a32] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0f4424] self-start sm:self-auto">
                  <Plus size={16} /> New Announcement
                </button>
              </div>
              <div className="space-y-4">
                {localAnnouncements.map(a => (
                  <div key={a.id} className={`bg-white rounded-2xl border p-5 ${!a.published ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2.5 py-0.5 text-white" style={{ background: '#00cc00', borderRadius: '0.2rem' }}>{a.category}</span>
                          {!a.published && <span className="text-xs font-semibold px-2.5 py-0.5 bg-gray-200 text-gray-500" style={{ borderRadius: '0.2rem' }}>Unpublished</span>}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                        <p className="text-xs text-gray-400">{a.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{a.body}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setModal({ kind: 'edit-announcement', announcement: a })} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => togglePublished(a)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold ${a.published ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                        {a.published ? <><XCircle size={12} /> Unpublish</> : <><CheckCircle size={12} /> Republish</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modal?.kind === 'new-project' && <ProjectModal onSave={saveProject} onClose={() => setModal(null)} monitorList={localMonitors} />}
      {modal?.kind === 'edit-project' && <ProjectModal initial={modal.project} onSave={saveProject} onClose={() => setModal(null)} monitorList={localMonitors} />}
      {modal?.kind === 'view-project' && (
        <Modal title={modal.project.name} onClose={() => setModal(null)}>
          <div className="space-y-3">
            {[
              ['ID', modal.project.id],
              ['Type / Initiative', modal.project.projectType || 'CDF'],
              ['Component', modal.project.component || 'Community Development Project'],
              ...(modal.project.initiativeName ? [['Initiative Name', modal.project.initiativeName]] : []),
              ...(modal.project.initiativeComponent ? [['Initiative Component', modal.project.initiativeComponent]] : []),
              ['Region', modal.project.region || 'Northern'],
              ['District', modal.project.district || 'Likoma'],
              ['Constituency', modal.project.constituency],
              ['Ward', modal.project.ward],
              ['Sector', modal.project.sector],
              ['Status', modal.project.status],
              ['Progress', `${modal.project.progress}%`],
              ['Location', modal.project.location],
              ['Budget', formatMK(modal.project.budget)],
              ['Beneficiaries', modal.project.beneficiaries.toLocaleString()],
              ['Beneficiary Type', getProjectBeneficiaryType(modal.project)],
              ['Contractor', modal.project.contractor],
              ['Monitor', modal.project.monitor],
              ['Expected Completion', modal.project.expectedCompletion],
              ['Actual Completion', modal.project.actualCompletion],
            ].map(([l, v]) => (
              <div key={l} className="flex gap-2"><span className="text-xs text-gray-500 w-36 flex-shrink-0 pt-0.5">{l}</span><span className="text-xs text-gray-900 font-medium">{String(v||'—')}</span></div>
            ))}
            {modal.project.description && <div><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3">{modal.project.description}</p></div>}
            <div className="flex justify-end pt-2">
              <button onClick={() => setModal({ kind: 'edit-project', project: modal.project })} className="flex items-center gap-1.5 text-sm bg-[#145a32] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#0f4424]">
                <Edit2 size={14} /> Edit Project
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal?.kind === 'add-monitor' && <MonitorModal onSave={saveMonitor} onClose={() => setModal(null)} />}
      {modal?.kind === 'edit-monitor' && <MonitorModal initial={modal.monitor} onSave={saveMonitor} onClose={() => setModal(null)} />}
      {modal?.kind === 'new-announcement' && <AnnouncementModal onSave={saveAnnouncement} onClose={() => setModal(null)} />}
      {modal?.kind === 'edit-announcement' && <AnnouncementModal initial={modal.announcement} onSave={saveAnnouncement} onClose={() => setModal(null)} />}
      {modal?.kind === 'schedule-visit' && <ScheduleVisitModal onSave={scheduleVisit} onClose={() => setModal(null)} monitorList={localMonitors} projectList={sharedProjects} />}
      {modal?.kind === 'reschedule-visit' && <ScheduleVisitModal onSave={(data) => rescheduleVisit(modal.visit, data)} onClose={() => setModal(null)} monitorList={localMonitors} projectList={sharedProjects} prefill={modal.visit} />}
      {modal?.kind === 'review-submission' && <SubmissionReviewModal sub={modal.submission} action={modal.action} onConfirm={(note, progress) => modal.action === 'approve' ? approveSubmission(modal.submission, note, progress) : returnSubmission(modal.submission, note)} onClose={() => setModal(null)} />}
      {modal?.kind === 'upload-ward-photo' && (
        <WardStatusPhotoModal
          initial={modal.initialPhoto}
          defaultWard={modal.defaultWard}
          defaultStatus={modal.defaultStatus}
          defaultCategory={modal.defaultCategory}
          projects={sharedProjects}
          onSave={saveWardStatusPhoto}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'view-ward-photo' && (
        <WardPhotoLightboxModal
          photo={modal.photo}
          onClose={() => setModal(null)}
          onEdit={(p) => setModal({ kind: 'upload-ward-photo', initialPhoto: p })}
        />
      )}
      {modal?.kind === 'confirm' && <ConfirmDialog message={modal.message} onConfirm={modal.action} onCancel={() => setModal(null)} />}

      {/* Monitor added popup */}
      {monitorPopup && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-green-200 overflow-hidden">
            <div className="bg-[#145a32] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-white font-semibold text-sm">Monitor Added</p>
              <button onClick={() => setMonitorPopup(null)} className="ml-auto text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <div className="px-4 py-4 space-y-3">
              <p className="text-sm text-gray-700"><span className="font-semibold">{monitorPopup.name}</span> has been added as a Field Monitor.</p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={12} className="text-[#145a32]" /> <span className="font-semibold">{monitorPopup.email}</span></div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle size={12} className="text-[#145a32] mt-0.5 flex-shrink-0" />
                  <span>Ward assignment: <span className="font-semibold">{monitorPopup.wards || 'To be assigned'}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <Mail size={13} className="text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Email notification sent to <span className="font-semibold">{monitorPopup.email}</span> with ward assignment details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
