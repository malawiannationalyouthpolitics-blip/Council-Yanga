import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, LabelList,
} from 'recharts';
import {
  Menu, X, Search, Globe, LogIn, ChevronDown,
  MapPin, Users, Calendar, FileText, Megaphone, MessageSquare,
  Clock, TrendingUp, Building2, Download,
  Phone, Mail, Bell, Info, CheckCircle2,
  FolderKanban, Activity, Wallet, LayoutGrid, UserCheck, Banknote, ChevronRight, ChevronLeft, Contact,
  Layers, Camera, Maximize2,
} from 'lucide-react';
import {
  Logo, PartnerLogo, StatusBadge, ProgressBar, StatCard, Card,
  AnnouncementCategoryBadge, CheckIcon, STATUS_BG, CategoryBadge,
} from '@/components/shared';
import {
  projects as defaultProjects, announcements, publicDocuments, feedback,
  monitors as defaultMonitors, monitorSubmissions as defaultSubmissions,
  projectsByWardData, activityData, financials, formatMK,
  appNotifications, AppNotification, MAP_POSITIONS, STATUS_COLORS,
  SECTORS as ALL_SECTORS, Project, Monitor, Feedback, SysNotification, User,
  PROJECT_TYPES, CDF_COMPONENTS, COMMUNITY_DEVELOPMENT_SECTORS, DISTRICTS, CONSTITUENCIES, WARDS,
  BENEFICIARY_TYPES, getProjectBeneficiaryType, getProjectDisbursed, getProjectUtilised, MonitorSubmission,
  INITIATIVE_COMPONENTS, INITIATIVE_COMPONENT_DESCRIPTIONS, getBeneficiaryTypeForInitiativeComponent, getProjectInitiativeComponent,
  isInitiative, isProject, WardStatusPhoto,
} from '@/data';
import mapBgImage from '@/imports/map_bg_image.jpg';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ny', label: 'Chichewa', short: 'NY' },
  { code: 'tum', label: 'Tumbuka', short: 'TUM' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1728743264694-4ac39fa29385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1777804309137-b3c36e5d2487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    Overview: 'Overview', Projects: 'Projects', Map: 'Map',
    Announcements: 'Announcements', Feedback: 'Feedback', Documents: 'Documents',
    kpiHeading: 'Community Projects and Initiatives Performance Summary',
    heroTitle: 'COUNCIL YANGA',
    heroDesc: 'Track community development. Follow development project in real time from planning to completion.',
    'Total CDF Projects': 'Total CDF Projects',
    'Total Projects': 'Total Projects', Completed: 'Completed', Ongoing: 'Ongoing',
    'Completed Projects': 'Completed Projects', 'Ongoing Projects': 'Ongoing Projects',
    'Total Budget': 'Total Budget', Beneficiaries: 'Beneficiaries', Sectors: 'Sectors',
    'Total Initiatives': 'Total Initiatives',
    'Total Project Type/Initiatives': 'Total Initiatives',
    'CDF Disbursed': 'Total Funds Disbursed',
    'Total Funds Disbursed': 'Total Funds Disbursed',
    'Total District Constituencies': 'Total District Constituencies', 'Total Wards': 'Total Wards',
    'Beneficiaries Distribution': 'Beneficiaries Distribution',
    'Constituency Wards Initiatives': 'Constituency Wards Initiatives',
    'Beneficiaries by Sector': 'Beneficiaries by Sector',
    'Funds Disbursed vs Utilised': 'Funds Disbursed vs Utilised by Constituency',
    'Funds Disbursed vs Utilised Subtitle': 'Comparison of funds disbursed against funds utilised within each constituency',
    'Amount Disbursed': 'Amount Disbursed',
    'Amount Utilised': 'Amount Utilised',
    'Projects by Ward': 'Projects by Ward', 'Projects by Sector': 'Projects by Sector',
    'Monitor Activity Trend': 'Monitor Activity Trend', 'Financial Transparency': 'Financial Transparency',
    'Our Partners': 'Our Partners',
    'Staff Login': 'Staff Login', Notifications: 'Notifications', 'Mark all read': 'Mark all read',
    'Search projects...': 'Search projects...', 'projects found': 'projects found',
    'Citizen Feedback': 'Citizen Feedback', 'Submit feedback concern, suggestion or observation': 'Submit a concern, suggestion, or observation. Track the status of all submitted feedback below.',
    'Feedback Tracking Board': 'Feedback Tracking Board',
    'Submit New Feedback': 'Submit New Feedback', 'Feedback Type': 'Feedback Type',
    'Select type': 'Select type', 'Submit Feedback': 'Submit Feedback',
    'Feedback Submitted!': 'Feedback Submitted!', 'Submit Another': 'Submit Another',
    'Project Location Map': 'Project Location Map', 'Public Documents': 'Public Documents',
    'Download project reports, guidelines': 'Download project reports, CDF guidelines and official notices.',
    'Search documents...': 'Search documents...', Download: 'Download',
    'No notifications': 'No notifications',
  },
  ny: {
    Overview: 'Mawonekedwe', Projects: 'Ntchito', Map: 'Mapu',
    Announcements: 'Mauthenga', Feedback: 'Maganizo', Documents: 'Malemba',
    kpiHeading: 'Chilinganizo cha Ntchito za Madera ndi Zochitika',
    heroTitle: 'Council Yanga - Portal ya Tsatanetsatane wa CDF',
    heroDesc: 'Mbale yoyera yomwe imapereka mwayi kwa nzika, oyang\'anira ndi aofesi a kanselo kutsatira kukonzekera, kuyenda kwa ntchito ndi kumalizika kwa ntchito zonse za CDF - kukuza kuonekera, kuwaza ndi kutengeka kwa anthu ku wards zonse.',
    'Total CDF Projects': 'Ntchito za CDF',
    'Total Projects': 'Ntchito Zonse', Completed: 'Zomaliza', Ongoing: 'Zikuchitika',
    'Completed Projects': 'Ntchito Zomaliza', 'Ongoing Projects': 'Ntchito Zikuchitika',
    'Total Budget': 'Ndalama Zonse', Beneficiaries: 'Anthu Opindula', Sectors: 'Zigawo',
    'Total Initiatives': 'Ntchito Zonse',
    'Total Project Type/Initiatives': 'Ntchito Zonse',
    'CDF Disbursed': 'Ndalama Zonse Zotulutsidwa',
    'Total Funds Disbursed': 'Ndalama Zonse Zotulutsidwa',
    'Total District Constituencies': 'Madera Onse a Boma', 'Total Wards': 'Mawodi Onse',
    'Beneficiaries Distribution': 'Kufalikira kwa Anthu Opindula',
    'Constituency Wards Initiatives': 'Ntchito za Mawodi a Dera',
    'Beneficiaries by Sector': 'Anthu Opindula pa Zigawo',
    'Funds Disbursed vs Utilised': 'Ndalama Zotulutsidwa ndi Zogwiritsidwa Ntchito m\'Zigawo',
    'Funds Disbursed vs Utilised Subtitle': 'Kufananitsa ndalama zoperekedwa ndi zomwe zagwiritsidwa ntchito m\'madera onse',
    'Amount Disbursed': 'Ndalama Zotulutsidwa',
    'Amount Utilised': 'Ndalama Zogwiritsidwa Ntchito',
    'Projects by Ward': 'Ntchito pa Wards', 'Projects by Sector': 'Ntchito pa Zigawo',
    'Monitor Activity Trend': 'Zochitika za Oyang\'anira', 'Financial Transparency': 'Kuonekera kwa Ndalama',
    'Our Partners': 'Othandizana Nafe',
    'Staff Login': 'Kulowa kwa Ogwira Ntchito', Notifications: 'Zodziwitsa', 'Mark all read': 'Lemba Kuti Wasomera',
    'Search projects...': 'Sakani ntchito...', 'projects found': 'ntchito zapezeka',
    'Citizen Feedback': 'Maganizo a Nzika', 'Submit feedback concern, suggestion or observation': 'Tumiza nkhawa, lingaliro, kapena chidziwitso chanu. Tsatani mkhalidwe wa maganizo onse aperekedwa pansipa.',
    'Feedback Tracking Board': 'Bwalo la Kutsatira Maganizo',
    'Submit New Feedback': 'Tumiza Maganizo Atsopano', 'Feedback Type': 'Mtundu wa Maganizo',
    'Select type': 'Sankhani mtundu', 'Submit Feedback': 'Tumiza Maganizo',
    'Feedback Submitted!': 'Maganizo Atumizidwa!', 'Submit Another': 'Tumiza Ena',
    'Project Location Map': 'Mapu a Malo a Ntchito', 'Public Documents': 'Malemba a Anthu',
    'Download project reports, guidelines': 'Tsitsani malipoti a ntchito, malangizo a CDF ndi malemba achikumbutso.',
    'Search documents...': 'Sakani malemba...', Download: 'Tsitsani',
    'No notifications': 'Palibe Zodziwitsa',
  },
  tum: {
    Overview: 'Mulongosolo', Projects: 'Ntchito', Map: 'Mapu',
    Announcements: 'Mbuyo', Feedback: 'Maganizo', Documents: 'Malemba',
    kpiHeading: 'Mulongosolo wa Ntchito za Madera na Zochitika',
    heroTitle: 'Council Yanga - Portal ya CDF',
    heroDesc: 'Malo yakuphata vinthu olo nyengo yiliyose, yakovwira abantu, openga na aofesi ya kansilo kutsata zakonzekera, kusona kwa ntchito na kuphemereskana kwa ntchito zose za CDF - kukuza kuwoneseka, kuwaza na kulangana kwa abantu mu vigawo vyose.',
    'Total CDF Projects': 'Ntchito za CDF',
    'Total Projects': 'Ntchito Zonse', Completed: 'Yatimira', Ongoing: 'Ilipo',
    'Completed Projects': 'Ntchito Zakumalizika', 'Ongoing Projects': 'Ntchito Zakuchitika',
    'Total Budget': 'Ndalama Zonse', Beneficiaries: 'Anthu Asobola', Sectors: 'Vigawo',
    'Total Initiatives': 'Ntchito Zose',
    'Total Project Type/Initiatives': 'Ntchito Zose',
    'CDF Disbursed': 'Ndalama Zose Zalasiridwa',
    'Total Funds Disbursed': 'Ndalama Zose Zalasiridwa',
    'Total District Constituencies': 'Madera Ghose gha Boma', 'Total Wards': 'Mawodi Ghose',
    'Beneficiaries Distribution': 'Kugaŵana kwa Anthu Asobola',
    'Constituency Wards Initiatives': 'Ntchito za Mawodi gha Dera',
    'Beneficiaries by Sector': 'Anthu Asobola mu Vigawo',
    'Funds Disbursed vs Utilised': 'Ndalama Zakuperekeka na Zakugwiriskika mu Vigawo',
    'Funds Disbursed vs Utilised Subtitle': 'Kuyaniska ndalama zaperekeka na izo zagwiriskika ntchito mu madela ghose',
    'Amount Disbursed': 'Ndalama Zalasiridwa',
    'Amount Utilised': 'Ndalama Zagwiriskika',
    'Projects by Ward': 'Ntchito mu Vigawo', 'Projects by Sector': 'Ntchito monga Vigawo',
    'Monitor Activity Trend': 'Mulingo wa Openga', 'Financial Transparency': 'Kuwoneseka kwa Ndalama',
    'Our Partners': 'Awo Tikugwira Nawo Ntchito',
    'Staff Login': 'Kulowa kwa Agwira Ntchito', Notifications: 'Mbuyo', 'Mark all read': 'Lemba Kuti Wasomera',
    'Search projects...': 'Sankhani ntchito...', 'projects found': 'ntchito zapezeka',
    'Citizen Feedback': 'Maganizo ya Abantu', 'Submit feedback concern, suggestion or observation': 'Tumiza chimbombo, lingaliro, kapena chichirikizo chanu. Tsatani mkhalidwe wa maganizo yose yaperekedwa pano.',
    'Feedback Tracking Board': 'Bwalo la Kutsata Maganizo',
    'Submit New Feedback': 'Tumiza Maganizo Gha Kudya', 'Feedback Type': 'Mtundu wa Maganizo',
    'Select type': 'Sankhani mtundu', 'Submit Feedback': 'Tumiza Maganizo',
    'Feedback Submitted!': 'Maganizo Yatumizidwa!', 'Submit Another': 'Tumiza Ena',
    'Project Location Map': 'Mapu ya Malo ya Ntchito', 'Public Documents': 'Malemba ya Abantu',
    'Download project reports, guidelines': 'Tsitsani malipoti ya ntchito, malangizo ya CDF na malemba yakichikumbutso.',
    'Search documents...': 'Sankhani malemba...', Download: 'Tsitsani',
    'No notifications': 'Palibe Mbuyo',
  },
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: <TrendingUp size={14} /> },
  // { id: 'projects', label: 'Projects', icon: <Building2 size={14} /> },
  // { id: 'map', label: 'Map', icon: <MapPin size={14} /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone size={14} /> },
  { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={14} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
];

const CHART_COLORS = ['#16a34a', '#2563eb', '#d97706', '#0891b2', '#dc2626', '#7c3aed', '#db2777'];

function realisticProgress(status: string, raw: number): number {
  if (status === 'Completed') return 100;
  if (status === 'Not Started' || status === 'Proposed' || status === 'Assessed') return 0;
  if (status === 'Near Completion') return Math.max(raw, 80);
  return raw;
}

function formatWardName(ward?: string): string {
  if (!ward) return 'Ward';
  const base = ward.replace(/\bward\b/gi, '').trim();
  return `${base} Ward`;
}

function FbStatusBadge({ status }: { status: string }) {
  const bg: Record<string, string> = {
    Received: '#2563eb',
    'Under Review': '#d97706',
    'Verification Requested': '#7c3aed',
    Resolved: '#016630',
    Rejected: '#dc2626',
  };
  return <span className="text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap" style={{ background: bg[status] ?? '#6b7280', borderRadius: '0.2rem' }}>{status}</span>;
}

interface MonitorSitePhoto {
  url: string;
  caption: string;
  monitor: string;
  date: string;
  stage: string;
}

const PROJECT_MONITOR_PHOTOS: Record<string, MonitorSitePhoto[]> = {
  'CY-2026-001': [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gravel compaction & levelling on km 3–5 road corridor',
      monitor: 'James Phiri',
      date: '20 Aug 2026',
      stage: '65% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
      caption: 'Motor grader re-shaping road shoulder and camber',
      monitor: 'James Phiri',
      date: '14 Aug 2026',
      stage: '58% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Stone masonry lining for roadside storm drain',
      monitor: 'James Phiri',
      date: '06 Aug 2026',
      stage: '50% Progress',
    },
  ],
  'CY-2026-002': [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Classroom block brick masonry up to lintel beam',
      monitor: 'James Phiri',
      date: '24 Jul 2026',
      stage: '85% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Treated timber roof trusses and iron sheet installation',
      monitor: 'James Phiri',
      date: '02 Aug 2026',
      stage: '92% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      caption: 'Plastered interior with 3-seater double desks installed',
      monitor: 'James Phiri',
      date: '12 Aug 2026',
      stage: 'Completed Projects',
    },
  ],
  'CY-2026-003': [
    {
      url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Bridge abutment formwork assembly and inspection',
      monitor: 'James Phiri',
      date: '22 Aug 2026',
      stage: '45% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
      caption: 'High-tensile reinforcement rebar delivery on site',
      monitor: 'James Phiri',
      date: '16 Aug 2026',
      stage: '40% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Stream clearance & scour protection foundation works',
      monitor: 'James Phiri',
      date: '05 Aug 2026',
      stage: '35% Progress',
    },
  ],
  'CY-2026-004': [
    {
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Additional monocrystalline solar panels on south array',
      monitor: 'James Phiri',
      date: '15 Aug 2026',
      stage: '30% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Battery storage bank racking and cabling installation',
      monitor: 'James Phiri',
      date: '09 Aug 2026',
      stage: '25% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Inverter substation concrete foundation pad check',
      monitor: 'James Phiri',
      date: '28 Jul 2026',
      stage: '20% Progress',
    },
  ],
  'CY-2026-005': [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Final gravelling & smooth compaction near Bama village',
      monitor: 'Grace Banda',
      date: '25 Aug 2026',
      stage: '85% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
      caption: 'Precast concrete culverts and stone wingwalls installed',
      monitor: 'Grace Banda',
      date: '18 Aug 2026',
      stage: '80% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Corridor verification with Same–Bama community elders',
      monitor: 'Grace Banda',
      date: '10 Aug 2026',
      stage: '75% Progress',
    },
  ],
  'CY-2026-006': [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Classroom extension brickwork for infant section',
      monitor: 'James Phiri',
      date: '19 Jul 2026',
      stage: '65% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      caption: 'Interior ceiling boards and window security glazing',
      monitor: 'James Phiri',
      date: '08 Aug 2026',
      stage: '75% Progress',
    },
  ],
  'CY-2026-007': [
    {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      caption: 'Concrete canal lining and water control sluice repair',
      monitor: 'James Phiri',
      date: '08 Aug 2026',
      stage: '40% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Field discharge trial to farmers nursery vegetable plots',
      monitor: 'James Phiri',
      date: '19 Aug 2026',
      stage: '50% Progress',
    },
  ],
  'CY-2026-008': [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Maternity clinic structure complete up to lintel level',
      monitor: 'Grace Banda',
      date: '10 Aug 2026',
      stage: '50% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Pharmacy store plastering and roof truss erection',
      monitor: 'Grace Banda',
      date: '18 Aug 2026',
      stage: '55% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      caption: 'Clinical wash basins and solar power conduit installation',
      monitor: 'Grace Banda',
      date: '26 Aug 2026',
      stage: '60% Progress',
    },
  ],
  'CY-2026-009': [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gravelling on Makulawe–Yofu spur road completed',
      monitor: 'Stella Mkandawire',
      date: '28 Aug 2026',
      stage: '55% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
      caption: 'Stream crossing culvert concrete headwall completed',
      monitor: 'Stella Mkandawire',
      date: '20 Aug 2026',
      stage: '50% Progress',
    },
  ],
  'CY-2026-010': [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Four-classroom block foundation footings and brickwork',
      monitor: 'Stella Mkandawire',
      date: '14 Aug 2026',
      stage: '45% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      caption: 'Delivered roof timber trusses and teacher office framing',
      monitor: 'Stella Mkandawire',
      date: '24 Aug 2026',
      stage: '50% Progress',
    },
  ],
  'CY-2026-011': [
    {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      caption: 'Kachere scheme feeder canal excavation and stone pitching',
      monitor: 'Stella Mkandawire',
      date: '12 Aug 2026',
      stage: '35% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Farmer cooperative inspection of intake weir diversion',
      monitor: 'Stella Mkandawire',
      date: '22 Aug 2026',
      stage: '40% Progress',
    },
  ],
  'CY-2026-012': [
    {
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Solar arrays mounting frame assembly at Likoma main site',
      monitor: 'Peter Kachingwe',
      date: '11 Aug 2026',
      stage: '60% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Inverter bank wiring and battery management synchronizer',
      monitor: 'Peter Kachingwe',
      date: '25 Aug 2026',
      stage: '70% Progress',
    },
  ],
  'CY-2026-013': [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Road sub-base compaction and gravel delivery near Khuyu',
      monitor: 'Peter Kachingwe',
      date: '08 Aug 2026',
      stage: '70% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Stone masonry retaining wall on steep hill section',
      monitor: 'Peter Kachingwe',
      date: '18 Aug 2026',
      stage: '75% Progress',
    },
  ],
  'CY-2026-014': [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Completed school block final painting and verge clearance',
      monitor: 'Stella Mkandawire',
      date: '25 May 2026',
      stage: '95% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      caption: 'School committee handover inspection & verification',
      monitor: 'Stella Mkandawire',
      date: '03 Jun 2026',
      stage: 'Completed Projects',
    },
  ],
  'CY-2026-015': [
    {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      caption: 'Fish processing concrete landing slab and solar drying racks',
      monitor: 'Peter Kachingwe',
      date: '14 Aug 2026',
      stage: '30% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1000&q=80',
      caption: 'Insulated cold storage room structure and fresh water point',
      monitor: 'Peter Kachingwe',
      date: '24 Aug 2026',
      stage: '35% Progress',
    },
  ],
  'CY-2026-016': [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Maternity wing brick masonry superstructure & steel roofing',
      monitor: 'Peter Kachingwe',
      date: '16 Aug 2026',
      stage: '40% Progress',
    },
    {
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Interior clinical ward partitions, sanitary piping and tiles',
      monitor: 'Peter Kachingwe',
      date: '27 Aug 2026',
      stage: '45% Progress',
    },
  ],
};

const SECTOR_FALLBACK_PHOTOS: Record<string, MonitorSitePhoto[]> = {
  Roads: [
    {
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gravel compaction & levelling on ward road corridor',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
    {
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
      caption: 'Drainage culvert installation & stone pitching',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
  ],
  Education: [
    {
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Classroom block brick superstructure construction',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
    {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      caption: 'Finished classroom with learner desks & blackboard',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
  ],
  Energy: [
    {
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Solar panel array ground mounting & wiring',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
    {
      url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Battery storage and power inverter substation',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
  ],
  Health: [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Health facility wing construction and ramp access',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
    {
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Interior clinical ward and pharmacy room fittings',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
  ],
  Agriculture: [
    {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      caption: 'Irrigation canal concrete lining & intake weir check',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
    {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Field discharge and water distribution test',
      monitor: 'Ward Monitor',
      date: 'Field Inspection',
      stage: 'Ongoing Projects',
    },
  ],
};

const DEFAULT_MONITOR_PHOTOS: MonitorSitePhoto[] = [
  {
    url: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ward monitor & project committee on-site verification',
    monitor: 'Ward Monitor',
    date: 'Field Inspection',
    stage: 'Ongoing Projects',
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    caption: 'Structural works and building materials quality check',
    monitor: 'Ward Monitor',
    date: 'Field Inspection',
    stage: 'Ongoing Projects',
  },
];

function getWardMonitorPhotos(
  project: Project,
  submissions?: MonitorSubmission[],
  wardStatusPhotos?: WardStatusPhoto[]
): MonitorSitePhoto[] {
  const isInit = isInitiative(project);
  const category: 'Project' | 'Initiative' = isInit ? 'Initiative' : 'Project';
  const cleanWard = formatWardName(project.ward);
  const currentStatus = project.status;

  const result: MonitorSitePhoto[] = [];

  // 1. Admin-managed Ward Status Photos
  if (wardStatusPhotos && wardStatusPhotos.length > 0) {
    // Exact project match with matching status
    const projectExactStatus = wardStatusPhotos.filter(
      p => p.projectId === project.id && p.status?.toLowerCase() === currentStatus?.toLowerCase()
    );
    // Exact project match (any status)
    const projectOther = wardStatusPhotos.filter(
      p => p.projectId === project.id && p.status?.toLowerCase() !== currentStatus?.toLowerCase()
    );
    // Ward-level match with matching category and matching status
    const wardExactStatus = wardStatusPhotos.filter(
      p => formatWardName(p.ward) === cleanWard && p.category === category && p.status?.toLowerCase() === currentStatus?.toLowerCase()
    );
    // Ward-level match with matching category (other status)
    const wardCategoryOther = wardStatusPhotos.filter(
      p => formatWardName(p.ward) === cleanWard && p.category === category && p.status?.toLowerCase() !== currentStatus?.toLowerCase()
    );

    // Prioritize project exact status, then ward exact status
    const priorityPhotos = [...projectExactStatus, ...wardExactStatus];
    for (const ph of priorityPhotos) {
      result.push({
        url: ph.url,
        caption: ph.caption || `${ph.ward} ${ph.category} (${ph.status})`,
        monitor: ph.monitor || project.monitor || 'Ward Monitor',
        date: ph.date || 'Recent Inspection',
        stage: `${ph.status} Status`,
      });
    }

    // Add field submissions if any
    if (submissions && submissions.length > 0) {
      const matched = submissions.filter(
        s => (s.projectId === project.id || s.projectName?.toLowerCase() === project.name.toLowerCase()) && s.photos && s.photos.length > 0
      );
      for (const sub of matched) {
        if (sub.photos) {
          for (let i = 0; i < sub.photos.length; i++) {
            result.push({
              url: sub.photos[i],
              caption: sub.observation || `Field inspection photo for ${project.name}`,
              monitor: sub.monitorName || project.monitor || 'Ward Monitor',
              date: sub.date || 'Recent Report',
              stage: `${sub.progress}% Progress (${sub.status})`,
            });
          }
        }
      }
    }

    // Add secondary photos (other statuses for this project, then other for ward)
    for (const ph of [...projectOther, ...wardCategoryOther]) {
      result.push({
        url: ph.url,
        caption: ph.caption || `${ph.ward} ${ph.category} (${ph.status})`,
        monitor: ph.monitor || project.monitor || 'Ward Monitor',
        date: ph.date || 'Recent Inspection',
        stage: `${ph.status} Status`,
      });
    }
  } else {
    // If no wardStatusPhotos provided, use field submissions
    if (submissions && submissions.length > 0) {
      const matched = submissions.filter(
        s => (s.projectId === project.id || s.projectName?.toLowerCase() === project.name.toLowerCase()) && s.photos && s.photos.length > 0
      );
      for (const sub of matched) {
        if (sub.photos) {
          for (let i = 0; i < sub.photos.length; i++) {
            result.push({
              url: sub.photos[i],
              caption: sub.observation || `Field inspection photo for ${project.name}`,
              monitor: sub.monitorName || project.monitor || 'Ward Monitor',
              date: sub.date || 'Recent Report',
              stage: `${sub.progress}% Progress (${sub.status})`,
            });
          }
        }
      }
    }
  }

  const curated = PROJECT_MONITOR_PHOTOS[project.id]
    || SECTOR_FALLBACK_PHOTOS[project.sector]
    || DEFAULT_MONITOR_PHOTOS;

  return result.length > 0 ? [...result, ...curated] : curated;
}

function WardMonitoringImageBanner({
  project,
  submissions,
  wardStatusPhotos,
}: {
  project: Project;
  submissions?: MonitorSubmission[];
  wardStatusPhotos?: WardStatusPhoto[];
}) {
  const photos = React.useMemo(() => getWardMonitorPhotos(project, submissions, wardStatusPhotos), [project, submissions, wardStatusPhotos]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const cleanWard = formatWardName(project.ward);
  const prog = realisticProgress(project.status, project.progress);
  const statusBg = STATUS_BG[project.status] ?? '#2563eb';

  // Auto-slide carousel for banner images
  useEffect(() => {
    if (isPaused || photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % photos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, photos.length]);

  const activePhoto = photos[currentIdx] || photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(i => (i - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(i => (i + 1) % photos.length);
  };

  return (
    <>
      <div
        className="relative w-full h-48 sm:h-52 bg-gray-900 overflow-hidden group select-none cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => setLightboxOpen(true)}
      >
        {/* Images sliding layer */}
        <div className="relative w-full h-full">
          {photos.map((ph, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={ph.url}
                alt={`${project.name} - ${ph.caption}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1590486803833')) {
                    target.src = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80';
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Ward Badge: 0.2rem border radius, status background color, single-word ward, no dots before slide count */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap shadow-md pointer-events-auto"
            style={{ background: statusBg, borderRadius: '0.2rem' }}
          >
            <span>{cleanWard}</span>
            <span className="text-white/90 font-mono text-[11px] font-normal">
              {currentIdx + 1}/{photos.length}
            </span>
          </div>

          <div className="flex items-center pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              title="Expand photo"
              className="bg-black/65 hover:bg-black/85 backdrop-blur-xs text-white p-1.5 transition-colors cursor-pointer shadow-sm"
              style={{ borderRadius: '0.2rem' }}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Navigation Arrows (visible on mobile or on hover on desktop) */}
        {photos.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto w-7 h-7 rounded-full bg-black/55 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-sm"
              title="Previous photo"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto w-7 h-7 rounded-full bg-black/55 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-sm"
              title="Next photo"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Bottom Gradient & Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 pointer-events-none">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white leading-tight truncate drop-shadow-sm">
                {activePhoto?.caption}
              </p>
              <div className="flex items-center text-[10px] text-white/80 mt-1">
                <span className="truncate">{activePhoto?.date}</span>
              </div>
            </div>

            {/* Status Badge placed below to the right side of image ward slide */}
            <div className="shrink-0 pointer-events-auto shadow-md">
              <StatusBadge status={project.status} />
            </div>
          </div>

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2 pointer-events-auto">
              {photos.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(dotIdx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to photo ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <Camera size={16} className="text-emerald-400 shrink-0" />
                <span className="font-bold text-sm truncate">{project.name}</span>
                <span className="text-xs text-white/60 shrink-0">{cleanWard}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Image Area */}
            <div className="relative h-80 sm:h-96 bg-black flex items-center justify-center">
              <img
                src={activePhoto?.url}
                alt={activePhoto?.caption}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1590486803833')) {
                    target.src = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80';
                  }
                }}
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer / Observation Details */}
            <div className="p-4 bg-gray-900 border-t border-white/10 text-white">
              <div className="flex items-center text-xs mb-2">
                <span className="text-white/70">{activePhoto?.date}</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {activePhoto?.caption}
              </p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 text-[11px] text-white/50">
                <span>Photo {currentIdx + 1} of {photos.length}</span>
                <span>Click outside or press X to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectSlideCard({
  project: p,
  submissions,
  onFeedback,
  wardStatusPhotos,
}: {
  project: Project;
  submissions?: MonitorSubmission[];
  onFeedback: (projectId: string) => void;
  wardStatusPhotos?: WardStatusPhoto[];
}) {
  const prog = realisticProgress(p.status, p.progress);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-w-0 transition-shadow hover:shadow-md overflow-hidden">
      {/* Ward Monitoring Image Banner Carousel */}
      <WardMonitoringImageBanner project={p} submissions={submissions} wardStatusPhotos={wardStatusPhotos} />

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-base leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {p.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <CategoryBadge category="Project" />
            <span className="text-xs text-gray-500">{p.sector}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <ProgressBar value={prog} className="flex-1" />
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{prog}%</span>
          </div>

          <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {p.description}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs mb-4">
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Location</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={p.location}>{p.location || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Ward</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={formatWardName(p.ward)}>{formatWardName(p.ward)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Budget</p>
              <p className="text-xs text-gray-900 font-medium">{formatMK(p.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Beneficiaries</p>
              <p className="text-xs text-gray-900 font-medium">{p.beneficiaries.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Beneficiary Type</p>
              <p className="text-xs text-gray-900 font-medium truncate" title="District-Wide">District-Wide</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Contractor</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={p.contractor}>{p.contractor || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Expected Completion</p>
              <p className="text-xs text-gray-900 font-medium">{p.expectedCompletion || '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Funding Source</p>
              <p className="text-xs text-gray-900 font-medium">{p.fundingSource || 'CDF 2025/2026'}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 mt-2">
          <button
            onClick={() => onFeedback(p.id)}
            className="w-full bg-[#145a32] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0f4424] active:scale-[0.99] transition-all cursor-pointer"
          >
            Submit Feedback on this Project
          </button>
        </div>
      </div>
    </div>
  );
}

function InitiativeSlideCard({
  project: p,
  submissions,
  onFeedback,
  index = 0,
  wardStatusPhotos,
}: {
  project: Project;
  submissions?: MonitorSubmission[];
  onFeedback: (projectId: string) => void;
  index?: number;
  wardStatusPhotos?: WardStatusPhoto[];
}) {
  const prog = realisticProgress(p.status, p.progress);
  const initiativeComp = getProjectInitiativeComponent(p, index);
  const beneficiaryType = getBeneficiaryTypeForInitiativeComponent(initiativeComp);
  const initiativeDesc = INITIATIVE_COMPONENT_DESCRIPTIONS[initiativeComp] || p.description;
  const displayName = p.initiativeName || `${initiativeComp} (${formatWardName(p.ward)})`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-w-0 transition-shadow hover:shadow-md overflow-hidden">
      {/* Ward Monitoring Image Banner Carousel */}
      <WardMonitoringImageBanner project={p} submissions={submissions} wardStatusPhotos={wardStatusPhotos} />

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-base leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {displayName}
            </h3>
            {p.name && p.initiativeName && p.name !== p.initiativeName && (
              <p className="text-xs text-gray-500 mt-0.5 truncate" title={p.name}>
                Project link: {p.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <CategoryBadge category="Initiative" />
            <span className="text-xs text-gray-500">{p.sector}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <ProgressBar value={prog} className="flex-1" />
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{prog}%</span>
          </div>

          <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {initiativeDesc}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs mb-4">
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Location</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={p.location}>{p.location || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Ward</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={formatWardName(p.ward)}>{formatWardName(p.ward)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Budget</p>
              <p className="text-xs text-gray-900 font-medium">{formatMK(p.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Beneficiaries</p>
              <p className="text-xs text-gray-900 font-medium">{p.beneficiaries.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Beneficiary Type</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={beneficiaryType}>{beneficiaryType}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Initiative Component</p>
              <p className="text-xs text-gray-900 font-medium truncate" title={initiativeComp}>{initiativeComp}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-bold text-black uppercase tracking-wide">Funding Source</p>
              <p className="text-xs text-gray-900 font-medium">{p.fundingSource || 'CDF 2025/2026'}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 mt-2">
          <button
            onClick={() => onFeedback(p.id)}
            className="w-full bg-[#145a32] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0f4424] active:scale-[0.99] transition-all cursor-pointer"
          >
            Submit Feedback on this Initiative
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectsOverviewCarousel({
  allProjects,
  submissions,
  onFeedback,
  wardStatusPhotos,
}: {
  allProjects: Project[];
  submissions?: MonitorSubmission[];
  onFeedback: (projectId: string) => void;
  wardStatusPhotos?: WardStatusPhoto[];
}) {
  // Desktop: 2 per slide; Mobile: 1 per slide
  const desktopSlides: Project[][] = [];
  for (let i = 0; i < allProjects.length; i += 2) {
    desktopSlides.push(allProjects.slice(i, i + 2));
  }
  const mobileSlides: Project[][] = allProjects.map(p => [p]);

  const [dSlide, setDSlide] = React.useState(0);
  const [mSlide, setMSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (dSlide >= desktopSlides.length && desktopSlides.length > 0) setDSlide(0);
  }, [desktopSlides.length, dSlide]);

  React.useEffect(() => {
    if (mSlide >= mobileSlides.length && mobileSlides.length > 0) setMSlide(0);
  }, [mobileSlides.length, mSlide]);

  React.useEffect(() => {
    if (isPaused) return;
    if (desktopSlides.length <= 1 && mobileSlides.length <= 1) return;
    const t = setInterval(() => {
      setDSlide(s => (s + 1) % (desktopSlides.length || 1));
      setMSlide(s => (s + 1) % (mobileSlides.length || 1));
    }, 4500);
    return () => clearInterval(t);
  }, [desktopSlides.length, mobileSlides.length, isPaused]);

  if (allProjects.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Wards Projects Overview
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
          No projects recorded for the selected filters.
        </div>
      </div>
    );
  }

  const prevSlide = () => {
    setDSlide(s => (s - 1 + desktopSlides.length) % (desktopSlides.length || 1));
    setMSlide(s => (s - 1 + mobileSlides.length) % (mobileSlides.length || 1));
  };

  const nextSlide = () => {
    setDSlide(s => (s + 1) % (desktopSlides.length || 1));
    setMSlide(s => (s + 1) % (mobileSlides.length || 1));
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Wards Projects Overview
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Previous slide"
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Next slide"
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Desktop: 2 per slide */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4 items-stretch">
        {desktopSlides[dSlide]?.map(p => (
          <ProjectSlideCard
            key={p.id}
            project={p}
            submissions={submissions}
            onFeedback={onFeedback}
            wardStatusPhotos={wardStatusPhotos}
          />
        ))}
        {(desktopSlides[dSlide]?.length ?? 0) === 1 && <div className="invisible" />}
      </div>

      {/* Mobile: 1 per slide */}
      <div className="sm:hidden">
        {mobileSlides[mSlide]?.map(p => (
          <ProjectSlideCard
            key={p.id}
            project={p}
            submissions={submissions}
            onFeedback={onFeedback}
            wardStatusPhotos={wardStatusPhotos}
          />
        ))}
      </div>
    </div>
  );
}

function WardsInitiativesOverviewCarousel({
  allProjects,
  submissions,
  onFeedback,
  wardStatusPhotos,
}: {
  allProjects: Project[];
  submissions?: MonitorSubmission[];
  onFeedback: (projectId: string) => void;
  wardStatusPhotos?: WardStatusPhoto[];
}) {
  // Desktop: 2 per slide; Mobile: 1 per slide
  const desktopSlides: Project[][] = [];
  for (let i = 0; i < allProjects.length; i += 2) {
    desktopSlides.push(allProjects.slice(i, i + 2));
  }
  const mobileSlides: Project[][] = allProjects.map(p => [p]);

  const [dSlide, setDSlide] = React.useState(0);
  const [mSlide, setMSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (dSlide >= desktopSlides.length && desktopSlides.length > 0) setDSlide(0);
  }, [desktopSlides.length, dSlide]);

  React.useEffect(() => {
    if (mSlide >= mobileSlides.length && mobileSlides.length > 0) setMSlide(0);
  }, [mobileSlides.length, mSlide]);

  React.useEffect(() => {
    if (isPaused) return;
    if (desktopSlides.length <= 1 && mobileSlides.length <= 1) return;
    const t = setInterval(() => {
      setDSlide(s => (s + 1) % (desktopSlides.length || 1));
      setMSlide(s => (s + 1) % (mobileSlides.length || 1));
    }, 4500);
    return () => clearInterval(t);
  }, [desktopSlides.length, mobileSlides.length, isPaused]);

  if (allProjects.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Wards Initiatives Overview
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
          No initiatives recorded for the selected filters.
        </div>
      </div>
    );
  }

  const prevSlide = () => {
    setDSlide(s => (s - 1 + desktopSlides.length) % (desktopSlides.length || 1));
    setMSlide(s => (s - 1 + mobileSlides.length) % (mobileSlides.length || 1));
  };

  const nextSlide = () => {
    setDSlide(s => (s + 1) % (desktopSlides.length || 1));
    setMSlide(s => (s + 1) % (mobileSlides.length || 1));
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Wards Initiatives Overview
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Previous slide"
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Next slide"
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Desktop: 2 per slide */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4 items-stretch">
        {desktopSlides[dSlide]?.map((p, idx) => (
          <InitiativeSlideCard
            key={p.id}
            project={p}
            index={dSlide * 2 + idx}
            submissions={submissions}
            onFeedback={onFeedback}
            wardStatusPhotos={wardStatusPhotos}
          />
        ))}
        {(desktopSlides[dSlide]?.length ?? 0) === 1 && <div className="invisible" />}
      </div>

      {/* Mobile: 1 per slide */}
      <div className="sm:hidden">
        {mobileSlides[mSlide]?.map((p, idx) => (
          <InitiativeSlideCard
            key={p.id}
            project={p}
            index={mSlide + idx}
            submissions={submissions}
            onFeedback={onFeedback}
            wardStatusPhotos={wardStatusPhotos}
          />
        ))}
      </div>
    </div>
  );
}

type AnnouncementItem = { id: string; category: string; date: string; title: string; body: string; published: boolean; createdBy: string };

function AnnouncementsCarousel({ desktopSlides, mobileSlides, total, tr }: {
  desktopSlides: AnnouncementItem[][];
  mobileSlides: AnnouncementItem[][];
  total: number;
  tr: (k: string) => string;
}) {
  const [dSlide, setDSlide] = useState(0);
  const [mSlide, setMSlide] = useState(0);

  useEffect(() => {
    if (desktopSlides.length <= 1) return;
    const t = setInterval(() => setDSlide(s => (s + 1) % desktopSlides.length), 4000);
    return () => clearInterval(t);
  }, [desktopSlides.length]);

  useEffect(() => {
    if (mobileSlides.length <= 1) return;
    const t = setInterval(() => setMSlide(s => (s + 1) % mobileSlides.length), 4000);
    return () => clearInterval(t);
  }, [mobileSlides.length]);

  function AnCard({ a }: { a: AnnouncementItem }) {
    return (
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <AnnouncementCategoryBadge category={a.category} />
          <span className="text-xs text-gray-400">{a.date}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-sm mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{a.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{a.body}</p>
      </Card>
    );
  }

  if (total === 0) return (
    <div className="text-center py-12 text-gray-400 text-sm">No announcements yet.</div>
  );

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{tr('Announcements')}</h2>
        <p className="text-sm text-gray-500">{total} published announcement{total !== 1 ? 's' : ''}</p>
      </div>
      {/* Desktop: 2 per slide */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-4">
          {desktopSlides[dSlide]?.map(a => <AnCard key={a.id} a={a} />)}
        </div>
        {desktopSlides.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {desktopSlides.map((_, i) => (
              <button key={i} onClick={() => setDSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === dSlide ? 'bg-[#145a32] w-4' : 'bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>
      {/* Mobile: 1 per slide */}
      <div className="sm:hidden">
        <div>
          {mobileSlides[mSlide]?.map(a => <AnCard key={a.id} a={a} />)}
        </div>
        {mobileSlides.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {mobileSlides.map((_, i) => (
              <button key={i} onClick={() => setMSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === mSlide ? 'bg-[#145a32] w-4' : 'bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NotifTypeIcon({ type }: { type: AppNotification['type'] }) {
  if (type === 'completion') return <CheckIcon size={14} />;
  if (type === 'update') return <Info size={14} className="text-blue-600" />;
  if (type === 'meeting') return <Calendar size={14} className="text-purple-600" />;
  if (type === 'new_project') return <Building2 size={14} className="text-[#145a32]" />;
  return <Megaphone size={14} className="text-amber-600" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Donut chart outside value callout label with elbow leader lines
// Matches the visual reference: values clearly visible outside without hover,
// connected with clean gray leader lines to the slices.
// ─────────────────────────────────────────────────────────────────────────────
function renderDonutCalloutLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, value } = props;
  if (!value || value === 0) return null;

  const RADIAN = Math.PI / 180;
  // Starting point at outer circumference of slice
  const sx = cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN);

  // Elbow turning point
  const mx = cx + (outerRadius + 7) * Math.cos(-midAngle * RADIAN);
  const my = cy + (outerRadius + 7) * Math.sin(-midAngle * RADIAN);

  // Horizontal end point
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

// ─────────────────────────────────────────────────────────────────────────────
// Beneficiaries Distribution Callout Label: displays figure + percentage on the same line
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Top Bar Label for Constituency Funds Disbursed vs Utilised grouped bar chart
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// White Inside Bar Label for Projects by Ward bar chart
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Multi-Select Dropdown with Checkboxes (Tick Boxes)
// Allows selecting 1, multiple, or all options with quick select-all/clear
// ─────────────────────────────────────────────────────────────────────────────
interface MultiSelectFilterProps {
  label: string;
  options: readonly string[] | string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  alignRight?: boolean;
}

function MultiSelectFilter({ label, options, selected, onChange, placeholder = 'All', alignRight = false }: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Selected items that actually belong to the available options for this filter
  const selectedInOptions = options.filter(opt => selected.includes(opt));
  const isAllSelected = options.length > 0 && options.every(opt => selected.includes(opt));
  const isNoneSelected = selectedInOptions.length === 0;

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(item => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const selectAll = () => {
    onChange(Array.from(new Set([...selected, ...options])));
  };

  const clearAll = () => {
    onChange(selected.filter(item => !options.includes(item)));
  };

  return (
    <div className="relative w-full min-w-0 max-w-full" ref={containerRef}>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full max-w-full text-xs rounded-lg px-2.5 py-2 text-left focus:outline-none bg-white text-gray-800 flex items-center justify-between gap-1 transition-all cursor-pointer min-w-0 ${
          !isAllSelected && !isNoneSelected ? 'border-[#145a32] ring-1 ring-[#145a32]/25' : ''
        }`}
        style={{ border: (!isAllSelected && !isNoneSelected) ? '1px solid #145a32' : '1px solid #00000040' }}
      >
        <span className="truncate flex-1 min-w-0">
          {isAllSelected ? (
            <span className="text-gray-800 font-medium truncate block">{placeholder}</span>
          ) : isNoneSelected ? (
            <span className="text-gray-400 italic truncate block">None selected</span>
          ) : selectedInOptions.length === 1 ? (
            <span className="font-semibold text-gray-800 truncate block">{selectedInOptions[0]}</span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-[#145a32] truncate">
              <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px] truncate">
                {selectedInOptions.length} selected
              </span>
            </span>
          )}
        </span>
        <ChevronDown size={13} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute top-full mt-1 w-64 max-w-[calc(100vw-2.5rem)] sm:max-w-xs bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-2.5 text-xs flex flex-col ${
          alignRight ? 'right-0' : 'left-0 sm:left-auto sm:right-0 md:right-0 lg:left-0'
        }`}>
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100 px-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400">
              {selectedInOptions.length} of {options.length} Selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[11px] text-[#145a32] font-semibold hover:underline cursor-pointer"
              >
                Select all
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-red-600 font-semibold hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-y-auto space-y-0.5 max-h-52 pr-1">
            {options.map(opt => {
              const checked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    checked ? 'bg-emerald-50/80 text-emerald-950 font-medium' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(opt)}
                    className="rounded border-gray-300 text-[#145a32] focus:ring-[#145a32] h-3.5 w-3.5 cursor-pointer accent-[#145a32]"
                  />
                  <span className="truncate text-xs">{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-2 mt-1.5 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 bg-[#145a32] text-white text-[11px] font-semibold rounded-lg hover:bg-[#0d3d22] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


const DEFAULT_BENEFICIARY_TYPES = [...BENEFICIARY_TYPES];
const DEFAULT_CONSTITUENCIES = [...CONSTITUENCIES];
const DEFAULT_WARDS = [...WARDS];
const DEFAULT_SECTORS_POOL = Array.from(new Set([...ALL_SECTORS, ...COMMUNITY_DEVELOPMENT_SECTORS, ...defaultProjects.map(p => p.sector)])).filter(Boolean).sort();
const DEFAULT_PROJECT_TYPES = [...PROJECT_TYPES];
const DEFAULT_COMPONENTS = [...CDF_COMPONENTS];

interface Props {
  onLoginClick: () => void;
  sharedProjects?: Project[];
  sharedMonitors?: Monitor[];
  sharedSubmissions?: MonitorSubmission[];
  users?: User[];
  setSharedFeedback?: React.Dispatch<React.SetStateAction<Feedback[]>>;
  setSysNotifs?: React.Dispatch<React.SetStateAction<SysNotification[]>>;
  sharedAnnouncements?: import('@/data').Announcement[];
  sharedWardStatusPhotos?: WardStatusPhoto[];
}

export default function PublicPortal({
  onLoginClick,
  sharedProjects,
  sharedMonitors,
  sharedSubmissions,
  users,
  setSharedFeedback,
  setSysNotifs,
  sharedAnnouncements,
  sharedWardStatusPhotos,
}: Props) {
  const projects = sharedProjects ?? defaultProjects;
  const monitors = sharedMonitors ?? defaultMonitors;
  const submissions = sharedSubmissions ?? defaultSubmissions;
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [constituencyFilter, setConstituencyFilter] = useState('All Constituencies');
  const [wardFilter, setWardFilter] = useState('All Wards');
  const [componentFilter, setComponentFilter] = useState('All Project Components');

  // Only constituencies and wards set on projects should be captured in filters
  const projectConstituencies = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.constituency).filter(Boolean))).sort();
  }, [projects]);

  const projectWards = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.ward).filter(Boolean))).sort();
  }, [projects]);

  // Available project components (defaults to CDF_COMPONENTS plus any custom project component)
  const projectComponentOptions = useMemo(() => {
    return Array.from(new Set([
      ...CDF_COMPONENTS,
      ...projects.filter(p => !isInitiative(p)).map(p => p.component).filter(Boolean),
    ])) as string[];
  }, [projects]);

  // Global overview filters (affect KPI cards and charts) - multi-select with tick boxes, all ticked by default
  const [ovBeneficiaryTypes, setOvBeneficiaryTypes] = useState<string[]>(() => Array.from(new Set([...DEFAULT_BENEFICIARY_TYPES, ...projects.map(p => getProjectBeneficiaryType(p)).filter(Boolean)])));
  const [ovConstituencies, setOvConstituencies] = useState<string[]>(() => Array.from(new Set(projects.map(p => p.constituency).filter(Boolean))).sort());
  const [ovWards, setOvWards] = useState<string[]>(() => Array.from(new Set(projects.map(p => p.ward).filter(Boolean))).sort());
  const [ovSectors, setOvSectors] = useState<string[]>(() => Array.from(new Set([...DEFAULT_SECTORS_POOL, ...projects.map(p => p.sector).filter(Boolean)])).sort());
  const [ovProjectTypes, setOvProjectTypes] = useState<string[]>(() => Array.from(new Set([...DEFAULT_PROJECT_TYPES, ...projects.map(p => p.projectType || 'CDF').filter(Boolean)])));
  const [ovComponents, setOvComponents] = useState<string[]>(() => Array.from(new Set([...DEFAULT_COMPONENTS, ...projects.map(p => p.component).filter(Boolean)])) as string[]);

  // Automatically include newly added project constituencies, wards, sectors and components in overview filters
  useEffect(() => {
    setOvConstituencies(prev => {
      const allC = Array.from(new Set(projects.map(p => p.constituency).filter(Boolean)));
      const toAdd = allC.filter(c => !prev.includes(c));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
    setOvWards(prev => {
      const allW = Array.from(new Set(projects.map(p => p.ward).filter(Boolean)));
      const toAdd = allW.filter(w => !prev.includes(w));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
    setOvSectors(prev => {
      const allS = Array.from(new Set(projects.map(p => p.sector).filter(Boolean)));
      const toAdd = allS.filter(s => !prev.includes(s));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
    setOvComponents(prev => {
      const allComp = Array.from(new Set([
        ...CDF_COMPONENTS,
        ...projects.filter(p => !isInitiative(p)).map(p => p.component).filter(Boolean),
      ])) as string[];
      const toAdd = allComp.filter(c => !prev.includes(c));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
    setOvProjectTypes(prev => {
      const allPt = Array.from(new Set(projects.map(p => p.projectType || 'CDF').filter(Boolean)));
      const toAdd = allPt.filter(t => !prev.includes(t));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
    setOvBeneficiaryTypes(prev => {
      const allBt = Array.from(new Set(projects.map(p => getProjectBeneficiaryType(p)).filter(Boolean)));
      const toAdd = allBt.filter(b => !prev.includes(b));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, [projects]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [fbType, setFbType] = useState('');
  const [fbProject, setFbProject] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [fbSubmitted, setFbSubmitted] = useState(false);

  function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const relatedProject = projects.find(p => p.id === fbProject);
    const newFb: Feedback = {
      id: `FB-${Date.now()}`,
      project: relatedProject?.name ?? 'General',
      projectId: fbProject,
      type: fbType,
      citizen: 'Anonymous',
      contact: '',
      date: today,
      message: fbMessage,
      status: 'Received',
      response: '',
      resolvedDate: '',
    };
    setSharedFeedback?.(prev => [newFb, ...prev]);
    setSysNotifs?.(prev => [{
      id: `SN-${Date.now()}`,
      for: 'admin' as const,
      type: 'submission' as const,
      title: 'New Citizen Feedback Received',
      message: `A citizen submitted feedback (${fbType || 'General'})${relatedProject ? ` on "${relatedProject.name}"` : ''}: "${fbMessage.slice(0, 80)}${fbMessage.length > 80 ? '…' : ''}"`,
      date: today,
      read: false,
      projectId: fbProject || undefined,
    }, ...prev]);
    setFbSubmitted(true);
  }

  const contentRef = useRef<HTMLDivElement>(null);

  function tr(key: string): string {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }

  function goToTab(id: string) {
    setActiveTab(id);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  // Notifications
  const [notifs, setNotifs] = useState<AppNotification[]>(appNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const desktopNotifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const clickedInsideDesktop = desktopNotifRef.current?.contains(target);
      const clickedInsideMobile = mobileNotifRef.current?.contains(target);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleNotifClick(n: AppNotification) {
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    if (n.projectId) {
      const targetProj = projects.find(p => p.id === n.projectId);
      if (targetProj) {
        setSelectedProject(targetProj);
        setNotifOpen(false);
      }
    }
  }

  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  function markAllRead() { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); }

  // Map state
  const [mapConstituency, setMapConstituency] = useState('All');
  const [mapWard, setMapWard] = useState('All');
  const [mapSector, setMapSector] = useState('All');
  const [mapStatus, setMapStatus] = useState('All');
  const [mapSelected, setMapSelected] = useState<Project | null>(null);

  const MAP_CONSTITUENCY_OPTS = ['All', ...projectConstituencies];
  const MAP_WARD_OPTS = ['All', ...(mapConstituency === 'All'
    ? projectWards
    : Array.from(new Set(projects.filter(p => p.constituency === mapConstituency).map(p => p.ward).filter(Boolean))).sort()
  )];
  const SECTOR_OPTS = ['All', ...ALL_SECTORS];
  const STATUS_OPTS = ['All', 'Ongoing', 'Completed', 'Near Completion', 'Not Started', 'Approved', 'Assessed', 'Proposed'];

  const handleMapConstituencyChange = (val: string) => {
    setMapConstituency(val);
    if (val !== 'All') {
      const allowed = Array.from(new Set(projects.filter(p => p.constituency === val).map(p => p.ward).filter(Boolean)));
      if (mapWard !== 'All' && !allowed.includes(mapWard)) {
        setMapWard('All');
      }
    }
  };

  function getRawPosition(projectId: string): { top: number; left: number } {
    if (MAP_POSITIONS[projectId]) return MAP_POSITIONS[projectId];
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      hash = ((hash * 31) + projectId.charCodeAt(i)) & 0xffff;
    }
    return { top: 10 + (hash % 70), left: 15 + ((hash >> 4) % 65) };
  }

  // Spread markers that are too close to each other (min 7% apart)
  function spreadPositions(ids: string[]): Record<string, { top: number; left: number }> {
    const positions: Record<string, { top: number; left: number }> = {};
    for (const id of ids) {
      let pos = { ...getRawPosition(id) };
      let attempts = 0;
      while (attempts < 30) {
        const tooClose = Object.values(positions).some(p =>
          Math.abs(p.top - pos.top) < 7 && Math.abs(p.left - pos.left) < 7
        );
        if (!tooClose) break;
        pos = { top: Math.max(5, Math.min(88, pos.top + (attempts % 2 === 0 ? 7 : -7))), left: Math.max(5, Math.min(88, pos.left + (attempts % 3 === 0 ? 8 : -8))) };
        attempts++;
      }
      positions[id] = pos;
    }
    return positions;
  }

  const visibleMapProjects = projects.filter(p => {
    const constituencyOk = mapConstituency === 'All' || p.constituency === mapConstituency;
    const wardOk = mapWard === 'All' || p.ward === mapWard;
    const sectorOk = mapSector === 'All' || p.sector === mapSector;
    const statusOk = mapStatus === 'All' || p.status === mapStatus;
    return constituencyOk && wardOk && sectorOk && statusOk;
  });
  // Spread markers so they don't overlap, recomputed when filters change
  const spreadPos = React.useMemo(() => spreadPositions(visibleMapProjects.map(p => p.id)), [visibleMapProjects.map(p => p.id).join(',')]);
  function getMapPosition(id: string) { return spreadPos[id] ?? getRawPosition(id); }

  const BENEFICIARY_TYPES_FILTER = ['All Beneficiary Types', ...BENEFICIARY_TYPES];
  const DISTRICTS_FILTER = ['All Districts', ...DISTRICTS];
  const CONSTITUENCIES_FILTER = ['All Constituencies', ...projectConstituencies];

  // Wards for Projects tab: when a constituency is selected, only show wards of that constituency that exist in projects
  const availableProjectWards = useMemo(() => {
    if (constituencyFilter === 'All Constituencies') {
      return projectWards;
    }
    return Array.from(
      new Set(
        projects
          .filter(p => p.constituency === constituencyFilter)
          .map(p => p.ward)
          .filter(Boolean)
      )
    ).sort();
  }, [projects, constituencyFilter, projectWards]);

  const WARDS_FILTER = ['All Wards', ...availableProjectWards];

  const handleConstituencyFilterChange = (newC: string) => {
    setConstituencyFilter(newC);
    if (newC === 'All Constituencies') {
      if (wardFilter !== 'All Wards' && !projectWards.includes(wardFilter)) {
        setWardFilter('All Wards');
      }
    } else {
      const validWards = Array.from(
        new Set(projects.filter(p => p.constituency === newC).map(p => p.ward).filter(Boolean))
      );
      if (wardFilter !== 'All Wards' && !validWards.includes(wardFilter)) {
        setWardFilter('All Wards');
      }
    }
  };

  const ALL_SECTORS_POOL = Array.from(new Set([...ALL_SECTORS, ...COMMUNITY_DEVELOPMENT_SECTORS, ...projects.map(p => p.sector)])).filter(Boolean).sort();
  const SECTORS_FILTER = ['All Sectors', ...ALL_SECTORS_POOL];
  const PROJECT_TYPES_FILTER = ['All Project Types', ...PROJECT_TYPES];
  const COMPONENTS_FILTER = ['All Components', ...CDF_COMPONENTS];
  const STATUS_FILTER = ['All Statuses', 'Ongoing', 'Completed', 'Near Completion', 'Not Started', 'Approved', 'Assessed'];
  const MONITOR_OPTS = ['All Monitors', ...monitors.map(m => m.name)];

  // Projects table filter
  const filteredProjects = projects.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = !s || p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.location.toLowerCase().includes(s);
    const matchSector = sectorFilter === 'All Sectors' || p.sector === sectorFilter;
    const matchStatus = statusFilter === 'All Statuses' || p.status === statusFilter;
    const matchConstituency = constituencyFilter === 'All Constituencies' || p.constituency === constituencyFilter;
    const matchWard = wardFilter === 'All Wards' || p.ward === wardFilter;
    const matchComponent =
      componentFilter === 'All Project Components' ||
      componentFilter === 'All Components' ||
      componentFilter === 'All' ||
      p.component === componentFilter;
    return matchSearch && matchSector && matchStatus && matchConstituency && matchWard && matchComponent;
  });

  // Overview global filter - drives KPI cards, bar chart, donut chart
  const ovProjects = projects.filter(p => {
    const bType = getProjectBeneficiaryType(p);
    const bOk = ovBeneficiaryTypes.includes(bType);
    const cOk = ovConstituencies.includes(p.constituency);
    const wOk = ovWards.includes(p.ward);
    const sOk = ovSectors.includes(p.sector);
    const tOk = ovProjectTypes.includes(p.projectType || 'CDF');
    
    // Project Component matching: when all components are selected, all items pass.
    // If specific components are selected, check p.component or initiativeComponent.
    const allComponentsSelected = projectComponentOptions.every(c => ovComponents.includes(c));
    let compOk = false;
    if (allComponentsSelected) {
      compOk = true;
    } else if (isInitiative(p)) {
      compOk = ovComponents.includes(p.component || '') || ovComponents.includes(p.initiativeComponent || '');
    } else {
      const pComp = p.component || 'Community Development Project';
      compOk = ovComponents.includes(pComp);
    }
    return bOk && cOk && wOk && sOk && tOk && compOk;
  });

  const ovProjectItems = ovProjects.filter(p => !isInitiative(p));
  const ovInitiativeItems = ovProjects.filter(p => isInitiative(p));

  // Wards available in Overview Tab based on selected ovConstituencies
  const availableOvWards = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .filter(p => ovConstituencies.includes(p.constituency))
          .map(p => p.ward)
          .filter(Boolean)
      )
    ).sort();
  }, [projects, ovConstituencies]);

  const handleOvConstituenciesChange = (newC: string[]) => {
    setOvConstituencies(newC);
    const validWards = Array.from(
      new Set(projects.filter(p => newC.includes(p.constituency)).map(p => p.ward).filter(Boolean))
    );
    setOvWards(prev => prev.filter(w => validWards.includes(w)));
  };

  const hasChangedOvFilters =
    ovBeneficiaryTypes.length !== DEFAULT_BENEFICIARY_TYPES.length ||
    ovConstituencies.length !== projectConstituencies.length ||
    ovWards.length !== projectWards.length ||
    ovSectors.length !== DEFAULT_SECTORS_POOL.length ||
    ovProjectTypes.length !== DEFAULT_PROJECT_TYPES.length ||
    !projectComponentOptions.every(c => ovComponents.includes(c));

  const resetOvFilters = () => {
    setOvBeneficiaryTypes([...DEFAULT_BENEFICIARY_TYPES]);
    setOvConstituencies([...projectConstituencies]);
    setOvWards([...projectWards]);
    setOvSectors([...DEFAULT_SECTORS_POOL]);
    setOvProjectTypes([...DEFAULT_PROJECT_TYPES]);
    setOvComponents([...projectComponentOptions]);
  };

  // Dynamic KPI values (change with overview filters)
  const totalBudget = ovProjects.reduce((s, p) => s + p.budget, 0);
  const totalBenef = ovProjects.reduce((s, p) => s + p.beneficiaries, 0);
  const completed = ovProjects.filter(p => p.status === 'Completed').length;
  const ongoing = ovProjects.filter(p => ['Ongoing', 'Near Completion'].includes(p.status)).length;
  // Total Projects and Total Initiatives count
  const totalConstituencyProjects = ovProjectItems.length;
  const totalProjectInitiatives = ovInitiativeItems.length;
  // Total Funds Disbursed aggregates disbursement across CDF and Other Projects in current selection
  const totalFundsDisbursed = ovProjects.reduce((s, p) => s + getProjectDisbursed(p), 0);

  // Beneficiaries Distribution data (breakdown across beneficiary target groups)
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

  const dynamicBeneficiaryDistribution = React.useMemo(() => {
    const map: Record<string, number> = {};
    ovProjects.forEach(p => {
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
  }, [ovProjects]);
  const totalBeneficiariesInDistribution = dynamicBeneficiaryDistribution.reduce((acc, curr) => acc + curr.value, 0);

  // Grouped bar chart: Funds Utilised vs Disbursed by Constituency
  const constituencyFundsData = React.useMemo(() => {
    const constituencyMap: Record<string, {
      constituency: string;
      constituencyShort: string;
      disbursed: number;
      utilised: number;
      budget: number;
      projectCount: number;
    }> = {};

    ovProjects.forEach(p => {
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
  }, [ovProjects]);

  // Dynamic bar chart data (projects by ward)
  const activeWardsWithProjects = Array.from(new Set(ovProjects.map(p => p.ward))).filter(Boolean);
  const dynamicWardData = (activeWardsWithProjects.length > 0 ? activeWardsWithProjects : ['Likoma North Ward', 'Likoma South Ward', 'Chizumulu North Ward', 'Chizumulu South Ward']).map(ward => {
    const wardProjects = ovProjects.filter(p => p.ward === ward);
    return {
      ward: ward.replace('Chizumulu ', 'Chiz. ').replace('Likoma ', 'Lik. ').replace(' Ward', ''),
      total: wardProjects.length,
      ongoing: wardProjects.filter(p => ['Ongoing', 'Near Completion'].includes(p.status)).length,
      completed: wardProjects.filter(p => p.status === 'Completed').length,
      notStarted: wardProjects.filter(p => ['Not Started', 'Approved', 'Assessed', 'Proposed'].includes(p.status)).length,
    };
  });

  const dynamicSectorData = ALL_SECTORS_POOL
    .map(sec => ({ name: sec, value: ovProjects.filter(p => p.sector === sec).length }))
    .filter(s => s.value > 0);
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
  };
  const totalSectorProjects = dynamicSectorData.reduce((s, d) => s + d.value, 0);

  const filteredDocs = publicDocuments.filter(d =>
    d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
    d.type.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex flex-col">

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <header className="bg-[#145a32] text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4" style={{ height: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Desktop: Logo LEFT | Tabs CENTER | Controls RIGHT */}
          <div className="hidden md:flex items-center" style={{ height: '65px' }}>
            {/* Left: Logo - fixed-height container so logo size never pushes the bar */}
            <div className="flex-shrink-0 flex items-center" style={{ height: '65px', overflow: 'hidden' }}>
              <Logo className="h-18 brightness-0 invert" />
            </div>

            {/* Center: Nav tabs - flex-1 on both sides pushes tabs to true center */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-0.5">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => goToTab(t.id)}
                    style={activeTab === t.id ? { background: 'white', color: '#016630', borderRadius: '0.2rem' } : { borderRadius: '0.2rem' }}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === t.id
                        ? 'shadow-sm'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.icon} {tr(t.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {/* Language */}
              <div className="relative">
                <button onClick={() => setLangOpen(v => !v)} className="flex items-center gap-1 text-xs text-white/80 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10">
                  <Globe size={13} />
                  <span>{LANGS.find(l => l.code === lang)?.short}</span>
                  <ChevronDown size={11} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-32 z-50">
                    {LANGS.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${lang === l.code ? 'font-semibold text-[#145a32]' : 'text-gray-700'}`}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications bell */}
              <div className="relative" ref={desktopNotifRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(v => !v)}
                  className="relative p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">{unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-gray-800">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-900 text-sm">{tr('Notifications')}</span>
                      {unreadCount > 0 && <button type="button" onClick={markAllRead} className="text-xs text-[#145a32] font-semibold hover:underline">{tr('Mark all read')}</button>}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifs.length === 0 && <div className="py-8 text-center text-gray-400 text-sm">{tr('No notifications')}</div>}
                      {notifs.map(n => (
                        <div key={n.id} onClick={() => handleNotifClick(n)} className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-green-50/60' : ''}`}>
                          <div className="flex-shrink-0 mt-0.5"><NotifTypeIcon type={n.type} /></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug mb-0.5 ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                            <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-[#145a32] flex-shrink-0 mt-1.5" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={onLoginClick} className="flex items-center gap-1.5 bg-[#00cc00] hover:bg-[#00aa00] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors ml-3.5">
                <LogIn size={13} /> {tr('Staff Login')}
              </button>
            </div>
          </div>

          {/* Mobile: hamburger + logo + controls */}
          <div className="flex md:hidden items-center justify-between" style={{ height: '65px' }}>
            <div className="flex items-center gap-2" style={{ height: '65px', overflow: 'hidden' }}>
              <button onClick={() => setMobileMenuOpen(v => !v)} className="p-1 text-white/80 hover:text-white flex-shrink-0">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Logo className="h-18 brightness-0 invert" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="relative" ref={mobileNotifRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(v => !v)}
                  className="relative p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <>
                    {/* Mobile backdrop */}
                    <div
                      className="fixed inset-0 bg-black/25 z-40"
                      onClick={() => setNotifOpen(false)}
                      onMouseDown={() => setNotifOpen(false)}
                    />
                    <div className="fixed inset-x-3.5 top-[68px] max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-800">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-semibold text-gray-900 text-sm">{tr('Notifications')}</span>
                        {unreadCount > 0 && <button type="button" onClick={markAllRead} className="text-xs text-[#145a32] font-semibold hover:underline">{tr('Mark all read')}</button>}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifs.length === 0 && <div className="py-8 text-center text-gray-400 text-sm">{tr('No notifications')}</div>}
                        {notifs.map(n => (
                          <div key={n.id} onClick={() => handleNotifClick(n)} className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-green-50/60' : ''}`}>
                            <div className="flex-shrink-0 mt-0.5"><NotifTypeIcon type={n.type} /></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug mb-0.5 ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-[#145a32] flex-shrink-0 mt-1.5" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button onClick={onLoginClick} style={{ borderRadius: '0.2rem' }} className="flex items-center gap-1 bg-[#00cc00] text-white text-xs font-semibold px-2.5 py-1.5 ml-2">
                <LogIn size={12} /> Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION - auto-sliding 3-image slider ─────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: '72vh' }}>
        {HERO_IMAGES.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Community development"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === heroSlide ? 1 : 0 }}
          />
        ))}
        {/* Dark tint overlay so text is always legible */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white py-8">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)' }}
          >
            {tr('heroTitle').split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </h1>
          <p
            className="text-base sm:text-lg font-bold text-white max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
          >
            {tr('heroDesc')}
          </p>
        </div>
        {/* Slide indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className="h-1.5 rounded-full transition-all duration-300 bg-white"
              style={{ width: i === heroSlide ? '24px' : '8px', opacity: i === heroSlide ? 1 : 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[#145a32] w-64 h-full p-6 flex flex-col gap-1" onClick={e => e.stopPropagation()}>
            <Logo className="h-12 brightness-0 invert mb-4" />
            {TABS.map(t => (
              <button key={t.id} onClick={() => { goToTab(t.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 text-sm py-2.5 px-3 rounded-lg ${activeTab === t.id ? 'bg-white/15 text-white font-semibold' : 'text-white/80'}`}>
                {t.icon} {tr(t.label)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div ref={contentRef} className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* ── Global Filter Bar ──────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overview Filters</span>
                </div>
                {hasChangedOvFilters && (
                  <button onClick={resetOvFilters} className="text-xs text-[#145a32] font-semibold hover:underline cursor-pointer">
                    Reset filters
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {/* Beneficiary Type Filter */}
                <MultiSelectFilter
                  label="Beneficiary Type"
                  options={BENEFICIARY_TYPES}
                  selected={ovBeneficiaryTypes}
                  onChange={setOvBeneficiaryTypes}
                  placeholder="All Beneficiary Types"
                />

                {/* Constituency Filter */}
                <MultiSelectFilter
                  label="Constituency"
                  options={projectConstituencies}
                  selected={ovConstituencies}
                  onChange={handleOvConstituenciesChange}
                  placeholder="All Constituencies"
                />

                {/* Ward Filter */}
                <MultiSelectFilter
                  label="Ward"
                  options={availableOvWards}
                  selected={ovWards.filter(w => availableOvWards.includes(w))}
                  onChange={setOvWards}
                  placeholder="All Wards"
                />

                {/* Sector Filter */}
                <MultiSelectFilter
                  label="Sector"
                  options={ALL_SECTORS_POOL}
                  selected={ovSectors}
                  onChange={setOvSectors}
                  placeholder="All Sectors"
                />

                {/* Project Type / Initiative Filter */}
                <MultiSelectFilter
                  label="Project Type/Initiative"
                  options={PROJECT_TYPES}
                  selected={ovProjectTypes}
                  onChange={setOvProjectTypes}
                  placeholder="All Project Types"
                  alignRight={true}
                />

                {/* Project Component Filter */}
                <MultiSelectFilter
                  label="Project Component"
                  options={projectComponentOptions}
                  selected={ovComponents}
                  onChange={setOvComponents}
                  placeholder="All Project Components"
                  alignRight={true}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{tr('kpiHeading')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label={tr('Total Projects')} value={String(totalConstituencyProjects)} icon={<FolderKanban size={28} />} />
              <StatCard label={tr('Completed Projects')} value={String(completed)} icon={<CheckCircle2 size={28} />} />
              <StatCard label={tr('Ongoing Projects')} value={String(ongoing)} icon={<Activity size={28} />} />
              <StatCard label={tr('Total Budget')} value={formatMK(totalBudget)} icon={<Wallet size={28} />} />
              <StatCard label={tr('Beneficiaries')} value={totalBenef.toLocaleString()} icon={<Users size={28} />} />
              <StatCard label={tr('Sectors')} value={String(dynamicSectorData.length)} icon={<LayoutGrid size={28} />} />
              <StatCard label={tr('Total Initiatives')} value={String(totalProjectInitiatives)} icon={<Layers size={28} />} />
              <StatCard label={tr('Total Funds Disbursed')} value={formatMK(totalFundsDisbursed)} icon={<Banknote size={28} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="px-2.5 sm:px-4 py-3 sm:py-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">{tr('Projects by Ward')}</p>
                {dynamicWardData.every(d => d.total === 0) ? (
                  <p className="text-sm text-gray-400 text-center py-10">No projects match the selected filters.</p>
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
                          <Bar dataKey="ongoing" name="Ongoing" fill="#2563eb" radius={[4,4,0,0]}>
                            <LabelList dataKey="ongoing" content={renderWardBarInsideLabel} />
                          </Bar>
                          <Bar dataKey="completed" name="Completed" fill="#16a34a" radius={[4,4,0,0]}>
                            <LabelList dataKey="completed" content={renderWardBarInsideLabel} />
                          </Bar>
                          <Bar dataKey="notStarted" name="Not Started" fill="#9ca3af" radius={[4,4,0,0]}>
                            <LabelList dataKey="notStarted" content={renderWardBarInsideLabel} />
                          </Bar>
                          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </Card>
              <Card className="px-2.5 sm:px-4 py-3 sm:py-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">{tr('Projects by Sector')}</p>
                {dynamicSectorData.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">No projects match the selected filters.</p>
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
                          <p className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{totalSectorProjects}</p>
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
              </Card>
            </div>

            {/* Beneficiaries Distribution (Donut chart) & Constituency Ward Initiatives (Line and Clustered Column chart) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="px-2.5 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{tr('Beneficiaries Distribution')}</p>
                    <p className="text-xs text-gray-400">Total estimated reach across target groups</p>
                  </div>
                </div>
                {dynamicBeneficiaryDistribution.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">No beneficiaries data for selected filters.</p>
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
                            {(totalBeneficiariesInDistribution > 0 ? totalBeneficiariesInDistribution : 36570).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full min-w-0 flex flex-row flex-nowrap justify-start items-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 overflow-x-auto px-1 py-1 scroll-smooth">
                      {dynamicBeneficiaryDistribution.map((b, i) => {
                        const color = BENEFICIARY_COLORS[b.name] ?? CHART_COLORS[i % CHART_COLORS.length];
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
              </Card>

              <Card className="px-2.5 sm:px-4 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{tr('Funds Disbursed vs Utilised')}</p>
                    <p className="text-xs text-gray-400">{tr('Funds Disbursed vs Utilised Subtitle')}</p>
                  </div>
                </div>

                {constituencyFundsData.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">No financial data available for selected filters.</p>
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
                              name={tr('Amount Disbursed')}
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
                              name={tr('Amount Utilised')}
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
                        <span>{tr('Amount Disbursed')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#016630] inline-block" />
                        <span>{tr('Amount Utilised')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Monitor Activity Trend (commented out)
            <Card>
              <p className="text-sm font-semibold text-gray-700 mb-3">{tr('Monitor Activity Trend')}</p>
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
            </Card>
            */}

            {/* ── Wards Projects Overview Carousel ─────── */}
            <ProjectsOverviewCarousel
              allProjects={ovProjectItems}
              submissions={submissions}
              wardStatusPhotos={sharedWardStatusPhotos}
              onFeedback={(projectId) => {
                setFbProject(projectId);
                goToTab('feedback');
              }}
            />

            {/* ── Wards Initiatives Overview Carousel ─────── */}
            <WardsInitiativesOverviewCarousel
              allProjects={ovInitiativeItems}
              submissions={submissions}
              wardStatusPhotos={sharedWardStatusPhotos}
              onFeedback={(projectId) => {
                setFbProject(projectId);
                goToTab('feedback');
              }}
            />

            {/* SUPPORTED BY SECTION */}
            <div className="mt-2 text-center">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Supported by:
                </h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 flex items-center justify-center">
                <PartnerLogo className="h-10 sm:h-12 w-auto max-w-[340px] sm:max-w-[420px]" />
              </div>
            </div>
          </>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <>
            <div className="flex flex-col xl:flex-row gap-2.5 w-full max-w-full min-w-0">
              <div className="relative flex-1 min-w-0 max-w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {/* Responsive filters: stacked/grid on mobile and tablet, inline row on desktop (xl) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:flex-row items-center gap-2 w-full xl:w-auto min-w-0 max-w-full">
                {[
                  { value: constituencyFilter, set: handleConstituencyFilterChange, opts: CONSTITUENCIES_FILTER, isComponent: false },
                  { value: wardFilter, set: setWardFilter, opts: WARDS_FILTER, isComponent: false },
                  { value: sectorFilter, set: setSectorFilter, opts: SECTORS_FILTER, isComponent: false },
                  { value: componentFilter, set: setComponentFilter, opts: ['All Project Components', ...CDF_COMPONENTS], isComponent: true },
                  { value: statusFilter, set: setStatusFilter, opts: STATUS_FILTER, isComponent: false },
                ].map((f, i) => (
                  <div key={i} className={`relative w-full ${f.isComponent ? 'xl:w-56' : 'xl:w-auto'} min-w-0 max-w-full`}>
                    <select
                      className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32] w-full max-w-full truncate cursor-pointer"
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                    >
                      {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">{filteredProjects.length} projects found</p>

            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                  {['Project Name','Sector','Ward','Status','Progress','Budget'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredProjects.map(p => {
                    const prog = realisticProgress(p.status, p.progress);
                    return (
                      <tr key={p.id} onClick={() => setSelectedProject(p)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[240px] truncate">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{p.sector}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{p.ward}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3 w-36">
                          <div className="flex items-center gap-2">
                            <ProgressBar value={prog} />
                            <span className="text-xs text-gray-500 whitespace-nowrap">{prog}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-xs">{formatMK(p.budget)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredProjects.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No projects match your search.</div>}
            </div>

            <div className="md:hidden space-y-3">
              {filteredProjects.map(p => {
                const prog = realisticProgress(p.status, p.progress);
                return (
                  <div key={p.id} onClick={() => setSelectedProject(p)} className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-400">{p.sector}</p></div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="flex items-center gap-2 mb-1"><ProgressBar value={prog} /><span className="text-xs text-gray-500 whitespace-nowrap">{prog}%</span></div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500"><span>{p.ward}</span><span>{formatMK(p.budget)}</span></div>
                  </div>
                );
              })}
            </div>

            {selectedProject && (
              <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-10 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mb-10">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>{selectedProject.name}</h3>
                    </div>
                    <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2"><StatusBadge status={selectedProject.status} /><span className="text-xs text-gray-500">{selectedProject.sector}</span></div>
                    {(() => { const prog = realisticProgress(selectedProject.status, selectedProject.progress); return <div className="flex items-center gap-2"><ProgressBar value={prog} className="flex-1" /><span className="text-xs font-semibold text-gray-700">{prog}%</span></div>; })()}
                    <p className="text-sm text-gray-700">{selectedProject.description}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {[
                        ['Location', selectedProject.location], ['Ward', selectedProject.ward],
                        ['Budget', formatMK(selectedProject.budget)], ['Beneficiaries', selectedProject.beneficiaries.toLocaleString()],
                        ['Beneficiary Type', getProjectBeneficiaryType(selectedProject)],
                        ['Contractor', selectedProject.contractor], ['Monitor', selectedProject.monitor],
                        ['Expected Completion', selectedProject.expectedCompletion], ['Funding Source', selectedProject.fundingSource],
                      ].map(([l, v]) => (<div key={l}><p className="text-[10px] font-bold text-black uppercase tracking-wide">{l}</p><p className="text-xs text-gray-900 font-medium">{v || '—'}</p></div>))}
                    </div>
                    <div className="pt-2">
                      <button onClick={() => { setSelectedProject(null); goToTab('feedback'); }} className="w-full bg-[#145a32] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0f4424] transition-colors">
                        Submit Feedback on this Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* MAP */}
        {activeTab === 'map' && (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Project Location Map</h2>
              <p className="text-sm text-gray-500">Click on a marker to view project details. Use filters to narrow down visible projects.</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {[
                { label: 'Constituency', value: mapConstituency, set: handleMapConstituencyChange, opts: MAP_CONSTITUENCY_OPTS },
                { label: 'Ward', value: mapWard, set: setMapWard, opts: MAP_WARD_OPTS },
                { label: 'Sector', value: mapSector, set: setMapSector, opts: SECTOR_OPTS },
                { label: 'Status', value: mapStatus, set: setMapStatus, opts: STATUS_OPTS },
              ].map(f => (
                <div key={f.label} className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-7 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#145a32]" value={f.value} onChange={e => f.set(e.target.value)}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              ))}
              <span className="text-xs text-gray-500">Showing {visibleMapProjects.length} / {projects.length} projects</span>
              {mapSelected && (
                <button onClick={() => setMapSelected(null)} className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <X size={12} /> Clear selection
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Map */}
              <div className="relative rounded-2xl border border-green-200 shadow-md flex-1 min-h-[320px]" style={{ height: 'clamp(320px, 50vw, 500px)' }}>
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img src={mapBgImage} alt="Map" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0" style={{ background: 'rgba(240,253,244,0.30)' }} />
                </div>

                {/* Project pins */}
                {visibleMapProjects.map(p => {
                  const pos = getMapPosition(p.id);
                  const color = STATUS_COLORS[p.status] ?? '#9ca3af';
                  const isSelected = mapSelected?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setMapSelected(prev => prev?.id === p.id ? null : p)}
                      className="absolute z-10 group focus:outline-none"
                      style={{ top: `${pos.top}%`, left: `${pos.left}%`, transform: 'translate(-50%, -100%)' }}
                      title={p.name}
                    >
                      <div className={`transition-transform drop-shadow-md ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
                        <svg width="24" height="30" viewBox="0 0 22 28" fill="none">
                          <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 17 11 17S22 19.25 22 11C22 4.925 17.075 0 11 0z" fill={color} stroke="white" strokeWidth="1.5" />
                          <circle cx="11" cy="11" r="4.5" fill="white" fillOpacity="0.95" />
                        </svg>
                      </div>
                    </button>
                  );
                })}

                {/* Legend - desktop only inside map */}
                <div className="hidden sm:block absolute bottom-3 right-3 bg-white/92 backdrop-blur-sm rounded-xl p-3 z-10 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-600 mb-2">Status Legend</p>
                  <div className="space-y-1">
                    {[['Completed', '#16a34a'], ['Near Completion', '#d97706'], ['Ongoing', '#2563eb'], ['Not Started', '#9ca3af'], ['Approved', '#0891b2'], ['Assessed', '#7c3aed']].map(([label, color]) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm" style={{ background: color }} />
                        <span className="text-[10px] text-gray-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile-only legend below map */}
              <div className="sm:hidden bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="text-[10px] font-bold text-gray-600 mb-2">Status Legend</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {[['Completed', '#16a34a'], ['Near Completion', '#d97706'], ['Ongoing', '#2563eb'], ['Not Started', '#9ca3af'], ['Approved', '#0891b2'], ['Assessed', '#7c3aed']].map(([label, color]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm" style={{ background: color }} />
                      <span className="text-[10px] text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side detail panel */}
              <div className={`md:w-72 transition-all duration-300 ${mapSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {mapSelected ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-md h-full flex flex-col">
                    <div className="flex items-start justify-between p-4 border-b border-gray-100">
                      <div>
                        <div className="mb-2"><StatusBadge status={mapSelected.status} /></div>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{mapSelected.name}</h4>
                      </div>
                      <button onClick={() => setMapSelected(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"><X size={16} /></button>
                    </div>
                    <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                      {(() => { const prog = realisticProgress(mapSelected.status, mapSelected.progress); return (<div className="mb-3"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span className="font-semibold">{prog}%</span></div><ProgressBar value={prog} /></div>); })()}
                      {[
                        ['Sector', mapSelected.sector], ['Ward', mapSelected.ward],
                        ['Location', mapSelected.location], ['Budget', formatMK(mapSelected.budget)],
                        ['Beneficiaries', mapSelected.beneficiaries.toLocaleString()],
                        ['Beneficiary Type', getProjectBeneficiaryType(mapSelected)],
                        ['Contractor', mapSelected.contractor], ['Monitor', mapSelected.monitor],
                        ['Exp. Completion', mapSelected.expectedCompletion],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-xs border-b border-gray-50 pb-1.5">
                          <span className="text-gray-400">{l}</span>
                          <span className="text-gray-800 font-medium text-right max-w-[150px] truncate">{v || '—'}</span>
                        </div>
                      ))}
                      {mapSelected.description && <p className="text-xs text-gray-600 leading-relaxed pt-1">{mapSelected.description}</p>}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <button onClick={() => { setSelectedProject(mapSelected); goToTab('projects'); setMapSelected(null); }} className="w-full text-sm text-white font-semibold bg-[#145a32] hover:bg-[#0f4424] py-2.5 rounded-xl transition-colors">
                        View Full Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/60 rounded-2xl border border-dashed border-gray-200 h-48 flex items-center justify-center md:h-full">
                    <div className="text-center text-gray-400 p-6">
                      <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Click a map marker<br />to view project details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (() => {
          const pubAnnouncements = (sharedAnnouncements ?? announcements).filter(a => a.published);
          // Desktop: 2 per slide, Mobile: 1 per slide
          const desktopAnSlides: typeof pubAnnouncements[] = [];
          for (let i = 0; i < pubAnnouncements.length; i += 2) desktopAnSlides.push(pubAnnouncements.slice(i, i + 2));
          const mobileAnSlides = pubAnnouncements.map(a => [a]);
          return (
            <AnnouncementsCarousel
              desktopSlides={desktopAnSlides}
              mobileSlides={mobileAnSlides}
              total={pubAnnouncements.length}
              tr={tr}
            />
          );
        })()}

        {/* FEEDBACK */}
        {activeTab === 'feedback' && (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{tr('Citizen Feedback')}</h2>
              <p className="text-sm text-gray-500">{tr('Submit feedback concern, suggestion or observation')}</p>
            </div>

            <Card>
              <h3 className="font-semibold text-gray-800 text-sm mb-3">{tr('Feedback Tracking Board')}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-max w-full text-xs">
                  <thead><tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    {['Feedback ID','Type','Project','Date Submitted','Status'].map(h => <th key={h} className="text-left px-3 py-2.5 font-medium whitespace-nowrap">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {feedback.map(f => (
                      <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-3 py-3 font-mono text-gray-500 whitespace-nowrap">{f.id}</td>
                        <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{f.type}</td>
                        <td className="px-3 py-3 text-gray-700 max-w-[140px] truncate">{f.project}</td>
                        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{f.date}</td>
                        <td className="px-3 py-3 whitespace-nowrap"><FbStatusBadge status={f.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-800 text-sm mb-4">{tr('Submit New Feedback')}</h3>
              {fbSubmitted ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center mx-auto mb-3">
                    <CheckIcon size={56} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{tr('Feedback Submitted!')}</h4>
                  <p className="text-sm text-gray-500 mb-4">Your feedback has been received by the Council. Track its status in the table above.</p>
                  <button onClick={() => { setFbSubmitted(false); setFbType(''); setFbProject(''); setFbMessage(''); }} className="bg-[#145a32] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#0f4424] transition-colors">{tr('Submit Another')}</button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{tr('Feedback Type')}</label>
                      <select required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" value={fbType} onChange={e => setFbType(e.target.value)}>
                        <option value="">{tr('Select type')}</option>
                        {['Progress Observation','Project Information Correction','Location Correction','Request for Information','Community Suggestion','General Feedback'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Related Project (Optional)</label>
                      <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" value={fbProject} onChange={e => setFbProject(e.target.value)}>
                        <option value="">Select project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Observation / Message *</label>
                    <textarea required rows={4} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder="Describe your observation clearly and concisely..." value={fbMessage} onChange={e => setFbMessage(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full bg-[#145a32] text-white font-semibold py-3 rounded-xl hover:bg-[#0f4424] transition-colors text-sm">{tr('Submit Feedback')}</button>
                </form>
              )}
            </Card>
          </>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{tr('Public Documents')}</h2>
              <p className="text-sm text-gray-500">{tr('Download project reports, guidelines')}</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#145a32]" placeholder={tr('Search documents...')} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                    {['Document Name','Type','Project','Date','Size','Action'].map(h => <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredDocs.map(d => (
                      <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{d.type}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{d.project}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{d.size}</td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 text-xs text-[#145a32] font-semibold hover:underline">
                            <Download size={12} /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDocs.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No documents match your search.</div>}
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#145a32] text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo className="h-18 brightness-0 invert mb-3" />
            <p className="text-xs text-white/60 leading-relaxed">Empowering communities through transparent and accountable development fund management.</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Quick Links</p>
            <div className="space-y-1.5">
              {TABS.map(t => <button key={t.id} onClick={() => goToTab(t.id)} className="block text-xs text-white/60 hover:text-white">{t.label}</button>)}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Contact</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/60"><Phone size={12} /><span>+265 889 87 64 93</span></div>
              <div className="flex items-start gap-2 text-xs text-white/60"><Mail size={12} className="flex-shrink-0 mt-0.5" /><span>officemnyip@gmail.com | info@malawianationalyouth.org</span></div>
              <div className="flex items-start gap-2 text-xs text-white/60"><MapPin size={12} className="flex-shrink-0 mt-0.5" /><span>ARET House, Mchengautuba,<br />Mzuzu, Malawi</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-3">
          <p className="text-xs text-white/40">&copy; 2026 Council Yanga. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
