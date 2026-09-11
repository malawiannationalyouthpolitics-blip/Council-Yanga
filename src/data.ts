export type ProjectStatus =
  | 'Proposed'
  | 'Assessed'
  | 'Approved'
  | 'Not Started'
  | 'Ongoing'
  | 'Near Completion'
  | 'Completed'
  | 'Suspended'
  | 'On Hold'
  | 'Stalled';

export interface Project {
  id: string;
  name: string;
  initiativeName?: string;
  initiativeComponent?: string;
  itemType?: 'Project' | 'Initiative';
  projectType?: string; // 'CDF' | 'Other Projects'
  component?: string;   // 'Community Development Project' | 'District-Wide Project' | etc.
  region?: string;      // 'Northern' | 'Central' | 'Southern'
  district?: string;    // 'Likoma' etc.
  beneficiaryType?: string; // 'Sports, creative arts & Innovation' | 'Women Entrepreneurs' | 'Youth Entrepreneurs' | 'Students' | 'District-Wide'
  description: string;
  objectives: string;
  sector: string;
  constituency: string;
  ward: string;
  traditionalAuthority: string;
  location: string;
  gpsLat: string;
  gpsLng: string;
  beneficiaries: number;
  budget: number;
  disbursed?: number;
  fundingSource: string;
  approvalDate: string;
  startDate: string;
  expectedCompletion: string;
  actualCompletion: string;
  status: ProjectStatus;
  progress: number;
  implementingDept: string;
  contractor: string;
  monitor: string;
  lastUpdated: string;
  createdDate: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS - Likoma District Constituency (4 wards × 4 projects = 16 total)
// Reference: Wards for Likoma District Constituency PDF
// ─────────────────────────────────────────────────────────────────────────────
export const projects: Project[] = [

  // ── CHIZUMULU NORTH ────────────────────────────────────────────────────────
  {
    id: 'CY-2026-001',
    name: 'Chiteko–Mocho Road Rehabilitation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Rehabilitation of the 8 km Chiteko–Mocho feeder road connecting Chizumulu North communities, including culvert installation and gravelling to ensure year-round access.',
    objectives: 'Restore all-season road access between Chiteko and Mocho villages, improve market and health-service connectivity for Chizumulu North residents.',
    sector: 'Roads and Bridges',
    constituency: 'Likoma Island',
    ward: 'Chizumulu North Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chiteko–Mocho, Chizumulu Island',
    gpsLat: '-11.965',
    gpsLng: '34.578',
    beneficiaryType: 'District-Wide',
    beneficiaries: 1800,
    budget: 3500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-01-15',
    startDate: '2026-02-10',
    expectedCompletion: '2026-08-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 65,
    implementingDept: 'Department of Roads',
    contractor: 'Chizumulu Roads Contractors',
    monitor: 'James Phiri',
    lastUpdated: '2026-08-20',
    createdDate: '2026-01-10',
  },
  {
    id: 'CY-2026-002',
    name: 'Chiteko FP 3-Classroom Block',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a 3-classroom block at Chiteko Full Primary School to address severe overcrowding and improve learning conditions for pupils in Chizumulu North.',
    objectives: 'Reduce classroom overcrowding, improve learning environment and increase enrolment capacity at Chiteko FP.',
    sector: 'Education',
    constituency: 'Likoma Island',
    ward: 'Chizumulu North Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chiteko Village, Chizumulu Island',
    gpsLat: '-11.968',
    gpsLng: '34.582',
    beneficiaryType: 'Students',
    beneficiaries: 920,
    budget: 2800000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2025-10-20',
    startDate: '2025-11-15',
    expectedCompletion: '2026-03-31',
    actualCompletion: '2026-04-05',
    status: 'Completed',
    progress: 100,
    implementingDept: 'Ministry of Education',
    contractor: 'Island Build Group',
    monitor: 'James Phiri',
    lastUpdated: '2026-04-08',
    createdDate: '2025-10-15',
  },
  {
    id: 'CY-2026-003',
    name: 'Chiteko Bridge Reconstruction',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Reconstruction of the Chiteko Bridge with reinforced concrete to replace the deteriorating wooden structure, ensuring year-round safe crossing for community members.',
    objectives: 'Provide a safe, durable crossing on the Chiteko–Mocho route, prevent seasonal isolation of Chiteko sub-villages during rains.',
    sector: 'Roads and Bridges',
    constituency: 'Likoma Island',
    ward: 'Chizumulu North Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chiteko Stream Crossing, Chizumulu Island',
    gpsLat: '-11.972',
    gpsLng: '34.575',
    beneficiaryType: 'Sports, creative arts & Innovation',
    beneficiaries: 1200,
    budget: 2200000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-02-01',
    startDate: '2026-03-10',
    expectedCompletion: '2026-09-30',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 45,
    implementingDept: 'Department of Roads',
    contractor: 'Lakeside Construction Ltd',
    monitor: 'James Phiri',
    lastUpdated: '2026-08-22',
    createdDate: '2026-01-28',
  },
  {
    id: 'CY-2026-004',
    name: 'Chizumulu Solar Plant Capacity Expansion',
    projectType: 'Other Projects',
    component: 'District-Wide Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Expansion of the Chizumulu Solar Plant with additional 40 kWp panels and battery storage to improve electricity reliability for both Chizumulu North and South households.',
    objectives: 'Increase reliable electricity supply, reduce load-shedding on Chizumulu Island, support health centre and school energy needs.',
    sector: 'Commercial Services',
    constituency: 'Likoma Island',
    ward: 'Chizumulu North Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chizumulu Solar Plant Site, Chizumulu Island',
    gpsLat: '-11.963',
    gpsLng: '34.585',
    beneficiaryType: 'District-Wide',
    beneficiaries: 3200,
    budget: 4800000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-03-01',
    startDate: '2026-04-15',
    expectedCompletion: '2026-11-30',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 30,
    implementingDept: 'ESCOM / Ministry of Energy',
    contractor: 'SolarMW Island Energy',
    monitor: 'James Phiri',
    lastUpdated: '2026-08-18',
    createdDate: '2026-02-25',
  },

  // ── CHIZUMULU SOUTH ────────────────────────────────────────────────────────
  {
    id: 'CY-2026-005',
    name: 'Same–Bama Road Improvement',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Improvement of the Same–Bama road corridor including grading, gravelling and installation of drainage structures to improve access for Chizumulu South communities.',
    objectives: 'Improve road access between Same and Bama villages, reduce travel time to Chizumulu Health Centre and ADMARC depot.',
    sector: 'Roads and Bridges',
    constituency: 'Likoma Island',
    ward: 'Chizumulu South Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Same–Bama Corridor, Chizumulu Island',
    gpsLat: '-11.998',
    gpsLng: '34.572',
    beneficiaryType: 'Youth Entrepreneurs',
    beneficiaries: 1500,
    budget: 2900000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2025-12-10',
    startDate: '2026-01-20',
    expectedCompletion: '2026-07-31',
    actualCompletion: '',
    status: 'Near Completion',
    progress: 85,
    implementingDept: 'Department of Roads',
    contractor: 'Chizumulu Roads Contractors',
    monitor: 'Grace Banda',
    lastUpdated: '2026-08-25',
    createdDate: '2025-12-05',
  },
  {
    id: 'CY-2026-006',
    name: 'Mocho JP Classroom Extension',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a 2-classroom extension and a new teacher\'s house at Mocho Junior Primary School serving children in the southern part of Chizumulu Island.',
    objectives: 'Expand classroom capacity at Mocho JP, improve teacher retention through improved housing, raise enrolment and completion rates.',
    sector: 'Education',
    constituency: 'Likoma Island',
    ward: 'Chizumulu South Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Mocho Village, Chizumulu Island',
    gpsLat: '-12.003',
    gpsLng: '34.568',
    beneficiaryType: 'Students',
    beneficiaries: 680,
    budget: 1800000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-02-15',
    startDate: '2026-03-20',
    expectedCompletion: '2026-10-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 40,
    implementingDept: 'Ministry of Education',
    contractor: 'Island Build Group',
    monitor: 'Grace Banda',
    lastUpdated: '2026-08-20',
    createdDate: '2026-02-10',
  },
  {
    id: 'CY-2026-007',
    name: 'Mocho Irrigation Canal Rehabilitation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Rehabilitation of the Mocho irrigation canal system to restore irrigated farming capacity for smallholder farmers in Chizumulu South.',
    objectives: 'Restore functional irrigation to 120 farming households, increase food production, support ADMARC market linkages.',
    sector: 'Agriculture & Environment',
    constituency: 'Likoma Island',
    ward: 'Chizumulu South Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Mocho Irrigation Site, Chizumulu Island',
    gpsLat: '-12.005',
    gpsLng: '34.580',
    beneficiaryType: 'Youth Entrepreneurs',
    beneficiaries: 850,
    budget: 2400000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-04-10',
    startDate: '',
    expectedCompletion: '2026-12-31',
    actualCompletion: '',
    status: 'Not Started',
    progress: 0,
    implementingDept: 'Ministry of Agriculture',
    contractor: 'Pending Tender',
    monitor: 'Grace Banda',
    lastUpdated: '2026-08-05',
    createdDate: '2026-04-05',
  },
  {
    id: 'CY-2026-008',
    name: 'Chizumulu Health Centre Renovation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Renovation and extension of Chizumulu Health Centre including a new maternity wing, improved consultation rooms and a pharmacy store serving both Chizumulu wards.',
    objectives: 'Improve maternal health outcomes, expand outpatient capacity and reduce referrals to mainland hospitals from Chizumulu Island.',
    sector: 'Health and Nutrition',
    constituency: 'Likoma Island',
    ward: 'Chizumulu South Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chizumulu Health Centre, Chizumulu Island',
    gpsLat: '-11.995',
    gpsLng: '34.565',
    beneficiaryType: 'Women Entrepreneurs',
    beneficiaries: 3200,
    budget: 3200000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-01-25',
    startDate: '2026-02-28',
    expectedCompletion: '2026-10-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 50,
    implementingDept: 'Ministry of Health',
    contractor: 'Lakeside Construction Ltd',
    monitor: 'Grace Banda',
    lastUpdated: '2026-08-22',
    createdDate: '2026-01-20',
  },

  // ── LIKOMA NORTH ──────────────────────────────────────────────────────────
  {
    id: 'CY-2026-009',
    name: 'Makulawe–Nkhwazi Road Rehabilitation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Rehabilitation of the Makulawe–Nkhwazi road including the Makulawe–Yofu spur, providing improved access to schools, the health centre and ADMARC from northern Likoma Island.',
    objectives: 'Restore all-weather road access across Likoma North, reduce isolation of Makulawe and Yofu communities, improve market connectivity.',
    sector: 'Roads and Bridges',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Makulawe–Nkhwazi Corridor, Likoma Island',
    gpsLat: '-12.062',
    gpsLng: '34.728',
    beneficiaryType: 'Sports, creative arts & Innovation',
    beneficiaries: 2100,
    budget: 3100000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-01-20',
    startDate: '2026-02-25',
    expectedCompletion: '2026-09-30',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 55,
    implementingDept: 'Department of Roads',
    contractor: 'Likoma Infrastructure Co.',
    monitor: 'Stella Mkandawire',
    lastUpdated: '2026-08-28',
    createdDate: '2026-01-15',
  },
  {
    id: 'CY-2026-010',
    name: 'Yofu FP 4-Classroom Block',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a 4-classroom block at Yofu Full Primary School to accommodate growing enrolment and replace deteriorating temporary structures in Likoma North.',
    objectives: 'Provide permanent and adequate classrooms, improve learning environment and teacher-pupil ratios at Yofu FP.',
    sector: 'Education',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Yofu Village, Likoma Island',
    gpsLat: '-12.058',
    gpsLng: '34.722',
    beneficiaryType: 'Students',
    beneficiaries: 1140,
    budget: 2600000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2025-11-05',
    startDate: '2025-12-01',
    expectedCompletion: '2026-04-30',
    actualCompletion: '2026-05-02',
    status: 'Completed',
    progress: 100,
    implementingDept: 'Ministry of Education',
    contractor: 'Northern Lakeside Builders',
    monitor: 'Stella Mkandawire',
    lastUpdated: '2026-05-05',
    createdDate: '2025-11-01',
  },
  {
    id: 'CY-2026-011',
    name: 'Kachere Irrigation Scheme Rehabilitation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Rehabilitation of the Kachere irrigation scheme including canal lining, water control structures and distribution pipes for smallholder farmers in Likoma North.',
    objectives: 'Restore irrigated agriculture for 180 farming households in Likoma North, support food security and household incomes.',
    sector: 'Agriculture & Environment',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Kachere Irrigation Site, Likoma Island',
    gpsLat: '-12.070',
    gpsLng: '34.735',
    beneficiaryType: 'Youth Entrepreneurs',
    beneficiaries: 1100,
    budget: 3500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-05-20',
    startDate: '',
    expectedCompletion: '2026-12-31',
    actualCompletion: '',
    status: 'Approved',
    progress: 0,
    implementingDept: 'Ministry of Agriculture',
    contractor: 'Pending Tender',
    monitor: 'Stella Mkandawire',
    lastUpdated: '2026-08-10',
    createdDate: '2026-05-15',
  },
  {
    id: 'CY-2026-012',
    name: 'Likoma Solar Plant Capacity Upgrade',
    projectType: 'Other Projects',
    component: 'District-Wide Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Upgrade of the Likoma Solar Plant with 60 kWp additional capacity and advanced battery storage to supply reliable electricity to Chima HC, St Peter\'s Hospital and Likoma North households.',
    objectives: 'Ensure reliable 24/7 electricity for St Peter\'s Hospital and Chima HC, reduce fuel dependency, support household electricity access in Likoma North.',
    sector: 'Commercial Services',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Likoma Solar Plant, Likoma Island',
    gpsLat: '-12.055',
    gpsLng: '34.720',
    beneficiaryType: 'District-Wide',
    beneficiaries: 5500,
    budget: 5200000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-04-05',
    startDate: '2026-05-20',
    expectedCompletion: '2027-01-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 20,
    implementingDept: 'ESCOM / Ministry of Energy',
    contractor: 'SolarMW Island Energy',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-26',
    createdDate: '2026-04-01',
  },

  // ── LIKOMA SOUTH ──────────────────────────────────────────────────────────
  {
    id: 'CY-2026-013',
    name: 'St Peters–Khuyu Road Rehabilitation',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Rehabilitation of the St Peters–Khuyu road including the Mbungo–Khuyu and Mbungo–Nkhwazi links to improve access across southern Likoma Island.',
    objectives: 'Restore all-weather road connectivity in Likoma South, improve access to St Peter\'s Hospital, schools and council markets.',
    sector: 'Roads and Bridges',
    constituency: 'Likoma Island',
    ward: 'Likoma South Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'St Peters–Khuyu Corridor, Likoma Island',
    gpsLat: '-12.095',
    gpsLng: '34.738',
    beneficiaryType: 'District-Wide',
    beneficiaries: 2300,
    budget: 2700000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-02-10',
    startDate: '2026-03-15',
    expectedCompletion: '2026-10-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 50,
    implementingDept: 'Department of Roads',
    contractor: 'Likoma Infrastructure Co.',
    monitor: 'Stella Mkandawire',
    lastUpdated: '2026-08-24',
    createdDate: '2026-02-05',
  },
  {
    id: 'CY-2026-014',
    name: 'Nkhwazi FP School Block',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a 4-classroom block at Nkhwazi Full Primary School serving pupils in Likoma South, including sanitation facilities and a teacher\'s resource room.',
    objectives: 'Expand classroom capacity, improve sanitation and support higher enrolment rates at Nkhwazi FP in Likoma South.',
    sector: 'Education',
    constituency: 'Likoma Island',
    ward: 'Likoma South Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Nkhwazi Village, Likoma Island',
    gpsLat: '-12.102',
    gpsLng: '34.732',
    beneficiaryType: 'Students',
    beneficiaries: 980,
    budget: 2500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2025-11-20',
    startDate: '2025-12-15',
    expectedCompletion: '2026-05-31',
    actualCompletion: '2026-06-01',
    status: 'Completed',
    progress: 100,
    implementingDept: 'Ministry of Education',
    contractor: 'Northern Lakeside Builders',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-06-03',
    createdDate: '2025-11-15',
  },
  {
    id: 'CY-2026-015',
    name: 'Likoma Fisheries Processing Facility',
    projectType: 'Other Projects',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a community fish processing and cold storage facility for the Likoma South Fishermen Cooperative, with ice plant and solar-powered refrigeration.',
    objectives: 'Reduce post-harvest fish losses, improve fish quality for mainland markets, increase fishermen household incomes, support the Fisheries Office mandate.',
    sector: 'Commercial Services',
    constituency: 'Likoma Island',
    ward: 'Likoma South Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Khuyu Beach, Likoma Island',
    gpsLat: '-12.108',
    gpsLng: '34.740',
    beneficiaryType: 'Women Entrepreneurs',
    beneficiaries: 1600,
    budget: 3000000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-03-25',
    startDate: '2026-05-01',
    expectedCompletion: '2026-12-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 35,
    implementingDept: 'Department of Fisheries',
    contractor: 'Lakeside Construction Ltd',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-22',
    createdDate: '2026-03-20',
  },
  {
    id: 'CY-2026-016',
    name: 'St Peter\'s Hospital Maternity Wing',
    projectType: 'CDF',
    component: 'Community Development Project',
    region: 'Northern',
    district: 'Likoma',
    description: 'Construction of a dedicated 20-bed maternity wing at St Peter\'s Hospital, Likoma Island, to improve maternal and neonatal health services for the entire constituency.',
    objectives: 'Improve maternal health outcomes, reduce maternal mortality, provide adequate delivery and post-natal care facilities for Likoma District.',
    sector: 'Health and Nutrition',
    constituency: 'Likoma Island',
    ward: 'Likoma South Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'St Peter\'s Hospital, Likoma Island',
    gpsLat: '-12.090',
    gpsLng: '34.742',
    beneficiaryType: 'District-Wide',
    beneficiaries: 8500,
    budget: 6500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-06-10',
    startDate: '',
    expectedCompletion: '2027-06-30',
    actualCompletion: '',
    status: 'Assessed',
    progress: 0,
    implementingDept: 'Ministry of Health',
    contractor: 'Pending Tender',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-12',
    createdDate: '2026-06-05',
  },

  // ── CDF INITIATIVES ────────────────────────────────────────────────────────
  {
    id: 'CY-INIT-001',
    name: 'Likoma Youth Enterprise Seed Capital Fund',
    initiativeName: 'Likoma Youth Enterprise Seed Capital Fund',
    initiativeComponent: 'Youth Enterprise fund',
    itemType: 'Initiative',
    projectType: 'CDF',
    component: 'Youth Enterprise fund',
    region: 'Northern',
    district: 'Likoma',
    description: 'Revolving seed capital funding, start-up toolkits and entrepreneurship training empowering youth to establish and manage sustainable micro-enterprises and cooperatives across wards.',
    objectives: 'Empower 180 youth entrepreneurs with seed business capital, tools and mentorship to create sustainable island businesses.',
    sector: 'Commercial Services',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Mbamba & Makulawe, Likoma Island',
    gpsLat: '-12.052',
    gpsLng: '34.733',
    beneficiaryType: 'Youth Entrepreneurs',
    beneficiaries: 180,
    budget: 4500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-02-01',
    startDate: '2026-02-15',
    expectedCompletion: '2026-11-30',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 60,
    implementingDept: 'Department of Youth and Sports',
    contractor: 'Likoma Youth Development Coalition',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-20',
    createdDate: '2026-02-01',
  },
  {
    id: 'CY-INIT-002',
    name: 'Likoma Secondary School Bursaries Scheme',
    initiativeName: 'Likoma Secondary School Bursaries Scheme',
    initiativeComponent: 'School Bursaries',
    itemType: 'Initiative',
    projectType: 'CDF',
    component: 'School Bursaries',
    region: 'Northern',
    district: 'Likoma',
    description: 'Comprehensive education bursary support covering tuition fees, examination registration, school uniforms and learning materials for vulnerable students attending secondary and tertiary institutions.',
    objectives: 'Support 320 vulnerable students across Likoma and Chizumulu with full secondary education bursaries to ensure zero dropouts.',
    sector: 'Education',
    constituency: 'Likoma Island',
    ward: 'Likoma South Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'St Peter\'s Secondary & Community Day Secondary Schools',
    gpsLat: '-12.088',
    gpsLng: '34.740',
    beneficiaryType: 'Students',
    beneficiaries: 320,
    budget: 6000000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-01-10',
    startDate: '2026-01-20',
    expectedCompletion: '2026-12-15',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 75,
    implementingDept: 'District Education Office',
    contractor: 'Likoma District Education Desk',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-25',
    createdDate: '2026-01-10',
  },
  {
    id: 'CY-INIT-003',
    name: 'Chizumulu Women Economic Empowerment Grant',
    initiativeName: 'Chizumulu Women Economic Empowerment Grant',
    initiativeComponent: 'Women Economic Empowerment',
    itemType: 'Initiative',
    projectType: 'CDF',
    component: 'Women Economic Empowerment',
    region: 'Northern',
    district: 'Likoma',
    description: 'Targeted economic empowerment grants, agro-processing tools and financial literacy training enabling women-led business groups and village savings loans associations to achieve economic resilience.',
    objectives: 'Equip 240 women in Chizumulu North and South with modern fish-processing solar dryers, capital grants and VSLA training.',
    sector: 'Agriculture & Environment',
    constituency: 'Likoma Island',
    ward: 'Chizumulu North Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Chiteko & Same Lakeshore, Chizumulu Island',
    gpsLat: '-11.960',
    gpsLng: '34.575',
    beneficiaryType: 'Women Entrepreneurs',
    beneficiaries: 240,
    budget: 4200000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-02-12',
    startDate: '2026-03-01',
    expectedCompletion: '2026-10-31',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 50,
    implementingDept: 'Community Development Department',
    contractor: 'Chizumulu Women Cooperative Network',
    monitor: 'Grace Mlowoka',
    lastUpdated: '2026-08-18',
    createdDate: '2026-02-12',
  },
  {
    id: 'CY-INIT-004',
    name: 'Chizumulu & Likoma Sports Development Fund',
    initiativeName: 'Chizumulu & Likoma Sports Development Fund',
    initiativeComponent: 'Sports Development Fund',
    itemType: 'Initiative',
    projectType: 'CDF',
    component: 'Sports Development Fund',
    region: 'Northern',
    district: 'Likoma',
    description: 'Grassroots athletic and sports development fund providing official gear, tournament awards, footballs, netballs and community sports pitch upgrades to foster youth talent.',
    objectives: 'Upgrade community sports grounds and equip 24 youth football and netball clubs across the wards.',
    sector: 'Sports, creative arts & Innovation',
    constituency: 'Likoma Island',
    ward: 'Chizumulu South Ward',
    traditionalAuthority: 'T/A Mwakhwere',
    location: 'Bama & Same Community Grounds',
    gpsLat: '-11.975',
    gpsLng: '34.585',
    beneficiaryType: 'Sports, creative arts & Innovation',
    beneficiaries: 550,
    budget: 3500000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-03-05',
    startDate: '2026-03-20',
    expectedCompletion: '2026-09-30',
    actualCompletion: '',
    status: 'Completed',
    progress: 100,
    implementingDept: 'Department of Youth and Sports',
    contractor: 'Likoma District Sports Association',
    monitor: 'Grace Mlowoka',
    lastUpdated: '2026-08-30',
    createdDate: '2026-03-05',
  },
  {
    id: 'CY-INIT-005',
    name: 'Likoma Creative Arts & Innovation Grants',
    initiativeName: 'Likoma Creative Arts & Innovation Grants',
    initiativeComponent: 'Creative Arts & Innovation',
    itemType: 'Initiative',
    projectType: 'CDF',
    component: 'Creative Arts & Innovation',
    region: 'Northern',
    district: 'Likoma',
    description: 'Support grants for local artisans, traditional musicians, digital innovators, cultural preservation projects and youth creative enterprises across the wards.',
    objectives: 'Provide creative tools, studio recording support and artisan grants to 110 young innovators and artists in Likoma.',
    sector: 'Commercial Services',
    constituency: 'Likoma Island',
    ward: 'Likoma North Ward',
    traditionalAuthority: 'T/A Mkumpha',
    location: 'Chipinga & Mbamba Creative Hub',
    gpsLat: '-12.048',
    gpsLng: '34.730',
    beneficiaryType: 'Sports, creative arts & Innovation',
    beneficiaries: 110,
    budget: 2800000,
    fundingSource: 'CDF 2025/2026',
    approvalDate: '2026-04-10',
    startDate: '2026-05-01',
    expectedCompletion: '2026-11-30',
    actualCompletion: '',
    status: 'Ongoing',
    progress: 40,
    implementingDept: 'Department of Culture and Arts',
    contractor: 'Likoma Island Cultural Guild',
    monitor: 'Peter Kachingwe',
    lastUpdated: '2026-08-15',
    createdDate: '2026-04-10',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MONITORS - re-assigned to Likoma District wards
// ─────────────────────────────────────────────────────────────────────────────
export interface Monitor {
  id: string;
  name: string;
  phone: string;
  email: string;
  wards: string;
  assignedProjects: number;
  submitted: number;
  approved: number;
  returned: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export const monitors: Monitor[] = [
  {
    id: 'M001',
    name: 'James Phiri',
    phone: '+265 888 123 456',
    email: 'j.phiri@councilyanga.mw',
    wards: 'Chizumulu North Ward',
    assignedProjects: 4,
    submitted: 12,
    approved: 10,
    returned: 1,
    lastActive: '2026-08-28',
    status: 'Active',
    joinDate: '2026-01-15',
  },
  {
    id: 'M002',
    name: 'Grace Banda',
    phone: '+265 999 234 567',
    email: 'g.banda@councilyanga.mw',
    wards: 'Chizumulu South Ward',
    assignedProjects: 4,
    submitted: 9,
    approved: 8,
    returned: 0,
    lastActive: '2026-08-27',
    status: 'Active',
    joinDate: '2026-01-15',
  },
  {
    id: 'M003',
    name: 'Stella Mkandawire',
    phone: '+265 888 345 678',
    email: 's.mkandawire@councilyanga.mw',
    wards: 'Likoma North Ward',
    assignedProjects: 4,
    submitted: 15,
    approved: 13,
    returned: 2,
    lastActive: '2026-08-28',
    status: 'Active',
    joinDate: '2025-12-01',
  },
  {
    id: 'M004',
    name: 'Peter Kachingwe',
    phone: '+265 999 456 789',
    email: 'p.kachingwe@councilyanga.mw',
    wards: 'Likoma South Ward',
    assignedProjects: 4,
    submitted: 6,
    approved: 4,
    returned: 1,
    lastActive: '2026-08-25',
    status: 'Active',
    joinDate: '2026-08-20',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────
export interface Feedback {
  id: string;
  project: string;
  projectId: string;
  type: string;
  citizen: string;
  contact: string;
  date: string;
  message: string;
  status: 'Received' | 'Under Review' | 'Verification Requested' | 'Resolved' | 'Rejected';
  response: string;
  resolvedDate: string;
}

export const feedback: Feedback[] = [
  {
    id: 'FB-001',
    project: 'Chiteko–Mocho Road Rehabilitation',
    projectId: 'CY-2026-001',
    type: 'Progress Observation',
    citizen: 'A. Mwale',
    contact: '+265 888 001 001',
    date: '2026-08-25',
    message: 'Works on the Chiteko–Mocho road appear to have stalled for two weeks near the bridge approach. No workers or equipment visible at the section closest to the stream.',
    status: 'Under Review',
    response: '',
    resolvedDate: '',
  },
  {
    id: 'FB-002',
    project: 'Chiteko FP 3-Classroom Block',
    projectId: 'CY-2026-002',
    type: 'Project Information Correction',
    citizen: 'B. Nkhoma',
    contact: '+265 999 002 002',
    date: '2026-08-22',
    message: 'The portal shows 2 classrooms were built but all 3 classrooms are clearly complete and in use. Please update the record for accuracy.',
    status: 'Resolved',
    response: 'Thank you for the correction. The portal has been updated to reflect all 3 classrooms. This was a data entry error which has been corrected.',
    resolvedDate: '2026-08-24',
  },
  {
    id: 'FB-003',
    project: 'Mocho Irrigation Canal Rehabilitation',
    projectId: 'CY-2026-007',
    type: 'Request for Information',
    citizen: 'C. Chirwa',
    contact: '+265 888 003 003',
    date: '2026-08-20',
    message: 'When will the Mocho irrigation canal project begin? Farmers have been waiting and the planting season is approaching. No communication from the Council or contractor.',
    status: 'Under Review',
    response: '',
    resolvedDate: '',
  },
  {
    id: 'FB-004',
    project: 'General',
    projectId: '',
    type: 'Community Suggestion',
    citizen: 'D. Phiri',
    contact: '',
    date: '2026-08-18',
    message: 'Likoma South has no safe water point near Mbungo village. We request a borehole project similar to what was done on the mainland in the next CDF cycle for Likoma District.',
    status: 'Received',
    response: '',
    resolvedDate: '',
  },
  {
    id: 'FB-005',
    project: 'Chizumulu Health Centre Renovation',
    projectId: 'CY-2026-008',
    type: 'Location Correction',
    citizen: 'E. Banda',
    contact: '+265 999 005 005',
    date: '2026-08-15',
    message: 'The GPS coordinates on the portal place the health centre in the wrong part of Chizumulu Island. The actual clinic is about 150 metres further south of the marked point.',
    status: 'Resolved',
    response: 'GPS coordinates have been verified and updated. A monitor confirmed the correct location. Thank you for the accurate report.',
    resolvedDate: '2026-08-17',
  },
  {
    id: 'FB-006',
    project: 'Mocho JP Classroom Extension',
    projectId: 'CY-2026-006',
    type: 'Request for Information',
    citizen: 'F. Tembo',
    contact: '+265 888 006 006',
    date: '2026-08-12',
    message: 'Construction of the Mocho JP extension started in March but the pace is very slow. Pupils are still learning under trees. Can the Council ensure the contractor speeds up?',
    status: 'Under Review',
    response: '',
    resolvedDate: '',
  },
  {
    id: 'FB-007',
    project: 'Chiteko Bridge Reconstruction',
    projectId: 'CY-2026-003',
    type: 'Progress Observation',
    citizen: 'G. Lungu',
    contact: '+265 999 007 007',
    date: '2026-08-10',
    message: 'The reinforcement bars on the new Chiteko Bridge look too few and too thin for the size of the structure. Can the Council send an engineer to verify the quality?',
    status: 'Verification Requested',
    response: 'A field verification has been scheduled. A qualified engineer will accompany the monitor during the next site visit on 5 September 2026.',
    resolvedDate: '',
  },
  {
    id: 'FB-008',
    project: 'Same–Bama Road Improvement',
    projectId: 'CY-2026-005',
    type: 'General Feedback',
    citizen: 'H. Msiska',
    contact: '+265 888 008 008',
    date: '2026-08-08',
    message: 'The Same–Bama road is almost finished and it looks excellent. The community is very grateful to the Council for this long-awaited improvement.',
    status: 'Resolved',
    response: 'Thank you for the positive feedback! It has been shared with the contractor and the Council administration.',
    resolvedDate: '2026-08-09',
  },
  {
    id: 'FB-009',
    project: 'Likoma Solar Plant Capacity Upgrade',
    projectId: 'CY-2026-012',
    type: 'Project Information Correction',
    citizen: 'I. Chilemba',
    contact: '+265 999 009 009',
    date: '2026-08-05',
    message: 'The project documents mention coverage for 3 clinics but only 2 facilities are listed on the portal. Chima Health Centre should be included as a beneficiary.',
    status: 'Resolved',
    response: 'Chima Health Centre has been added to the project scope documentation. Thank you for the community oversight - this is exactly what the portal is for.',
    resolvedDate: '2026-08-07',
  },
  {
    id: 'FB-010',
    project: 'General',
    projectId: '',
    type: 'Community Suggestion',
    citizen: 'J. Ndalama',
    contact: '',
    date: '2026-07-30',
    message: 'We request the Council consider a secondary school construction project for Chizumulu Island in the next CDF cycle. Children currently travel by boat to Likoma for secondary school.',
    status: 'Received',
    response: '',
    resolvedDate: '',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  body: string;
  published: boolean;
  createdBy: string;
}

export const announcements: Announcement[] = [
  {
    id: 'AN-001',
    title: '16 CDF Projects Approved for Likoma District 2025/2026',
    date: '2026-08-01',
    category: 'New Projects',
    body: 'The Council has approved 16 development projects for Likoma District Constituency for the 2025/2026 CDF year, totalling MK 52.5 million. Projects span all four wards - Chizumulu North, Chizumulu South, Likoma North and Likoma South - covering education, health, roads, agriculture and energy. Full project details are now available on the Council Yanga portal.',
    published: true,
    createdBy: 'Council Admin',
  },
  {
    id: 'AN-002',
    title: 'Yofu FP 4-Classroom Block Successfully Completed',
    date: '2026-05-05',
    category: 'Project Completion',
    body: 'The 4-classroom block at Yofu Full Primary School has been successfully completed and officially handed over in Likoma North. The facility will benefit 1,140 learners starting Term 2, 2026. The Council thanks the community, implementing team and monitor for their diligence.',
    published: true,
    createdBy: 'Council Admin',
  },
  {
    id: 'AN-003',
    title: 'CDF Community Progress Meeting - Chizumulu North Ward',
    date: '2026-09-05',
    category: 'Community Meeting',
    body: 'The Council will hold a public community meeting on Saturday 6th September 2026 at 09:00 at Chiteko ADMARC Hall. The agenda includes CDF project progress reports for all Chizumulu North projects. Community members, project beneficiaries, civil society organisations and media are invited to attend.',
    published: true,
    createdBy: 'Council Admin',
  },
  {
    id: 'AN-004',
    title: 'Public Notice: Tender for Kachere Irrigation Scheme',
    date: '2026-08-10',
    category: 'CDF Notice',
    body: 'Sealed bids are invited from registered contractors for the rehabilitation of the Kachere Irrigation Scheme, Likoma North. Tender documents and technical specifications are available at the Likoma District Council offices during business hours. Closing date: 30 September 2026 at 12:00 noon.',
    published: true,
    createdBy: 'Council Admin',
  },
  {
    id: 'AN-005',
    title: 'Nkhwazi FP School Block Completed Ahead of Schedule',
    date: '2026-06-03',
    category: 'Project Completion',
    body: 'The 4-classroom block at Nkhwazi Full Primary School, Likoma South, has been completed two weeks ahead of schedule. The facility benefits approximately 980 learners. The Council commends the contractor\'s efficient delivery and the Likoma South community\'s cooperation.',
    published: true,
    createdBy: 'Council Admin',
  },
  {
    id: 'AN-006',
    title: 'Same–Bama Road Improvement - 85% Complete',
    date: '2026-08-25',
    category: 'Progress Update',
    body: 'The Same–Bama road improvement project, Chizumulu South, is progressing excellently at 85% completion. Gravelling is nearly complete and drainage structures are all installed. Completion is expected by end of September 2026. The Chizumulu South community is commended for their support.',
    published: true,
    createdBy: 'Council Admin',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: number;
  user: string;
  action: string;
  oldValue: string;
  newValue: string;
  target: string;
  date: string;
  time: string;
}

export const auditLogs: AuditLog[] = [
  { id: 1, user: 'Council Admin', action: 'Updated project status', oldValue: 'Ongoing', newValue: 'Near Completion', target: 'Same–Bama Road Improvement', date: '28 Aug 2026', time: '10:35' },
  { id: 2, user: 'Council Admin', action: 'Published project update', oldValue: 'Draft', newValue: 'Published', target: 'Chiteko–Mocho Road - Update #4', date: '27 Aug 2026', time: '14:20' },
  { id: 3, user: 'Monitor: James Phiri', action: 'Submitted field update', oldValue: '', newValue: 'Pending Review', target: 'Chiteko Bridge Reconstruction', date: '26 Aug 2026', time: '09:15' },
  { id: 4, user: 'Council Admin', action: 'Approved monitor submission', oldValue: 'Pending Review', newValue: 'Approved', target: 'Chiteko–Mocho Road - Update #4', date: '25 Aug 2026', time: '11:45' },
  { id: 5, user: 'Council Admin', action: 'Created monitor account', oldValue: '', newValue: 'Active', target: 'Peter Kachingwe (M004)', date: '20 Aug 2026', time: '15:00' },
  { id: 6, user: 'Monitor: Grace Banda', action: 'Submitted field update', oldValue: '', newValue: 'Pending Review', target: 'Mocho JP Classroom Extension', date: '20 Aug 2026', time: '16:30' },
  { id: 7, user: 'Council Admin', action: 'Published announcement', oldValue: '', newValue: 'Published', target: 'Same–Bama Road 85% Progress Update', date: '25 Aug 2026', time: '10:00' },
  { id: 8, user: 'Council Admin', action: 'Updated project status', oldValue: 'Approved', newValue: 'Ongoing', target: 'Likoma Fisheries Processing Facility', date: '15 Aug 2026', time: '08:30' },
  { id: 9, user: 'Council Admin', action: 'Resolved citizen feedback', oldValue: 'Under Review', newValue: 'Resolved', target: 'FB-002 - Chiteko FP Classroom Correction', date: '24 Aug 2026', time: '13:00' },
  { id: 10, user: 'Monitor: Stella Mkandawire', action: 'Submitted field update', oldValue: '', newValue: 'Pending Review', target: 'Makulawe–Nkhwazi Road Rehabilitation', date: '28 Aug 2026', time: '11:20' },
  { id: 11, user: 'Council Admin', action: 'Added new project', oldValue: '', newValue: 'Assessed', target: "St Peter's Hospital Maternity Wing (CY-2026-016)", date: '12 Aug 2026', time: '09:00' },
  { id: 12, user: 'Council Admin', action: 'Updated project budget', oldValue: 'MK 6.0M', newValue: 'MK 6.5M', target: "St Peter's Hospital Maternity Wing", date: '12 Aug 2026', time: '09:15' },
  { id: 13, user: 'Monitor: Peter Kachingwe', action: 'Submitted field update', oldValue: '', newValue: 'Pending Review', target: 'St Peters–Khuyu Road Rehabilitation', date: '10 Aug 2026', time: '14:45' },
  { id: 14, user: 'Council Admin', action: 'Requested verification', oldValue: 'Received', newValue: 'Verification Requested', target: 'FB-007 - Chiteko Bridge Quality Concern', date: '10 Aug 2026', time: '15:30' },
];

// ─────────────────────────────────────────────────────────────────────────────
// APP NOTIFICATIONS (Public Portal bell)
// ─────────────────────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'completion' | 'update' | 'announcement' | 'meeting' | 'new_project';
  projectId?: string;
  read: boolean;
}

export const appNotifications: AppNotification[] = [
  {
    id: 'N-001',
    title: 'Same–Bama Road Now 85% Complete',
    message: 'Same–Bama Road Improvement in Chizumulu South is 85% complete. Gravelling nearly done. Expected completion: September 2026.',
    date: '2026-08-25',
    time: '10:00',
    type: 'update',
    projectId: 'CY-2026-005',
    read: false,
  },
  {
    id: 'N-002',
    title: 'Nkhwazi FP School Block Completed',
    message: '4-classroom block at Nkhwazi Full Primary School, Likoma South, completed ahead of schedule. Benefiting 980 learners.',
    date: '2026-06-03',
    time: '12:00',
    type: 'completion',
    projectId: 'CY-2026-014',
    read: false,
  },
  {
    id: 'N-003',
    title: 'Community Meeting - 6 September 2026',
    message: 'CDF Progress Meeting for Chizumulu North Ward at Chiteko ADMARC Hall, 09:00. All community members invited.',
    date: '2026-08-19',
    time: '10:00',
    type: 'meeting',
    read: false,
  },
  {
    id: 'N-004',
    title: '16 New CDF Projects Approved for Likoma',
    message: '16 projects approved for Likoma District Constituency 2025/2026, totalling MK 52.5 million. Full details on the portal.',
    date: '2026-08-01',
    time: '09:00',
    type: 'new_project',
    read: false,
  },
  {
    id: 'N-005',
    title: 'Chiteko–Mocho Road Rehabilitation Update',
    message: 'Road rehabilitation is now 65% complete. Gravelling of km 5–8 has commenced. Expected completion: August 2026.',
    date: '2026-08-20',
    time: '15:00',
    type: 'update',
    projectId: 'CY-2026-001',
    read: true,
  },
  {
    id: 'N-006',
    title: 'Yofu FP Classroom Block Completed',
    message: '4-classroom block at Yofu Full Primary School, Likoma North, completed and handed over. Benefiting 1,140 learners.',
    date: '2026-05-05',
    time: '10:00',
    type: 'completion',
    projectId: 'CY-2026-010',
    read: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHART DATA
// ─────────────────────────────────────────────────────────────────────────────
export const projectsByWardData = [
  { ward: 'Chizumulu North', total: 4, ongoing: 3, completed: 1, notStarted: 0 },
  { ward: 'Chizumulu South', total: 4, ongoing: 3, completed: 0, notStarted: 1 },
  { ward: 'Likoma North', total: 4, ongoing: 2, completed: 1, notStarted: 1 },
  { ward: 'Likoma South', total: 4, ongoing: 2, completed: 1, notStarted: 1 },
];

export const sectorData = [
  { name: 'Roads', value: 5, color: '#16a34a' },
  { name: 'Education', value: 4, color: '#2563eb' },
  { name: 'Agriculture', value: 3, color: '#d97706' },
  { name: 'Energy', value: 2, color: '#7c3aed' },
  { name: 'Health', value: 2, color: '#dc2626' },
];

export const activityData = [
  { month: 'Mar', updates: 4, visits: 6 },
  { month: 'Apr', updates: 7, visits: 10 },
  { month: 'May', updates: 5, visits: 8 },
  { month: 'Jun', updates: 9, visits: 13 },
  { month: 'Jul', updates: 14, visits: 18 },
  { month: 'Aug', updates: 19, visits: 24 },
];

// ─────────────────────────────────────────────────────────────────────────────
// FINANCIALS
// ─────────────────────────────────────────────────────────────────────────────
export const financials = {
  cdfYear: '2025/2026',
  totalAllocation: 65000000,
  totalApproved: 52500000,
  totalDisbursed: 34800000,
  totalExpenditure: 28600000,
  source: 'Malawi Government CDF Office',
  lastUpdated: '31 July 2026',
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const publicDocuments = [
  { id: 'DOC-001', name: 'CDF 2025/2026 Allocation Summary - Likoma District', type: 'CDF Guidelines', project: 'All Projects', date: '2026-01-10', size: '1.2 MB' },
  { id: 'DOC-002', name: 'Chiteko FP Classroom Block - Completion Report', type: 'Completion Report', project: 'Chiteko FP 3-Classroom Block', date: '2026-04-08', size: '2.8 MB' },
  { id: 'DOC-003', name: 'Nkhwazi FP School Block - Completion Report', type: 'Completion Report', project: 'Nkhwazi FP 4-Classroom Block', date: '2026-06-03', size: '2.4 MB' },
  { id: 'DOC-004', name: 'Same–Bama Road - Progress Report Q2 2026', type: 'Progress Report', project: 'Same–Bama Road Improvement', date: '2026-07-01', size: '1.8 MB' },
  { id: 'DOC-005', name: "St Peter's Hospital Maternity Wing - Needs Assessment", type: 'Needs Assessment', project: "St Peter's Hospital Maternity Wing", date: '2026-06-05', size: '3.5 MB' },
  { id: 'DOC-006', name: 'CDF 2025/2026 Project Directory - Likoma District', type: 'CDF Guidelines', project: 'All Projects', date: '2026-08-01', size: '2.6 MB' },
  { id: 'DOC-007', name: 'Chiteko–Mocho Road - Progress Report Aug 2026', type: 'Progress Report', project: 'Chiteko–Mocho Road Rehabilitation', date: '2026-08-20', size: '2.1 MB' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
export const PROJECT_TYPES = ['CDF', 'Other Projects'] as const;

export const CDF_COMPONENTS = [
  'Community Development Project',
  'District-Wide Project',
  'Rehabilitation and Maintenance of Infrastructure',
] as const;

export const INITIATIVE_COMPONENTS = [
  'Youth Enterprise fund',
  'School Bursaries',
  'Women Economic Empowerment',
  'Sports Development Fund',
  'Creative Arts & Innovation',
] as const;

export const INITIATIVE_COMPONENT_DESCRIPTIONS: Record<string, string> = {
  'Youth Enterprise fund':
    'Revolving seed capital funding, start-up toolkits and entrepreneurship training empowering youth to establish and manage sustainable micro-enterprises and cooperatives across wards.',
  'School Bursaries':
    'Comprehensive education bursary support covering tuition fees, examination registration, school uniforms and learning materials for vulnerable students attending secondary and tertiary institutions.',
  'Women Economic Empowerment':
    'Targeted economic empowerment grants, agro-processing tools and financial literacy training enabling women-led business groups and village savings loans associations to achieve economic resilience.',
  'Sports Development Fund':
    'Grassroots athletic and sports development fund providing official gear, tournament awards, footballs, netballs and community sports pitch upgrades to foster youth talent.',
  'Creative Arts & Innovation':
    'Support grants for local artisans, traditional musicians, digital innovators, cultural preservation projects and youth creative enterprises across the wards.',
};

export function getBeneficiaryTypeForInitiativeComponent(comp?: string): string {
  if (!comp) return 'District-Wide';
  if (comp === 'Youth Enterprise fund') return 'Youth Entrepreneurs';
  if (comp === 'School Bursaries') return 'Students';
  if (comp === 'Women Economic Empowerment') return 'Women Entrepreneurs';
  if (comp === 'Sports Development Fund' || comp === 'Creative Arts & Innovation') return 'Sports, creative arts & Innovation';
  return 'District-Wide';
}

export function getProjectInitiativeComponent(p: Project, index?: number): string {
  if (p.initiativeComponent && (INITIATIVE_COMPONENTS as readonly string[]).includes(p.initiativeComponent)) {
    return p.initiativeComponent;
  }
  const nameLower = (p.name || '').toLowerCase();
  const sectorLower = (p.sector || '').toLowerCase();
  const descLower = (p.description || '').toLowerCase();
  const text = `${nameLower} ${sectorLower} ${descLower}`;

  if (text.includes('sport') || text.includes('football') || text.includes('netball') || text.includes('pitch')) {
    return 'Sports Development Fund';
  }
  if (text.includes('creative') || text.includes('art') || text.includes('music') || text.includes('innovation')) {
    return 'Creative Arts & Innovation';
  }
  if (text.includes('women') || text.includes('maternity') || text.includes('mother') || text.includes('female')) {
    return 'Women Economic Empowerment';
  }
  if (text.includes('youth') || text.includes('enterprise') || text.includes('seed capital') || text.includes('skills')) {
    return 'Youth Enterprise fund';
  }
  if (text.includes('school') || text.includes('education') || text.includes('bursar') || text.includes('pupil') || text.includes('student') || text.includes('classroom') || text.includes('fp') || text.includes('jp') || text.includes('teacher')) {
    return 'School Bursaries';
  }

  // Fallback cycling through the 5 initiative components based on hash or index
  const hash = (p.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (index || 0);
  return INITIATIVE_COMPONENTS[hash % INITIATIVE_COMPONENTS.length];
}

export function isInitiative(p: Project): boolean {
  if (p.itemType === 'Initiative') return true;
  if (p.itemType === 'Project') return false;
  if (p.initiativeName && p.initiativeName.trim() !== '') return true;
  if (p.initiativeComponent && p.initiativeComponent.trim() !== '') return true;
  if ((INITIATIVE_COMPONENTS as readonly string[]).includes(p.component as any)) return true;
  const nameLower = (p.name || '').toLowerCase();
  const compLower = (p.component || '').toLowerCase();
  if (
    nameLower.includes('initiative') ||
    compLower.includes('initiative') ||
    compLower.includes('bursar') ||
    compLower.includes('enterprise fund')
  ) {
    return true;
  }
  return false;
}

export function isProject(p: Project): boolean {
  return !isInitiative(p);
}

export const BENEFICIARY_TYPES = [
  'Sports, creative arts & Innovation',
  'Women Entrepreneurs',
  'Youth Entrepreneurs',
  'Students',
  'District-Wide',
] as const;

export const COMMUNITY_DEVELOPMENT_SECTORS = [
  'Agriculture & Environment',
  'Health and Nutrition',
  'Education',
  'Water and Sanitation',
  'Roads and Bridges',
  'Commercial Services',
  'Community Security & Justice Initiatives',
  'Boats',
  'Offices',
  'Disaster Recovery',
  'Motor Vehicles & Motorcycles',
] as const;

export const REGIONS = ['Northern', 'Central', 'Southern'] as const;

export const DISTRICTS = [
  'Chitipa',
  'Karonga',
  'Karonga Town',
  'Rumphi',
  'Mzimba',
  'Mzuzu City',
  'Nkhata Bay',
  'Likoma',
  'Nkhotakota',
  'Kasungu',
  'Kasungu Municipality',
  'Ntchisi',
  'Dowa',
  'Mchinji',
  'Salima',
  'Lilongwe',
  'Lilongwe City',
  'Dedza',
  'Ntcheu',
  'Mangochi',
  'Mangochi Municipality',
  'Machinga',
  'Balaka',
  'Zomba',
  'Zomba City',
  'Chiradzulu',
  'Blantyre',
  'Blantyre City',
  'Mwanza',
  'Neno',
  'Thyolo',
  'Luchenza Municipality',
  'Phalombe',
  'Mulanje',
  'Chikwawa',
  'Nsanje',
] as const;

export const CONSTITUENCIES = [
  'Chitipa North',
  'Chitipa Central',
  'Chitipa East',
  'Chitipa Chendo',
  'Chitipa South',
  'Karonga Songwe',
  'Karonga Lufilya',
  'Karonga Central',
  'Karonga Nyungwe',
  'Karonga South',
  'Karonga Town',
  'Rumphi North',
  'Rumphi West',
  'Rumphi East',
  'Rumphi Central',
  'Mzimba North',
  'Mzimba West',
  'Mzimba Kafukule',
  'Mzimba North East',
  'Mzimba Central',
  'Mzimba East',
  'Mzimba Hora',
  'Mzimba South West',
  'Mzimba Solola',
  'Mzimba Perekezi',
  'Mzimba South',
  'Mzimba South East',
  'Mzimba Luwerezi',
  'Mzuzu City North',
  'Mzuzu City South West',
  'Mzuzu City South East',
  'Nkhata Bay North',
  'Nkhata Bay Mpamba',
  'Nkhata Bay Central',
  'Nkhata Bay West',
  'Nkhata Bay Chintheche',
  'Nkhata Bay South',
  'Likoma Island',
  'Nkhotakota Dwangwa',
  'Nkhotakota Liwaladzi',
  'Nkhotakota Central',
  'Nkhotakota Chia',
  'Nkhotakota Mkhula',
  'Kasungu North',
  'Kasungu North West',
  'Kasungu West',
  'Kasungu North North East',
  'Kasungu East',
  'Kasungu North East',
  'Kasungu Central',
  'Kasungu South East',
  'Kasungu South West',
  'Kasungu South',
  'Kasungu Municipality',
  'Ntchisi North',
  'Ntchisi West',
  'Ntchisi Central East',
  'Ntchisi East',
  'Ntchisi South',
  'Dowa Ngala',
  'Dowa Kasangadzi',
  'Dowa Mphudzu',
  'Dowa Central',
  'Dowa Mndolera',
  'Dowa North East',
  'Dowa West',
  'Dowa East',
  'Dowa Central East',
  'Dowa South East',
  'Mchinji North East',
  'Mchinji North',
  'Mchinji East',
  'Mchinji West',
  'Mchinji Central East',
  'Mchinji South West',
  'Mchinji South',
  'Salima North',
  'Salima Central West',
  'Salima Central East',
  'Salima Central',
  'Salima South Linthipe',
  'Salima South',
  'Lilongwe Chilobwe',
  'Lilongwe Mphande',
  'Lilongwe Mude',
  'Lilongwe Demera',
  'Lilongwe Chiwamba',
  'Lilongwe East',
  'Lilongwe Mapuyu North',
  'Lilongwe Nkhoma',
  'Lilongwe Likuni',
  'Lilongwe Central',
  'Lilongwe Mpenu',
  'Lilongwe Machenga',
  'Lilongwe Mapuyu South',
  'Lilongwe Nyanja',
  'Lilongwe Msozi',
  'Lilongwe Bunda',
  'Lilongwe Phirilanjuzi',
  'Lilongwe Msinja North',
  'Lilongwe Msinja South',
  'Lilongwe City Lumbadzi',
  'Lilongwe City Dzenza',
  'Lilongwe City Centre',
  'Lilongwe City Chipala-Nafisi',
  'Lilongwe City Nankhaka',
  'Lilongwe City Mtandire-Mtsiriza',
  'Lilongwe City Bwaila',
  'Lilongwe City Masintha',
  'Lilongwe City Mbuka',
  'Lilongwe City Mlodza',
  'Lilongwe City Kamphuno',
  'Lilongwe City Ngwenya',
  'Dedza Mayani',
  'Dedza Mlunduni',
  'Dedza Kasina',
  'Dedza Mtakataka',
  'Dedza Linthipe',
  'Dedza Boma',
  'Dedza Golomoti',
  'Dedza Chikoma',
  'Dedza Mphunzi',
  'Dedza Dzalanyama',
  'Ntcheu North',
  'Ntcheu Bwanje',
  'Ntcheu North West',
  'Ntcheu Central East',
  'Ntcheu Central',
  'Ntcheu Dzonzi Mvai',
  'Ntcheu Central Central East',
  'Ntcheu South',
  'Mangochi North',
  'Mangochi Lutende',
  'Mangochi East',
  'Mangochi Monkey Bay',
  'Mangochi West',
  'Mangochi Central',
  'Mangochi North East',
  'Mangochi Masongola',
  'Mangochi South West',
  'Mangochi South',
  'Mangochi Malombe',
  'Mangochi Nkungulu',
  'Mangochi Municipal',
  'Machinga North East',
  'Machinga South East',
  'Machinga Central',
  'Machinga East',
  'Machinga Mikoko',
  'Machinga Central East',
  'Machinga Likwenu',
  'Machinga South',
  'Balaka Ulongwe',
  'Balaka Bwaila',
  'Balaka Ngwangwa',
  'Balaka Rivirivi',
  'Balaka Mulunguzi',
  'Zomba Malosa',
  'Zomba Nsondole',
  'Zomba Chingale',
  'Zomba Likangala',
  'Zomba Changalume',
  'Zomba Ntonya',
  'Zomba Matiya',
  'Zomba Thondwe',
  'Zomba Chikomwe',
  'Neno North',
  'Neno East',
  'Neno South',
  'Blantyre North',
  'Blantyre Central',
  'Blantyre West',
  'Blantyre North East',
  'Blantyre South West',
  'Blantyre South East',
  'Zomba City North',
  'Zomba City South',
  'Mwanza Central',
  'Mwanza West',
  'Phalombe North',
  'Phalombe North East',
  'Phalombe Machemba',
  'Phalombe South',
  'Phalombe East',
  'Chiradzulu Nyungwe',
  'Chiradzulu Masanjala',
  'Chiradzulu Thumbwe',
  'Chiradzulu Nguludi',
  'Chiradzulu Midima',
  'Mulanje North',
  'Mulanje West',
  'Mulanje Pasani',
  'Mulanje South West',
  'Mulanje Limbuli',
  'Mulanje South',
  'Mulanje Central',
  'Mulanje South East',
  'Mulanje Bale',
  'Blantyre City South Lunzu',
  'Blantyre City Michiru-Chirimba',
  'Blantyre City Mapanga-Mpingwe-Mzedi',
  'Blantyre City Ndirande Malabada Nyambadwe',
  'Blantyre City Chilomoni-Kabula-Nancholi',
  'Blantyre City Mbayani-Mussa Magasa',
  'Blantyre City Nkolokoti-Ndirande Matope',
  'Blantyre City Chichiri-Misesa',
  'Blantyre City Soche-Zingwangwa',
  'Blantyre City Chigumula-Bca-Club Banana',
  'Chikwawa West',
  'Chikwawa North',
  'Chikwawa Central West',
  'Chikwawa Central',
  'Chikwawa East',
  'Chikwawa Mkombedzi',
  'Chikwawa South',
  'Thyolo Mikolongwe',
  'Thyolo Goliati',
  'Thyolo Bvumbwe-Masenjere',
  'Thyolo Khonjeni-Mangunda',
  'Thyolo Central',
  'Thyolo Thava',
  'Thyolo Masambanjati',
  'Thyolo Thekerani',
  'Luchenza Municipal',
  'Nsanje North',
  'Nsanje Lalanje',
  'Nsanje Central',
  'Nsanje South West',
  'Nsanje South',
];

export const WARDS = [
  'Hanga Ward',
  'Nkhangwa Ward',
  'Songwe Ward',
  'Yamba Ward',
  'Kakomo Ward',
  'Kalenge Ward',
  'Lufita Ward',
  'Chisenga Ward',
  'Wenya Ward',
  'Nthalire Ward',
  'Iponga Ward',
  'Ighembe Ward',
  'Kaporo Ward',
  'Ngerenge Ward',
  'Lupembe Ward',
  'Chilanga Ward',
  'Nyungwe Ward',
  'Mlare Ward',
  'Khwawa Ward',
  'Uliwa Ward',
  'Kaluma North Ward',
  'Rukuru North Ward',
  'Rukuru South Ward',
  'Kaluma South Ward',
  'Phoka Ward',
  'Henga Ward',
  'Hewe-Nkhamanga Ward',
  'Mwazisi-Nkhamanga Ward',
  'Chitimba-Tcharo Ward',
  'Chinyolo-Mphompha Ward',
  'Bolero-Nkhamanga Ward',
  'Chozoli-Mayembe Ward',
  'Kasito West Ward',
  'Kasito East Ward',
  'Mpherembe Ward',
  'Emcisweni Ward',
  'Kavunguti Ward',
  'Ezondweni Ward',
  'Ekwendeni Ward',
  'Lusangazi Ward',
  'Mbalachanda Ward',
  'Euthini Ward',
  'Kampingo Central Ward',
  'Walula Ward',
  'Mzalangwe Ward',
  'Bulala Ward',
  'Engalaweni Ward',
  'Kapopo Ward',
  'Emthuzini Ward',
  'Manyamula Ward',
  'Boma Ward',
  'Hoho Ward',
  'Luviri Ward',
  'Mabiri Ward',
  'Khosolo North Ward',
  'Khosolo South Ward',
  'Mabulabo North Ward',
  'Mabulabo South Ward',
  'Nkhorongo-Lupaso Ward',
  'Zolozolo East Ward',
  'Luwinga Ward',
  'Zolozolo West Ward',
  'Mchengautuba North Ward',
  'Mzuzu Central West Ward',
  'Mzuzu South East Ward',
  'Mzuzu South West Ward',
  'Mchengautuba South Ward',
  'Mzuzu Central Ward',
  'Mzuzu Central East Ward',
  'Katawa-Kaning\'Ina Ward',
  'Mzuzu Central South Ward',
  'Masasa Ward',
  'Msongwe Ward',
  'Usisya Ward',
  'Chikwina Ward',
  'Mwambazi Ward',
  'Chombe Ward',
  'Bungulu Ward',
  'Thotho Ward',
  'Kavuzi Ward',
  'Chitheka Ward',
  'Maula Ward',
  'Chintheche Ward',
  'Mbamba Ward',
  'Tukombo Ward',
  'Likoma North Ward',
  'Likoma South Ward',
  'Chizumulu North Ward',
  'Chizumulu South Ward',
  'Kasitu Ward',
  'Nkhunga Ward',
  'Kabiza Ward',
  'Msenjere Ward',
  'Mpondagaga Ward',
  'Mawira Ward',
  'Kalimanjira Ward',
  'Matamangwe Ward',
  'Kasangazi Ward',
  'Mtosa Ward',
  'Chimaliro Ward',
  'Milenje Ward',
  'Matenje Ward',
  'Mpasadzi Ward',
  'Lifupa Ward',
  'Lisasadzi Ward',
  'Mafomba Ward',
  'Mthabua Ward',
  'Kachokolo Ward',
  'Livwezi Ward',
  'Ndonda Ward',
  'Mbongozi Ward',
  'Chipala Ward',
  'Lingadzi Ward',
  'Chibophi Ward',
  'Bua Ward',
  'Rusa Ward',
  'Misozi Ward',
  'Chiyanjaweni Ward',
  'Chigodi Ward',
  'Chimphangwe Ward',
  'Bunda Ward',
  'Belele Ward',
  'Chankhanga Ward',
  'Katope Ward',
  'Nguluyanawambe Ward',
  'Kaswalipande Ward',
  'Kabvunguti Ward',
  'Chithiba Ward',
  'Mnthawira Ward',
  'Mapasa Ward',
  'Mawiri Ward',
  'Malambo Ward',
  'Masangano Ward',
  'Mtsiro Ward',
  'Katete-Nthumba Ward',
  'Kaliramasamba Ward',
  'Mphunju Ward',
  'Kawoyi Ward',
  'Linthembwe Ward',
  'Natola Ward',
  'Chakhaza Ward',
  'Dzoole Ward',
  'Kayembe Ward',
  'Mphudzu Ward',
  'Mpanda West Ward',
  'Mpanda East Ward',
  'Mndolera West Ward',
  'Mndolera East Ward',
  'Msakambewa West Ward',
  'Msakambewa East Ward',
  'Machenga Ward',
  'Nambuma Ward',
  'Chiwere North East Ward',
  'Chiwere East Ward',
  'Lingadzi East Ward',
  'Lingadzi West Ward',
  'Lumbadzi West Ward',
  'Lumbadzi East Ward',
  'Kapiri Ward',
  'Mponda Ward',
  'Luweredzi Ward',
  'Mchemani Ward',
  'Mikundi Ward',
  'Chitunda Ward',
  'Msachembe Ward',
  'Mtope Ward',
  'Magawa Ward',
  'Kalumbe Ward',
  'Chimimbe Ward',
  'Naminjiwa Ward',
  'Msitu Ward',
  'Chikombe-Chiluwa Ward',
  'Chitala Ward',
  'Lipimbi-Namanda Ward',
  'Kuluunda Ward',
  'Maganga Ward',
  'Kalonga Ward',
  'Kambwiri-Chisamba Ward',
  'Pemba Ward',
  'Chipoka Urban Ward',
  'Ndindi-Kambalame Ward',
  'Chilobwe Ward',
  'Msauka Ward',
  'Mteza Ward',
  'Milindi Ward',
  'Kakhongono Ward',
  'Msewa Wards',
  'Kalambe Ward',
  'Nsaru Ward',
  'Nalikule Ward',
  'Chiwamba Ward',
  'Chowo Wards',
  'Mbavu Ward',
  'Kapatsa Ward',
  'Mapuyu Ward',
  'Mkuza Ward',
  'Nkhoma Ward',
  'Mtunthumala Ward',
  'Chiwenga Ward',
  'Mlodza Ward',
  'Chitsime Ward',
  'Sanjiko Ward',
  'Mazengera Ward',
  'Njewa Ward',
  'Chitipi Ward',
  'Kachawa Ward',
  'Kamanzi Ward',
  'Mtenthera Ward',
  'Nyanja Ward',
  'Ngala Ward',
  'Mlodzenzi Ward',
  'Dzanzi Ward',
  'Malingunde Ward',
  'Chiputu Ward',
  'Nsambe Ward',
  'Msinja Ward',
  'Nadzumi Ward',
  'Lumbadzi Ward',
  'Magwero Ward',
  'Kabwabwa Ward',
  'Dzenza Ward',
  'Chatata Ward',
  'Kauma Ward',
  'Mgona Ward',
  'Chimoka-Senti Ward',
  'Mvama Ward',
  'Chimutu Ward',
  'Mtandire Ward',
  'Chigoneka-Mtsiriza Ward',
  'Mbidzi Ward',
  'Chinsapo Ward',
  'Kawale-Biwi Ward',
  'Chilinde Ward',
  'Mwenyekondo Ward',
  'Kasuntha Ward',
  'Chipasula Ward',
  'Tsabango Ward',
  'Likuni Ward',
  'Kakule Ward',
  'Ngwenya Ward',
  'Sese Ward',
  'Tchetsa Ward',
  'Dzindevu Ward',
  'Makota Ward',
  'Mkundi Ward',
  'Chitowo Ward',
  'Matowe Ward',
  'Mankhamba Ward',
  'Chimbiya Ward',
  'Kampini Ward',
  'Bembeke Ward',
  'Umbwi Ward',
  'Khwekhwelele Ward',
  'Katewe Ward',
  'Magomero Ward',
  'Thete Ward',
  'Lobi Ward',
  'Chimoto Ward',
  'Kafere Ward',
  'Lizulu Ward',
  'Kasinje Ward',
  'Kandeu Ward',
  'Zembe Ward',
  'Mphepo Zinai Ward',
  'Chawanje Ward',
  'Mbvimbo Ward',
  'Bangala Ward',
  'Gomanichikuse Ward',
  'Kambilonjo Ward',
  'Tsangano Ward',
  'Bawi Ward',
  'Champiti Ward',
  'Ntonda Ward',
  'Likudzi Ward',
  'Makanjira North Ward',
  'Makanjira South Ward',
  'Namabvi Ward',
  'Mbwazi Ward',
  'Katuli North Ward',
  'Katuli South Ward',
  'Monkey Bay Ward',
  'Nkope Ward',
  'Malembo Ward',
  'Mvumba Ward',
  'Koche Ward',
  'Thundu Ward',
  'Malindi Ward',
  'Mikongo Ward',
  'Mandimba Ward',
  'Majuni Ward',
  'Katema-Mtimabi Ward',
  'Chilipa Ward',
  'Nlimba Ward',
  'Chipunga Ward',
  'Maiwa Ward',
  'Masanje Ward',
  'Nkungulu Ward',
  'Mpale Ward',
  'Kalungu Ward',
  'Chikole Ward',
  'Mwasa Ward',
  'Chigawe Ward',
  'Nkanamwano Ward',
  'Mtumbwasi Ward',
  'Ndege Ward',
  'Mikomwa Ward',
  'Msukamwere Ward',
  'Msikisi Ward',
  'Mpili Ward',
  'Nyambi Ward',
  'Ngokwe Ward',
  'Sagwi Ward',
  'Sonje Ward',
  'Mbonechera Ward',
  'Nkoola Ward',
  'Nchinguza Ward',
  'Mizinga Ward',
  'Kawinga Ward',
  'Kanjuli Ward',
  'Mlomba Ward',
  'Molipa Ward',
  'Sitola Ward',
  'Likwenu Ward',
  'Chikala Ward',
  'Shire Ward',
  'Nkhonde Ward',
  'Ulongwe Ward',
  'Chikowa Ward',
  'Mchengawede Ward',
  'Liwawadzi Ward',
  'Lingala Ward',
  'Chinkhumbe Ward',
  'Kangankundi Ward',
  'Nkalizi Ward',
  'Lifani Ward',
  'Naming\'Azi Ward',
  'Songani Ward',
  'Naisi Ward',
  'Milare Ward',
  'Lisanjala Ward',
  'Linthipe Ward',
  'Lake Chilwa Islands Ward',
  'Likangala North Ward',
  'Likangala South Ward',
  'Namilongo Ward',
  'Chipini Ward',
  'Namadzi Ward',
  'Ulumba Ward',
  'Buleya Ward',
  'Kankhomba Ward',
  'Pirimiti Ward',
  'Chimwalira Ward',
  'Jenala Ward',
  'Chanda Ward',
  'Sunuzi Ward',
  'Chilimbondo Ward',
  'Chikonde Ward',
  'Matope Ward',
  'Lisungwi Ward',
  'Ligowe Ward',
  'Chifunga Ward',
  'Chikwembere Ward',
  'Linjidzi Ward',
  'Matindi-Dziwe Ward',
  'Ntenjera Ward',
  'Chikuli Ward',
  'Katondo Ward',
  'Chitukuko Ward',
  'Chitsanzo Ward',
  'Chigwaja Ward',
  'Mpemba Ward',
  'Naotcha Ward',
  'Soche Ward',
  'Masongola Ward',
  'Chinamwali Ward',
  'Chirunga Ward',
  'Zomba Central Ward',
  'Likangala Ward',
  'Mtiya Ward',
  'Chambo Ward',
  'Mbedza Ward',
  'Mpira Ward',
  'Sadzi Ward',
  'Khudze Ward',
  'Mitseche Ward',
  'Mpandadzi Ward',
  'Thambani Ward',
  'Khongoloni Wards',
  'Swang\'Oma Ward',
  'Mauzi Ward',
  'Namisangwani Ward',
  'Mpasa Ward',
  'Likulezi Ward',
  'Mulomba Ward',
  'Chiringa Ward',
  'Sukasanje Ward',
  'Nkhande Ward',
  'Mbulumbuzi Ward',
  'Mwanje Ward',
  'Mombezi Ward',
  'Nanjati Ward',
  'Maera Ward',
  'Chisombezi Ward',
  'Malabvi Ward',
  'Mitumbira Ward',
  'Sakata Ward',
  'Nambilanje Ward',
  'Namboya Ward',
  'Chambe Ward',
  'Chole Ward',
  'Mulemba Ward',
  'Muloza Ward',
  'Limbuli Ward',
  'Chitakale Ward',
  'Lujeri Ward',
  'Mtenjera Ward',
  'Thabwa Ward',
  'Mimosa Ward',
  'Milonde Ward',
  'Msikawanjala Ward',
  'Mkumbiza Ward',
  'Mthawira Ward',
  'South Lunzu Ward',
  'Nkolokoti Chikapa Ward',
  'Michiru Ward',
  'Chirimba Ward',
  'Namatete Ward',
  'Mapanga-Mzedi Ward',
  'Mpingwe Ward',
  'Bangwe-Mtopwa Ward',
  'Ndirande Malabada Ward',
  'Nyambadwe-Ndirande New Lines-Ginnery Corner Ward',
  'Ndirande-Makata Ward',
  'Chilomoni Ward',
  'Namiwawa-Sunnyside Ward',
  'Nancholi Manyowe Ward',
  'Mbayani-Mussa Magasa Ward',
  'Mbayani Railway Line Ward',
  'Mbayani-Tam-Tam Ward',
  'Nkoloti-Ndirande Mountain Catchment Ward',
  'Maone Ward',
  'Ndirande Matope Ward',
  'Misesa Ward',
  'Kapeni Manje Ward',
  'Chigumula Ccap-Namame Ward',
  'Chitawira-Nkolokosa-Manja Ward',
  'Mibawa-Bizimack Ward',
  'Soche- Chimwankhunda-Namwiri Ward',
  'Chigumula-Club Banana Ward',
  'Bangwe-Namiyango Ward',
  'Bca Hills-Chigumula Ward',
  'Chimwanjale Ward',
  'Chibisa Ward',
  'Ndalanda Ward',
  'Mwamphanzi Ward',
  'Lengwe Ward',
  'Nchalo Ward',
  'Bwabwali Ward',
  'Mtchombwa Ward',
  'Makhwira North Ward',
  'Makhwira South Ward',
  'Mikalango Ward',
  'Alumenda Ward',
  'Makande Ward',
  'Dolo Ward',
  'Mikolongwe Ward',
  'Chinamuhuru Ward',
  'Muonekera Ward',
  'Mtundawosema Ward',
  'Bvumbwe-Ngomano Ward',
  'Masenjere-Madwale Ward',
  'Mangunda Ward',
  'Khonjeni Ward',
  'Masambankhunda-Mpeni Ward',
  'Nchima Ward',
  'Dzimbiri Ward',
  'Thava Ward',
  'Masambanjati Ward',
  'Zowa Ward',
  'Mapanga Ward',
  'Thekerani Ward',
  'Thuchila Ward',
  'Mthundu Ward',
  'Namisonga Ward',
  'Sambagalu Ward',
  'Kalulu Ward',
  'Ruo Ward',
  'Lalanje Ward',
  'Mlonda Ward',
  'Misamvu Ward',
  'Chigumukire Ward',
  'Nyamadzele Ward',
  'Chekerere Ward',
  'Matundu Ward',
  'Nyachilenda Ward',
];

export const SECTORS = COMMUNITY_DEVELOPMENT_SECTORS;

export function getProjectBeneficiaryType(p: Project): string {
  if (p.beneficiaryType && (BENEFICIARY_TYPES as readonly string[]).includes(p.beneficiaryType)) {
    return p.beneficiaryType;
  }
  if (
    p.initiativeComponent === 'Sports Development Fund' ||
    p.initiativeComponent === 'Creative Arts & Innovation' ||
    p.component === 'Sports Development Fund' ||
    p.component === 'Creative Arts and Innovation' ||
    p.sector?.toLowerCase().includes('sport') ||
    p.name.toLowerCase().includes('sport') ||
    p.name.toLowerCase().includes('creative') ||
    p.name.toLowerCase().includes('art')
  ) {
    return 'Sports, creative arts & Innovation';
  }
  if (
    p.initiativeComponent === 'Women Economic Empowerment' ||
    p.component === 'Women Economic Empowerment Initiative' ||
    p.name.toLowerCase().includes('women') ||
    p.name.toLowerCase().includes('maternity')
  ) {
    return 'Women Entrepreneurs';
  }
  if (
    p.initiativeComponent === 'Youth Enterprise fund' ||
    p.component === 'Youth Enterprise Fund' ||
    p.name.toLowerCase().includes('youth')
  ) {
    return 'Youth Entrepreneurs';
  }
  if (
    p.initiativeComponent === 'School Bursaries' ||
    p.component === 'School Bursaries' ||
    p.sector === 'Education' ||
    p.name.toLowerCase().includes('school') ||
    p.name.toLowerCase().includes('classroom') ||
    p.name.toLowerCase().includes('fp') ||
    p.name.toLowerCase().includes('jp')
  ) {
    return 'Students';
  }
  return 'District-Wide';
}

export const IMPLEMENTING_DEPTS = [
  'Likoma District Council',
  'Ministry of Education',
  'Ministry of Health',
  'Department of Roads',
  'Ministry of Agriculture',
  'ESCOM / Ministry of Energy',
  'Department of Fisheries',
  'Water & Sanitation Dept',
  'Ministry of Energy',
];

// ─────────────────────────────────────────────────────────────────────────────
// MAP POSITIONS - clustered in Lake Malawi (northeast of Malawi map)
// Chizumulu Island ≈ top:20–35, left:60–72
// Likoma Island ≈ top:18–34, left:70–80
// ─────────────────────────────────────────────────────────────────────────────
export const MAP_POSITIONS: Record<string, { top: number; left: number }> = {
  'CY-2026-001': { top: 18, left: 63 },
  'CY-2026-002': { top: 22, left: 67 },
  'CY-2026-003': { top: 26, left: 62 },
  'CY-2026-004': { top: 20, left: 69 },
  'CY-2026-005': { top: 29, left: 61 },
  'CY-2026-006': { top: 32, left: 65 },
  'CY-2026-007': { top: 28, left: 58 },
  'CY-2026-008': { top: 34, left: 63 },
  'CY-2026-009': { top: 20, left: 74 },
  'CY-2026-010': { top: 24, left: 71 },
  'CY-2026-011': { top: 22, left: 77 },
  'CY-2026-012': { top: 18, left: 72 },
  'CY-2026-013': { top: 28, left: 75 },
  'CY-2026-014': { top: 31, left: 73 },
  'CY-2026-015': { top: 33, left: 78 },
  'CY-2026-016': { top: 26, left: 77 },
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULED VISITS
// ─────────────────────────────────────────────────────────────────────────────
export interface ScheduledVisit {
  id: string;
  projectId: string;
  projectName: string;
  monitorId: string;
  monitorName: string;
  date: string;
  time: string;
  ward: string;
  notes: string;
  status: 'Upcoming' | 'Acknowledged' | 'Completed' | 'Missed' | 'Rescheduled';
  acknowledgedAt: string;
  scheduledBy: string;
  scheduledAt: string;
  rescheduledFrom?: string;
}

export const scheduledVisits: ScheduledVisit[] = [
  // James Phiri - Chizumulu North
  { id: 'V-015', projectId: 'CY-2026-001', projectName: 'Chiteko–Mocho Road Rehabilitation', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-09-05', time: '08:00', ward: 'Chizumulu North Ward', notes: 'Inspect km 5–8. Verify drainage culverts and gravel compaction quality.', status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-08-25' },
  { id: 'V-014', projectId: 'CY-2026-003', projectName: 'Chiteko Bridge Reconstruction', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-09-10', time: '10:00', ward: 'Chizumulu North Ward', notes: 'Inspect reinforcement work and verify concrete mix quality at bridge deck.', status: 'Acknowledged', acknowledgedAt: '2026-08-26T09:30', scheduledBy: 'Admin', scheduledAt: '2026-08-24' },
  { id: 'V-013', projectId: 'CY-2026-004', projectName: 'Chizumulu Solar Plant Capacity Expansion', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-15', time: '09:00', ward: 'Chizumulu North Ward', notes: 'Verify panel installation progress and battery room setup.', status: 'Completed', acknowledgedAt: '2026-08-12', scheduledBy: 'Admin', scheduledAt: '2026-08-10' },
  { id: 'V-012', projectId: 'CY-2026-001', projectName: 'Chiteko–Mocho Road Rehabilitation', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-20', time: '08:30', ward: 'Chizumulu North Ward', notes: 'Monthly progress inspection - km 3–5.', status: 'Completed', acknowledgedAt: '2026-08-17', scheduledBy: 'Admin', scheduledAt: '2026-08-15' },
  { id: 'V-011', projectId: 'CY-2026-002', projectName: 'Chiteko FP 3-Classroom Block', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-01', time: '11:00', ward: 'Chizumulu North Ward', notes: 'Final completion handover inspection.', status: 'Missed', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-07-28' },

  // Grace Banda - Chizumulu South
  { id: 'V-016', projectId: 'CY-2026-005', projectName: 'Same–Bama Road Improvement', monitorId: 'M002', monitorName: 'Grace Banda', date: '2026-09-08', time: '09:00', ward: 'Chizumulu South Ward', notes: 'Final gravelling inspection and drainage sign-off.', status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-08-28' },
  { id: 'V-017', projectId: 'CY-2026-006', projectName: 'Mocho JP Classroom Extension', monitorId: 'M002', monitorName: 'Grace Banda', date: '2026-08-25', time: '14:00', ward: 'Chizumulu South Ward', notes: 'Progress check - roofing and window-frame status.', status: 'Completed', acknowledgedAt: '2026-08-23', scheduledBy: 'Admin', scheduledAt: '2026-08-20' },

  // Stella Mkandawire - Likoma North
  { id: 'V-018', projectId: 'CY-2026-009', projectName: 'Makulawe–Nkhwazi Road Rehabilitation', monitorId: 'M003', monitorName: 'Stella Mkandawire', date: '2026-09-12', time: '08:00', ward: 'Likoma North Ward', notes: 'Quality inspection of gravelling works - bring engineer report.', status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-08-29' },

  // Peter Kachingwe - Likoma South
  { id: 'V-019', projectId: 'CY-2026-015', projectName: 'Likoma Fisheries Processing Facility', monitorId: 'M004', monitorName: 'Peter Kachingwe', date: '2026-09-03', time: '10:00', ward: 'Likoma South Ward', notes: 'Initial site visit - foundation and cold-room construction verification.', status: 'Upcoming', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-08-28' },
  { id: 'V-020', projectId: 'CY-2026-016', projectName: "St Peter's Hospital Maternity Wing", monitorId: 'M004', monitorName: 'Peter Kachingwe', date: '2026-08-05', time: '09:00', ward: 'Likoma South Ward', notes: 'Pre-assessment site verification for maternity wing construction.', status: 'Missed', acknowledgedAt: '', scheduledBy: 'Admin', scheduledAt: '2026-08-01' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MONITOR SUBMISSIONS
// ─────────────────────────────────────────────────────────────────────────────
export interface MonitorSubmission {
  id: string;
  projectId: string;
  projectName: string;
  monitorId: string;
  monitorName: string;
  date: string;
  progress: number;
  status: 'Pending Review' | 'Approved' | 'Returned';
  observation: string;
  milestone: string;
  photoCount: number;
  gpsLat: string;
  gpsLng: string;
  adminNote: string;
  reviewedAt: string;
  ward?: string;
  photos?: string[];
}

export const monitorSubmissions: MonitorSubmission[] = [
  { id: 'SUB-012', projectId: 'CY-2026-001', projectName: 'Chiteko–Mocho Road Rehabilitation', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-20', progress: 65, status: 'Approved', observation: 'Road works on km 3–5 progressing well. Gravel compaction complete on this section. Workers and equipment operational six days a week.', milestone: 'Gravelling of km 5–8 by 31 Aug 2026', photoCount: 5, gpsLat: '-11.965', gpsLng: '34.578', adminNote: 'Good report. Continue monitoring km 5–8 section.', reviewedAt: '2026-08-22', photos: [] },
  { id: 'SUB-011', projectId: 'CY-2026-003', projectName: 'Chiteko Bridge Reconstruction', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-22', progress: 45, status: 'Pending Review', observation: 'Abutment works are complete and formwork for the bridge deck is being assembled. Reinforcement bars delivered but community raised quality concerns.', milestone: 'Bridge deck pour by 10 Sep 2026', photoCount: 4, gpsLat: '-11.972', gpsLng: '34.575', adminNote: '', reviewedAt: '', photos: [] },
  { id: 'SUB-010', projectId: 'CY-2026-004', projectName: 'Chizumulu Solar Plant Capacity Expansion', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-15', progress: 30, status: 'Approved', observation: 'Additional solar panels installed on the south array. Battery bank expansion in progress. New inverter room foundation laid.', milestone: 'Battery bank installation by 20 Sep 2026', photoCount: 6, gpsLat: '-11.963', gpsLng: '34.585', adminNote: 'Report accepted. Good documentation.', reviewedAt: '2026-08-17', photos: [] },
  { id: 'SUB-009', projectId: 'CY-2026-001', projectName: 'Chiteko–Mocho Road Rehabilitation', monitorId: 'M001', monitorName: 'James Phiri', date: '2026-08-01', progress: 50, status: 'Returned', observation: 'Works ongoing on km 3–5. Some sections need re-grading after rain damage.', milestone: '', photoCount: 2, gpsLat: '-11.965', gpsLng: '34.578', adminNote: 'Insufficient photo documentation. Please resubmit with at least 4 photos showing all damaged sections clearly.', reviewedAt: '2026-08-03', photos: [] },
  { id: 'SUB-008', projectId: 'CY-2026-005', projectName: 'Same–Bama Road Improvement', monitorId: 'M002', monitorName: 'Grace Banda', date: '2026-08-25', progress: 85, status: 'Pending Review', observation: 'Gravelling 90% complete on the Same–Bama corridor. Drainage structures all installed. Final section near Bama village being finished.', milestone: 'Final gravelling and sign-off by 30 Sep', photoCount: 7, gpsLat: '-11.998', gpsLng: '34.572', adminNote: '', reviewedAt: '', photos: [] },
  { id: 'SUB-007', projectId: 'CY-2026-008', projectName: 'Chizumulu Health Centre Renovation', monitorId: 'M002', monitorName: 'Grace Banda', date: '2026-08-10', progress: 50, status: 'Approved', observation: 'Maternity wing structure complete up to lintel level. Pharmacy store walls finished. Roofing materials on site ready for installation.', milestone: 'Roofing complete by 20 Sep 2026', photoCount: 8, gpsLat: '-11.995', gpsLng: '34.565', adminNote: 'Excellent documentation. Continue monitoring roofing phase.', reviewedAt: '2026-08-12', photos: [] },
  { id: 'SUB-006', projectId: 'CY-2026-009', projectName: 'Makulawe–Nkhwazi Road Rehabilitation', monitorId: 'M003', monitorName: 'Stella Mkandawire', date: '2026-08-28', progress: 55, status: 'Pending Review', observation: 'Gravelling of Makulawe–Yofu spur completed. Main Makulawe–Nkhwazi section at 50%. Culvert at stream crossing installed successfully.', milestone: 'Main road gravelling completion by 30 Sep', photoCount: 8, gpsLat: '-12.062', gpsLng: '34.728', adminNote: '', reviewedAt: '', photos: [] },
];

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export interface SysNotification {
  id: string;
  for: 'admin' | 'monitor';
  monitorId?: string;
  monitorName?: string;
  ward?: string;
  type: 'visit_scheduled' | 'visit_rescheduled' | 'acknowledgement' | 'missed_visit' | 'submission' | 'submission_approved' | 'submission_returned' | 'project_progress_updated' | 'project_assigned' | 'ward_assignment' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
  visitId?: string;
  submissionId?: string;
  projectId?: string;
}

export const sysNotifications: SysNotification[] = [
  { id: 'SN-001', for: 'admin', monitorId: 'M001', type: 'acknowledgement', title: 'Visit Acknowledged', message: 'James Phiri acknowledged the scheduled visit to Chiteko Bridge Reconstruction on 10 Sep 2026.', date: '2026-08-26', read: false, visitId: 'V-014', projectId: 'CY-2026-003' },
  { id: 'SN-002', for: 'admin', monitorId: 'M001', type: 'missed_visit', title: 'Missed Visit Alert', message: 'James Phiri missed the scheduled visit to Chiteko FP 3-Classroom Block (01 Aug 2026). Follow up required.', date: '2026-08-02', read: false, visitId: 'V-011', projectId: 'CY-2026-002' },
  { id: 'SN-003', for: 'admin', monitorId: 'M001', type: 'submission', title: 'New Report Submitted', message: 'James Phiri submitted a field report for Chiteko Bridge Reconstruction (45% progress). Awaiting review.', date: '2026-08-22', read: false, submissionId: 'SUB-011', projectId: 'CY-2026-003' },
  { id: 'SN-004', for: 'admin', monitorId: 'M002', type: 'submission', title: 'New Report Submitted', message: 'Grace Banda submitted a field report for Same–Bama Road Improvement (85% progress). Awaiting review.', date: '2026-08-25', read: true, submissionId: 'SUB-008', projectId: 'CY-2026-005' },
  { id: 'SN-005', for: 'admin', monitorId: 'M003', type: 'submission', title: 'New Report Submitted', message: 'Stella Mkandawire submitted a field report for Makulawe–Nkhwazi Road Rehabilitation (55% progress). Awaiting review.', date: '2026-08-28', read: false, submissionId: 'SUB-006', projectId: 'CY-2026-009' },
  { id: 'SN-006', for: 'admin', monitorId: 'M004', type: 'missed_visit', title: 'Missed Visit Alert', message: "Peter Kachingwe missed the scheduled visit to St Peter's Hospital Maternity Wing (05 Aug 2026). Follow up required.", date: '2026-08-06', read: true, visitId: 'V-020', projectId: 'CY-2026-016' },
  { id: 'SN-007', for: 'monitor', monitorId: 'M001', type: 'visit_scheduled', title: 'New Visit Scheduled', message: 'Admin scheduled a site visit to Chiteko–Mocho Road Rehabilitation on 05 Sep 2026 at 08:00. Please acknowledge.', date: '2026-08-25', read: false, visitId: 'V-015', projectId: 'CY-2026-001' },
  { id: 'SN-008', for: 'monitor', monitorId: 'M001', type: 'submission_approved', title: 'Report Approved', message: 'Your field report SUB-012 for Chiteko–Mocho Road Rehabilitation has been approved. Good work!', date: '2026-08-22', read: true, submissionId: 'SUB-012', projectId: 'CY-2026-001' },
  { id: 'SN-009', for: 'monitor', monitorId: 'M001', type: 'submission_returned', title: 'Report Returned for Correction', message: 'Your field report SUB-009 for Chiteko–Mocho Road Rehabilitation was returned. Please add more photos and resubmit.', date: '2026-08-03', read: true, submissionId: 'SUB-009', projectId: 'CY-2026-001' },
];

// ─────────────────────────────────────────────────────────────────────────────
// USER ACCOUNTS
// ─────────────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'monitor';
  monitorId?: string;
  joinDate: string;
  photoUrl?: string;
}

export const defaultUsers: User[] = [
  { id: 'U-admin', name: 'Council Admin', email: 'admin@councilyanga.mw', password: 'Admin@2026', role: 'admin', joinDate: '2026-01-01' },
  { id: 'U-M001', name: 'James Phiri', email: 'j.phiri@councilyanga.mw', password: 'Monitor@2026', role: 'monitor', monitorId: 'M001', joinDate: '2026-01-15' },
  { id: 'U-M002', name: 'Grace Banda', email: 'g.banda@councilyanga.mw', password: 'Monitor@2026', role: 'monitor', monitorId: 'M002', joinDate: '2026-01-15' },
  { id: 'U-M003', name: 'Stella Mkandawire', email: 's.mkandawire@councilyanga.mw', password: 'Monitor@2026', role: 'monitor', monitorId: 'M003', joinDate: '2025-12-01' },
  { id: 'U-M004', name: 'Peter Kachingwe', email: 'p.kachingwe@councilyanga.mw', password: 'Monitor@2026', role: 'monitor', monitorId: 'M004', joinDate: '2026-08-20' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS COLORS (map legend)
// ─────────────────────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  Completed: '#16a34a',
  Ongoing: '#2563eb',
  'Near Completion': '#d97706',
  'Not Started': '#9ca3af',
  Approved: '#0891b2',
  Assessed: '#7c3aed',
  Proposed: '#6b7280',
  Suspended: '#dc2626',
  'On Hold': '#f59e0b',
  Stalled: '#ef4444',
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
export const formatMK = (n: number) =>
  n >= 1000000
    ? `MK ${(n / 1000000).toFixed(1)}M`
    : `MK ${n.toLocaleString()}`;

export function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => String(row[h] ?? '')).join('\t'));
  const tsv = [headers.join('\t'), ...rows].join('\n');
  const blob = new Blob([tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(title: string, headers: string[], rows: string[][], kpiHtml = '') {
  const html = `<!DOCTYPE html><html><head><title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #111; }
    h1 { color: #145a32; font-size: 18px; margin-bottom: 4px; }
    p { font-size: 11px; color: #666; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #145a32; color: white; padding: 8px 6px; text-align: left; }
    td { padding: 6px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f0fdf4; }
    .footer { margin-top: 16px; font-size: 10px; color: #9ca3af; }
  </style></head><body>
  <h1>${title}</h1>
  <p>Likoma District Constituency &bull; Generated: ${new Date().toLocaleDateString('en-GB')} &bull; CDF Year 2025/2026</p>
  ${kpiHtml}
  <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
  <div class="footer">Information | Participation | Accountability &bull; Likoma District Council Document</div>
  </body></html>`;
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 400);
  }
}

export function getProjectDisbursed(p: Project): number {
  if (typeof p.disbursed === 'number') return p.disbursed;
  if (p.status === 'Completed') return p.budget;
  if (p.status === 'Near Completion') return Math.round(p.budget * 0.9);
  if (p.status === 'Ongoing') {
    const pct = Math.max(0.65, (p.progress || 50) / 100);
    return Math.round(p.budget * pct);
  }
  if (p.status === 'Approved' || p.status === 'Assessed') {
    return Math.round(p.budget * 0.2);
  }
  return 0;
}

export function getProjectUtilised(p: Project): number {
  if (typeof (p as any).utilised === 'number') return (p as any).utilised;
  if (typeof (p as any).spent === 'number') return (p as any).spent;
  const disbursed = getProjectDisbursed(p);
  if (disbursed === 0) return 0;
  if (p.status === 'Completed') return disbursed;
  if (p.status === 'Near Completion') {
    const rate = Math.min(0.98, Math.max(0.85, (p.progress || 88) / 100));
    return Math.round(disbursed * rate);
  }
  if (p.status === 'Ongoing') {
    const rate = Math.min(0.95, Math.max(0.40, (p.progress || 50) / 100));
    return Math.round(disbursed * rate);
  }
  if (p.status === 'Approved' || p.status === 'Assessed') {
    return Math.round(disbursed * 0.25);
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// WARD STATUS TRACKING PHOTOS
// ─────────────────────────────────────────────────────────────────────────────
export interface WardStatusPhoto {
  id: string;
  constituency: string; // 'Likoma Island' | 'Chizumulu Island'
  ward: string;         // 'Chizumulu Ward' | 'Likoma Ward'
  category: 'Project' | 'Initiative';
  status: string;       // 'Proposed' | 'Assessed' | 'Ongoing' | 'Near Completion' | 'Completed' | 'Suspended'
  url: string;
  caption: string;
  projectId?: string;
  projectName?: string;
  monitor?: string;
  date?: string;
  uploadedAt: string;
}

export const initialWardStatusPhotos: WardStatusPhoto[] = [
  // ── Chizumulu Ward - Projects ────────────────────────────
  {
    id: 'WSP-CHZ-P-01',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Project',
    status: 'Proposed',
    url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
    caption: 'Chizumulu jetty and ring road corridor boundary identification and beacon setting with ADC',
    monitor: 'Stella Mkandawire',
    date: '10 Feb 2026',
    uploadedAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: 'WSP-CHZ-P-02',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Project',
    status: 'Assessed',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Engineering site soil investigation and coastal terrain assessment for drainage structures',
    monitor: 'Stella Mkandawire',
    date: '28 Feb 2026',
    uploadedAt: '2026-02-28T09:30:00.000Z',
  },
  {
    id: 'WSP-CHZ-P-03',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Project',
    status: 'Ongoing',
    projectId: 'CY-2026-013',
    projectName: 'Chizumulu Island Access Road Rehabilitation',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Road sub-base compaction, stone masonry retaining walls and drainage culvert casting near Khuyu',
    monitor: 'Peter Kachingwe',
    date: '18 Aug 2026',
    uploadedAt: '2026-08-18T11:00:00.000Z',
  },
  {
    id: 'WSP-CHZ-P-04',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Project',
    status: 'Near Completion',
    projectId: 'CY-2026-015',
    projectName: 'Chizumulu Community Fish Processing & Cold Storage Facility',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    caption: 'Fish processing concrete landing slab, fresh water lines and solar drying racks final touch-up',
    monitor: 'Peter Kachingwe',
    date: '24 Aug 2026',
    uploadedAt: '2026-08-24T14:15:00.000Z',
  },
  {
    id: 'WSP-CHZ-P-05',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Project',
    status: 'Completed',
    projectId: 'CY-2026-014',
    projectName: 'Same Community Day Secondary School Classroom Block',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Fully completed classroom block with desks, blackboards and solar lighting handed over to school committee',
    monitor: 'Stella Mkandawire',
    date: '03 Jun 2026',
    uploadedAt: '2026-06-03T10:00:00.000Z',
  },

  // ── Chizumulu Ward - Initiatives ──────────────────────────
  {
    id: 'WSP-CHZ-I-01',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Initiative',
    status: 'Proposed',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    caption: 'Community meeting with artisanal fishermen and youth cooperatives on enterprise equipment procurement',
    monitor: 'Stella Mkandawire',
    date: '14 Jan 2026',
    uploadedAt: '2026-01-14T10:00:00.000Z',
  },
  {
    id: 'WSP-CHZ-I-02',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Initiative',
    status: 'Assessed',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ward enterprise evaluation committee validating youth applicant groups and fishing cooperative business plans',
    monitor: 'Stella Mkandawire',
    date: '18 Feb 2026',
    uploadedAt: '2026-02-18T13:30:00.000Z',
  },
  {
    id: 'WSP-CHZ-I-03',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Initiative',
    status: 'Ongoing',
    projectId: 'CY-2026-004',
    projectName: 'Chizumulu Artisanal Fisheries Youth Cooperative Support',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    caption: 'Youth fishing cooperative members utilizing new safety gear, insulated cold boxes and solar equipment',
    monitor: 'Stella Mkandawire',
    date: '19 Aug 2026',
    uploadedAt: '2026-08-19T16:00:00.000Z',
  },
  {
    id: 'WSP-CHZ-I-04',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Initiative',
    status: 'Near Completion',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    caption: 'Chizumulu youth eco-tourism and artisanal handicrafts showcase center setup and inventory audit',
    monitor: 'Peter Kachingwe',
    date: '22 Aug 2026',
    uploadedAt: '2026-08-22T11:45:00.000Z',
  },
  {
    id: 'WSP-CHZ-I-05',
    constituency: 'Chizumulu Island',
    ward: 'Chizumulu Ward',
    category: 'Initiative',
    status: 'Completed',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    caption: 'Graduation of first cohort of 40 young fishermen and agro-processors under the enterprise development fund',
    monitor: 'Stella Mkandawire',
    date: '02 Jun 2026',
    uploadedAt: '2026-06-02T14:00:00.000Z',
  },

  // ── Likoma Ward - Projects ───────────────────────────────
  {
    id: 'WSP-LIK-P-01',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Project',
    status: 'Proposed',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    caption: 'Proposed community solar water desalination and pumping station site survey in Mbamba',
    monitor: 'Peter Kachingwe',
    date: '12 Jan 2026',
    uploadedAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'WSP-LIK-P-02',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Project',
    status: 'Assessed',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
    caption: 'Civil engineering structural foundation inspection for St. Peter’s hospital maternity wing expansion',
    monitor: 'Peter Kachingwe',
    date: '20 Feb 2026',
    uploadedAt: '2026-02-20T10:15:00.000Z',
  },
  {
    id: 'WSP-LIK-P-03',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Project',
    status: 'Ongoing',
    projectId: 'CY-2026-012',
    projectName: 'Likoma Solar Mini-Grid & Distribution Network',
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Solar panel array ground mounting, inverter synchronizer wiring and distribution pole erection in Likoma Ward',
    monitor: 'Peter Kachingwe',
    date: '25 Aug 2026',
    uploadedAt: '2026-08-25T15:30:00.000Z',
  },
  {
    id: 'WSP-LIK-P-04',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Project',
    status: 'Near Completion',
    projectId: 'CY-2026-016',
    projectName: 'St. Peter’s Hospital Maternity & Child Health Wing',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Interior clinical ward partitions, sanitary plumbing, floor tiles and access ramp railings installation',
    monitor: 'Peter Kachingwe',
    date: '27 Aug 2026',
    uploadedAt: '2026-08-27T12:00:00.000Z',
  },
  {
    id: 'WSP-LIK-P-05',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Project',
    status: 'Completed',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    caption: 'Mbamba Primary School dual-block classroom refurbishment and perimeter fence commissioning',
    monitor: 'Peter Kachingwe',
    date: '15 May 2026',
    uploadedAt: '2026-05-15T11:00:00.000Z',
  },

  // ── Likoma Ward - Initiatives ─────────────────────────────
  {
    id: 'WSP-LIK-I-01',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Initiative',
    status: 'Proposed',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    caption: 'Likoma Women Entrepreneurs tailoring and agro-processing cooperative proposal review meeting with community leaders',
    monitor: 'Peter Kachingwe',
    date: '15 Jan 2026',
    uploadedAt: '2026-01-15T09:30:00.000Z',
  },
  {
    id: 'WSP-LIK-I-02',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Initiative',
    status: 'Assessed',
    url: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1000&q=80',
    caption: 'On-site technical evaluation of workshop premises and equipment specifications for women textile enterprise',
    monitor: 'Peter Kachingwe',
    date: '24 Feb 2026',
    uploadedAt: '2026-02-24T14:00:00.000Z',
  },
  {
    id: 'WSP-LIK-I-03',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Initiative',
    status: 'Ongoing',
    projectId: 'CY-2026-003',
    projectName: 'Likoma Women Entrepreneurs Tailoring Collective',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Women entrepreneurs operating high-grade electric sewing and embroidery machines producing commercial school uniforms',
    monitor: 'Peter Kachingwe',
    date: '21 Aug 2026',
    uploadedAt: '2026-08-21T10:30:00.000Z',
  },
  {
    id: 'WSP-LIK-I-04',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Initiative',
    status: 'Near Completion',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    caption: 'Youth digital innovation hub computer workstations and high-speed satellite connectivity testing in Likoma Ward',
    monitor: 'Peter Kachingwe',
    date: '26 Aug 2026',
    uploadedAt: '2026-08-26T16:20:00.000Z',
  },
  {
    id: 'WSP-LIK-I-05',
    constituency: 'Likoma Island',
    ward: 'Likoma Ward',
    category: 'Initiative',
    status: 'Completed',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Handover of commercial tailoring center and disbursement of seed capital to 65 certified women entrepreneurs',
    monitor: 'Peter Kachingwe',
    date: '08 Jun 2026',
    uploadedAt: '2026-06-08T11:00:00.000Z',
  },
];

const WARD_PHOTOS_STORAGE_KEY = 'likoma_ward_status_photos_v1';

export function getStoredWardStatusPhotos(): WardStatusPhoto[] {
  try {
    const raw = localStorage.getItem(WARD_PHOTOS_STORAGE_KEY);
    if (!raw) return initialWardStatusPhotos;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let hasRepair = false;
      const healed = parsed.map((p: WardStatusPhoto) => {
        let updated = { ...p };
        if (
          (p.id === 'WSP-CHZ-P-01' || p.caption?.includes('Chizumulu jetty')) &&
          (p.url?.includes('photo-1541888946425-d0fbb186c5f8') || !p.url)
        ) {
          hasRepair = true;
          updated.url = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80';
        }
        if (updated.caption && updated.caption.includes(', and')) {
          hasRepair = true;
          updated.caption = updated.caption.replace(/, and/g, ' and');
        }
        return updated;
      });
      if (hasRepair) {
        saveStoredWardStatusPhotos(healed);
      }
      return healed;
    }
    return initialWardStatusPhotos;
  } catch {
    return initialWardStatusPhotos;
  }
}

export function saveStoredWardStatusPhotos(photos: WardStatusPhoto[]): void {
  try {
    localStorage.setItem(WARD_PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save ward status photos to localStorage', err);
  }
}

const PROJECTS_STORAGE_KEY = 'likoma_projects_v1';

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return projects;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load projects from localStorage', err);
  }
  return projects;
}

export function saveStoredProjects(list: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save projects to localStorage', err);
  }
}


