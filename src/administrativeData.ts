// Administrative Hierarchy for Malawi Districts, Constituencies and Wards
// Reference data for cascading filters in Admin and Public Portal

export interface DistrictStructure {
  [constituency: string]: string[];
}

export interface AdministrativeData {
  [district: string]: DistrictStructure;
}

export const MALAWI_ADMIN_HIERARCHY: AdministrativeData = {
  'Chitipa': {
    'Chitipa North': ['Hanga Ward', 'Nkhangwa Ward'],
    'Chitipa Central': ['Songwe Ward', 'Yamba Ward'],
    'Chitipa East': ['Kakomo Ward', 'Kalenge Ward'],
    'Chitipa Chendo': ['Lufita Ward', 'Chisenga Ward'],
    'Chitipa South': ['Wenya Ward', 'Nthalire Ward'],
  },
  'Karonga': {
    'Karonga Songwe': ['Iponga Ward', 'Ighembe Ward'],
    'Karonga Lufilya': ['Kaporo Ward', 'Ngerenge Ward'],
    'Karonga Central': ['Lupembe Ward', 'Chilanga Ward'],
    'Karonga Nyungwe': ['Nyungwe Ward', 'Mlare Ward'],
    'Karonga South': ['Khwawa Ward', 'Uliwa Ward'],
  },
  'Karonga Town': {
    'Karonga Town': ['Kaluma North Ward', 'Rukuru North Ward', 'Rukuru South Ward', 'Kaluma South Ward'],
  },
  'Rumphi': {
    'Rumphi North': ['Phoka Ward', 'Henga Ward'],
    'Rumphi West': ['Hewe-Nkhamanga Ward', 'Mwazisi-Nkhamanga Ward'],
    'Rumphi East': ['Chitimba-Tcharo Ward', 'Chinyolo-Mphompha Ward'],
    'Rumphi Central': ['Bolero-Nkhamanga Ward', 'Chozoli-Mayembe Ward'],
  },
  'Mzimba': {
    'Mzimba North': ['Kasito West Ward', 'Kasito East Ward'],
    'Mzimba West': ['Mpherembe Ward', 'Emcisweni Ward'],
    'Mzimba Kafukule': ['Kavunguti Ward', 'Ezondweni Ward'],
    'Mzimba North East': ['Ekwendeni Ward', 'Lusangazi Ward'],
    'Mzimba Central': ['Mbalachanda Ward', 'Euthini Ward'],
    'Mzimba East': ['Kampingo Central Ward', 'Walula Ward'],
    'Mzimba Hora': ['Mzalangwe Ward', 'Bulala Ward'],
    'Mzimba South West': ['Engalaweni Ward', 'Kapopo Ward'],
    'Mzimba Solola': ['Emthuzini Ward', 'Manyamula Ward'],
    'Mzimba Perekezi': ['Boma Ward', 'Hoho Ward'],
    'Mzimba South': ['Luviri Ward', 'Mabiri Ward'],
    'Mzimba South East': ['Khosolo North Ward', 'Khosolo South Ward'],
    'Mzimba Luwerezi': ['Mabulabo North Ward', 'Mabulabo South Ward'],
  },
  'Mzuzu City': {
    'Mzuzu City North': ['Nkhorongo-Lupaso Ward', 'Zolozolo East Ward', 'Luwinga Ward', 'Zolozolo West Ward'],
    'Mzuzu City South West': ['Mchengautuba North Ward', 'Mzuzu Central West Ward', 'Mzuzu South East Ward', 'Mzuzu South West Ward', 'Mchengautuba South Ward'],
    'Mzuzu City South East': ['Mzuzu Central Ward', 'Mzuzu Central East Ward', 'Katawa-Kaning\'ina Ward', 'Mzuzu Central South Ward', 'Masasa Ward', 'Msongwe Ward'],
  },
  'Nkhata Bay': {
    'Nkhata Bay North': ['Usisya Ward', 'Chikwina Ward'],
    'Nkhata Bay Mpamba': ['Mwambazi Ward', 'Chombe Ward'],
    'Nkhata Bay Central': ['Bungulu Ward', 'Thotho Ward'],
    'Nkhata Bay West': ['Kavuzi Ward', 'Chitheka Ward'],
    'Nkhata Bay Chintheche': ['Maula Ward', 'Chintheche Ward'],
    'Nkhata Bay South': ['Mbamba Ward', 'Tukombo Ward'],
  },
  'Likoma': {
    'Likoma Island': ['Likoma North Ward', 'Likoma South Ward', 'Chizumulu North Ward', 'Chizumulu South Ward'],
  },
  'Nkhotakota': {
    'Nkhotakota Dwangwa': ['Kasitu Ward', 'Nkhunga Ward'],
    'Nkhotakota Liwaladzi': ['Kabiza Ward', 'Msenjere Ward'],
    'Nkhotakota Central': ['Mpondagaga Ward', 'Mawira Ward'],
    'Nkhotakota Chia': ['Kalimanjira Ward', 'Matamangwe Ward'],
    'Nkhotakota Mkhula': ['Kasangazi Ward', 'Mtosa Ward'],
  },
  'Kasungu': {
    'Kasungu North': ['Chimaliro Ward', 'Milenje Ward'],
    'Kasungu North West': ['Matenje Ward', 'Mpasadzi Ward'],
    'Kasungu West': ['Lifupa Ward', 'Lisasadzi Ward'],
    'Kasungu North North East': ['Mafomba Ward', 'Mthabua Ward'],
    'Kasungu East': ['Kachokolo Ward', 'Livwezi Ward'],
    'Kasungu North East': ['Ndonda Ward', 'Mbongozi Ward'],
    'Kasungu Central': ['Chipala Ward', 'Lingadzi Ward'],
    'Kasungu South East': ['Chibophi Ward', 'Bua Ward'],
    'Kasungu South West': ['Rusa Ward', 'Misozi Ward'],
    'Kasungu South': ['Chiyanjaweni Ward', 'Chigodi Ward'],
  },
  'Kasungu Municipality': {
    'Kasungu Municipality': ['Chimphangwe Ward', 'Bunda Ward', 'Belele Ward', 'Chankhanga Ward', 'Katope Ward', 'Nguluyanawambe Ward', 'Kaswalipande Ward', 'Kabvunguti Ward', 'Chithiba Ward', 'Mnthawira Ward'],
  },
  'Ntchisi': {
    'Ntchisi North': ['Mapasa Ward', 'Mawiri Ward'],
    'Ntchisi West': ['Malambo Ward', 'Masangano Ward'],
    'Ntchisi Central East': ['Mtsiro Ward', 'Boma Ward'],
    'Ntchisi East': ['Katete-Nthumba Ward', 'Kaliramasamba Ward'],
    'Ntchisi South': ['Mphunju Ward', 'Kawoyi Ward'],
  },
  'Dowa': {
    'Dowa Ngala': ['Linthembwe Ward', 'Natola Ward'],
    'Dowa Kasangadzi': ['Chakhaza Ward', 'Dzoole Ward'],
    'Dowa Mphudzu': ['Kayembe Ward', 'Mphudzu Ward'],
    'Dowa Central': ['Mpanda West Ward', 'Mpanda East Ward'],
    'Dowa Mndolera': ['Mndolera West Ward', 'Mndolera East Ward'],
    'Dowa North East': ['Msakambewa West Ward', 'Msakambewa East Ward'],
    'Dowa West': ['Machenga Ward', 'Nambuma Ward'],
    'Dowa East': ['Chiwere North East Ward', 'Chiwere East Ward'],
    'Dowa Central East': ['Lingadzi East Ward', 'Lingadzi West Ward'],
    'Dowa South East': ['Lumbadzi West Ward', 'Lumbadzi East Ward'],
  },
  'Mchinji': {
    'Mchinji North East': ['Kapiri Ward', 'Mponda Ward'],
    'Mchinji North': ['Luweredzi Ward', 'Mchemani Ward'],
    'Mchinji East': ['Mikundi Ward', 'Chitunda Ward'],
    'Mchinji West': ['Msachembe Ward', 'Boma Ward'],
    'Mchinji Central East': ['Mtope Ward', 'Magawa Ward'],
    'Mchinji South West': ['Kalumbe Ward', 'Chimimbe Ward'],
    'Mchinji South': ['Naminjiwa Ward', 'Msitu Ward'],
  },
  'Salima': {
    'Salima North': ['Chikombe-Chiluwa Ward', 'Lingadzi Ward'],
    'Salima Central West': ['Chitala Ward', 'Lipimbi-Namanda Ward'],
    'Salima Central East': ['Kuluunda Ward', 'Maganga Ward'],
    'Salima Central': ['Kalonga Ward', 'Boma Ward'],
    'Salima South Linthipe': ['Kambwiri-Chisamba Ward', 'Pemba Ward'],
    'Salima South': ['Chipoka Urban Ward', 'Ndindi-Kambalame Ward'],
  },
  'Lilongwe': {
    'Lilongwe Chilobwe': ['Chilobwe Ward', 'Msauka Ward'],
    'Lilongwe Mphande': ['Mteza Ward', 'Milindi Ward'],
    'Lilongwe Mude': ['Kakhongono Ward', 'Msewa Wards'],
    'Lilongwe Demera': ['Kalambe Ward', 'Nsaru Ward'],
    'Lilongwe Chiwamba': ['Nalikule Ward', 'Chiwamba Ward'],
    'Lilongwe East': ['Chowo Wards', 'Mbavu Ward'],
    'Lilongwe Mapuyu North': ['Kapatsa Ward', 'Mapuyu Ward'],
    'Lilongwe Nkhoma': ['Mkuza Ward', 'Nkhoma Ward'],
    'Lilongwe Likuni': ['Mtunthumala Ward', 'Chiwenga Ward'],
    'Lilongwe Central': ['Mlodza Ward', 'Chitsime Ward'],
    'Lilongwe Mpenu': ['Sanjiko Ward', 'Mazengera Ward'],
    'Lilongwe Machenga': ['Njewa Ward', 'Chitipi Ward'],
    'Lilongwe Mapuyu South': ['Kachawa Ward', 'Kamanzi Ward'],
    'Lilongwe Nyanja': ['Mtenthera Ward', 'Nyanja Ward'],
    'Lilongwe Msozi': ['Ngala Ward', 'Mlodzenzi Ward'],
    'Lilongwe Bunda': ['Dzanzi Ward', 'Bunda Ward'],
    'Lilongwe Phirilanjuzi': ['Malingunde Ward', 'Chiputu Ward'],
    'Lilongwe Msinja North': ['Katope Ward', 'Nsambe Ward'],
    'Lilongwe Msinja South': ['Msinja Ward', 'Nadzumi Ward'],
  },
  'Lilongwe City': {
    'Lilongwe City Lumbadzi': ['Lumbadzi Ward', 'Magwero Ward'],
    'Lilongwe City Dzenza': ['Kabwabwa Ward', 'Dzenza Ward'],
    'Lilongwe City Centre': ['Chatata Ward', 'Kauma Ward'],
    'Lilongwe City Chipala-Nafisi': ['Mgona Ward', 'Chimoka-Senti Ward'],
    'Lilongwe City Nankhaka': ['Mvama Ward', 'Chimutu Ward'],
    'Lilongwe City Mtandire-Mtsiriza': ['Mtandire Ward', 'Chigoneka-Mtsiriza Ward'],
    'Lilongwe City Bwaila': ['Mbidzi Ward', 'Chinsapo Ward'],
    'Lilongwe City Masintha': ['Kawale-Biwi Ward', 'Chilinde Ward'],
    'Lilongwe City Mbuka': ['Mwenyekondo Ward', 'Kasuntha Ward'],
    'Lilongwe City Mlodza': ['Chipasula Ward', 'Tsabango Ward'],
    'Lilongwe City Kamphuno': ['Likuni Ward', 'Kakule Ward'],
    'Lilongwe City Ngwenya': ['Ngwenya Ward', 'Sese Ward'],
  },
  'Dedza': {
    'Dedza Mayani': ['Tchetsa Ward', 'Chilanga Ward'],
    'Dedza Mlunduni': ['Dzindevu Ward', 'Makota Ward'],
    'Dedza Kasina': ['Mkundi Ward', 'Chitowo Ward'],
    'Dedza Mtakataka': ['Matowe Ward', 'Mankhamba Ward'],
    'Dedza Linthipe': ['Chimbiya Ward', 'Kampini Ward'],
    'Dedza Boma': ['Bembeke Ward', 'Umbwi Ward'],
    'Dedza Golomoti': ['Khwekhwelele Ward', 'Kapiri Ward'],
    'Dedza Chikoma': ['Katewe Ward', 'Magomero Ward'],
    'Dedza Mphunzi': ['Thete Ward', 'Lobi Ward'],
    'Dedza Dzalanyama': ['Chimoto Ward', 'Kafere Ward'],
  },
  'Ntcheu': {
    'Ntcheu North': ['Masasa Ward', 'Lizulu Ward'],
    'Ntcheu Bwanje': ['Kasinje Ward', 'Kandeu Ward'],
    'Ntcheu North West': ['Zembe Ward', 'Mphepo Zinai Ward'],
    'Ntcheu Central East': ['Chawanje Ward', 'Mbvimbo Ward'],
    'Ntcheu Central': ['Bangala Ward', 'Gomanichikuse Ward'],
    'Ntcheu Dzonzi Mvai': ['Kambilonjo Ward', 'Tsangano Ward'],
    'Ntcheu Central Central East': ['Bawi Ward', 'Champiti Ward'],
    'Ntcheu South': ['Ntonda Ward', 'Likudzi Ward'],
  },
  'Mangochi': {
    'Mangochi North': ['Makanjira North Ward', 'Makanjira South Ward'],
    'Mangochi Lutende': ['Namabvi Ward', 'Mbwazi Ward'],
    'Mangochi East': ['Katuli North Ward', 'Katuli South Ward'],
    'Mangochi Monkey Bay': ['Monkey Bay Ward', 'Nkope Ward'],
    'Mangochi West': ['Malembo Ward', 'Mvumba Ward'],
    'Mangochi Central': ['Koche Ward', 'Thundu Ward'],
    'Mangochi North East': ['Malindi Ward', 'Mikongo Ward'],
    'Mangochi Masongola': ['Mandimba Ward', 'Majuni Ward'],
    'Mangochi South West': ['Katema-Mtimabi Ward', 'Chilipa Ward'],
    'Mangochi South': ['Nlimba Ward', 'Chipunga Ward'],
    'Mangochi Malombe': ['Maiwa Ward', 'Masanje Ward'],
    'Mangochi Nkungulu': ['Nkungulu Ward', 'Mpale Ward'],
  },
  'Mangochi Municipality': {
    'Mangochi Municipal': ['Kalungu Ward', 'Chikole Ward', 'Mwasa Ward', 'Chigawe Ward', 'Nkanamwano Ward', 'Mtumbwasi Ward', 'Ndege Ward', 'Mikomwa Ward', 'Msukamwere Ward', 'Msikisi Ward'],
  },
  'Machinga': {
    'Machinga North East': ['Mpili Ward', 'Nyambi Ward'],
    'Machinga South East': ['Ngokwe Ward', 'Sagwi Ward'],
    'Machinga Central': ['Sonje Ward', 'Mbonechera Ward'],
    'Machinga East': ['Nkoola Ward', 'Nchinguza Ward'],
    'Machinga Mikoko': ['Mizinga Ward', 'Kawinga Ward'],
    'Machinga Central East': ['Kanjuli Ward', 'Mlomba Ward'],
    'Machinga Likwenu': ['Molipa Ward', 'Sitola Ward'],
    'Machinga South': ['Likwenu Ward', 'Chikala Ward'],
  },
  'Balaka': {
    'Balaka Ulongwe': ['Shire Ward', 'Nkhonde Ward'],
    'Balaka Bwaila': ['Ulongwe Ward', 'Chikowa Ward'],
    'Balaka Ngwangwa': ['Mchengawede Ward', 'Liwawadzi Ward'],
    'Balaka Rivirivi': ['Lingala Ward', 'Chinkhumbe Ward'],
    'Balaka Mulunguzi': ['Kangankundi Ward', 'Nkalizi Ward'],
  },
  'Zomba': {
    'Zomba Malosa': ['Lifani Ward', 'Naming\'azi Ward'],
    'Zomba Nsondole': ['Songani Ward', 'Naisi Ward'],
    'Zomba Chingale': ['Milare Ward', 'Lisanjala Ward', 'Linthipe Ward'],
    'Zomba Likangala': ['Lake Chilwa Islands Ward', 'Likangala North Ward', 'Likangala South Ward'],
    'Zomba Changalume': ['Namilongo Ward', 'Chipini Ward', 'Namadzi Ward'],
    'Zomba Ntonya': ['Ulumba Ward', 'Buleya Ward'],
    'Zomba Matiya': ['Kankhomba Ward', 'Pirimiti Ward'],
    'Zomba Thondwe': ['Chimwalira Ward', 'Jenala Ward'],
    'Zomba Chikomwe': ['Chanda Ward', 'Sunuzi Ward'],
  },
  'Neno': {
    'Neno North': ['Chilimbondo Ward', 'Chikonde Ward'],
    'Neno East': ['Matope Ward', 'Lisungwi Ward'],
    'Neno South': ['Ligowe Ward', 'Chifunga Ward'],
  },
  'Blantyre': {
    'Blantyre North': ['Chikwembere Ward', 'Linjidzi Ward'],
    'Blantyre Central': ['Matindi-Dziwe Ward', 'Ntenjera Ward'],
    'Blantyre West': ['Chikuli Ward', 'Katondo Ward'],
    'Blantyre North East': ['Chitukuko Ward', 'Chitsanzo Ward'],
    'Blantyre South West': ['Chigwaja Ward', 'Mpemba Ward'],
    'Blantyre South East': ['Naotcha Ward', 'Soche Ward'],
  },
  'Zomba City': {
    'Zomba City North': ['Masongola Ward', 'Chinamwali Ward', 'Chirunga Ward', 'Zomba Central Ward', 'Likangala Ward'],
    'Zomba City South': ['Mtiya Ward', 'Chambo Ward', 'Mbedza Ward', 'Mpira Ward', 'Sadzi Ward'],
  },
  'Mwanza': {
    'Mwanza Central': ['Khudze Ward', 'Mitseche Ward'],
    'Mwanza West': ['Mpandadzi Ward', 'Thambani Ward'],
  },
  'Phalombe': {
    'Phalombe North': ['Khongoloni Wards', 'Thundu Ward'],
    'Phalombe North East': ['Swang\'oma Ward', 'Mauzi Ward'],
    'Phalombe Machemba': ['Namisangwani Ward', 'Mpasa Ward'],
    'Phalombe South': ['Likulezi Ward', 'Mulomba Ward'],
    'Phalombe East': ['Chiringa Ward', 'Sukasanje Ward'],
  },
  'Chiradzulu': {
    'Chiradzulu Nyungwe': ['Nkhande Ward', 'Mbulumbuzi Ward'],
    'Chiradzulu Masanjala': ['Mwanje Ward', 'Mombezi Ward'],
    'Chiradzulu Thumbwe': ['Nanjati Ward', 'Maera Ward'],
    'Chiradzulu Nguludi': ['Chisombezi Ward', 'Malabvi Ward'],
    'Chiradzulu Midima': ['Mitumbira Ward', 'Sakata Ward'],
  },
  'Mulanje': {
    'Mulanje North': ['Mombezi Ward', 'Mulomba Ward'],
    'Mulanje West': ['Nambilanje Ward', 'Namboya Ward'],
    'Mulanje Pasani': ['Chambe Ward', 'Chole Ward'],
    'Mulanje South West': ['Chikuli Ward', 'Mulemba Ward'],
    'Mulanje Limbuli': ['Muloza Ward', 'Limbuli Ward'],
    'Mulanje South': ['Chitakale Ward', 'Lujeri Ward'],
    'Mulanje Central': ['Mtenjera Ward', 'Thabwa Ward'],
    'Mulanje South East': ['Mimosa Ward', 'Milonde Ward'],
    'Mulanje Bale': ['Msikawanjala Ward', 'Mkumbiza Ward'],
  },
  'Blantyre City': {
    'Blantyre City South Lunzu': ['Mthawira Ward', 'South Lunzu Ward', 'Nkolokoti Chikapa Ward'],
    'Blantyre City Michiru-Chirimba': ['Michiru Ward', 'Chirimba Ward', 'Namatete Ward'],
    'Blantyre City Mapanga-Mpingwe-Mzedi': ['Mapanga-Mzedi Ward', 'Mpingwe Ward', 'Bangwe-Mtopwa Ward'],
    'Blantyre City Ndirande Malabada Nyambadwe': ['Ndirande Malabada Ward', 'Nyambadwe-Ndirande New Lines-Ginnery Corner Ward', 'Ndirande-Makata Ward'],
    'Blantyre City Chilomoni-Kabula-Nancholi': ['Chilomoni Ward', 'Namiwawa-Sunnyside Ward', 'Nancholi Manyowe Ward'],
    'Blantyre City Mbayani-Mussa Magasa': ['Mbayani-Mussa Magasa Ward', 'Mbayani Railway Line Ward', 'Mbayani-Tam-tam Ward'],
    'Blantyre City Nkolokoti-Ndirande Matope': ['Nkoloti-Ndirande Mountain Catchment Ward', 'Maone Ward', 'Ndirande Matope Ward'],
    'Blantyre City Chichiri-Misesa': ['Misesa Ward', 'Kapeni Manje Ward', 'Chigumula CCAP-Namame Ward'],
    'Blantyre City Soche-Zingwangwa': ['Chitawira-Nkolokosa-Manja Ward', 'Mibawa-Bizimack Ward', 'Soche- Chimwankhunda-Namwiri Ward'],
    'Blantyre City Chigumula-Bca-Club Banana': ['Chigumula-Club Banana Ward', 'Bangwe-Namiyango Ward', 'BCA Hills-Chigumula Ward'],
  },
  'Chikwawa': {
    'Chikwawa West': ['Chimwanjale Ward', 'Chibisa Ward'],
    'Chikwawa North': ['Ndalanda Ward', 'Mwamphanzi Ward'],
    'Chikwawa Central West': ['Lengwe Ward', 'Nchalo Ward'],
    'Chikwawa Central': ['Bwabwali Ward', 'Mtchombwa Ward'],
    'Chikwawa East': ['Makhwira North Ward', 'Makhwira South Ward'],
    'Chikwawa Mkombedzi': ['Mikalango Ward', 'Alumenda Ward'],
    'Chikwawa South': ['Makande Ward', 'Dolo Ward'],
  },
  'Thyolo': {
    'Thyolo Mikolongwe': ['Mikolongwe Ward', 'Chinamuhuru Ward'],
    'Thyolo Goliati': ['Muonekera Ward', 'Mtundawosema Ward'],
    'Thyolo Bvumbwe-Masenjere': ['Bvumbwe-Ngomano Ward', 'Masenjere-Madwale Ward'],
    'Thyolo Khonjeni-Mangunda': ['Mangunda Ward', 'Khonjeni Ward'],
    'Thyolo Central': ['Masambankhunda-Mpeni Ward', 'Nchima Ward'],
    'Thyolo Thava': ['Dzimbiri Ward', 'Thava Ward'],
    'Thyolo Masambanjati': ['Masambanjati Ward', 'Zowa Ward'],
    'Thyolo Thekerani': ['Mapanga Ward', 'Thekerani Ward'],
  },
  'Luchenza Municipality': {
    'Luchenza Municipal': ['Thuchila Ward', 'Namadzi Ward', 'Mthundu Ward', 'Namisonga Ward', 'Sambagalu Ward'],
  },
  'Nsanje': {
    'Nsanje North': ['Kalulu Ward', 'Ruo Ward'],
    'Nsanje Lalanje': ['Lalanje Ward', 'Mlonda Ward'],
    'Nsanje Central': ['Misamvu Ward', 'Chigumukire Ward'],
    'Nsanje South West': ['Nyamadzele Ward', 'Chekerere Ward'],
    'Nsanje South': ['Matundu Ward', 'Nyachilenda Ward'],
  },
};

// Normalize string helper for flexible matching (case-insensitive and trimmed)
function norm(s?: string): string {
  return (s ?? '').trim().toLowerCase();
}

/**
 * Regional mapping of all districts in Malawi (Northern, Central, Southern).
 */
export const MALAWI_REGION_DISTRICTS: Record<string, string[]> = {
  'Northern': [
    'Chitipa',
    'Karonga',
    'Karonga Town',
    'Rumphi',
    'Mzimba',
    'Mzuzu City',
    'Nkhata Bay',
    'Likoma',
  ],
  'Central': [
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
  ],
  'Southern': [
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
  ],
};

/**
 * Get districts filtered for a specific region.
 */
export function getDistrictsForRegion(region?: string): string[] {
  if (!region) {
    return Object.values(MALAWI_REGION_DISTRICTS).flat();
  }
  const clean = norm(region).replace(/\s*region$/, '');
  for (const [rName, dists] of Object.entries(MALAWI_REGION_DISTRICTS)) {
    const rClean = norm(rName);
    if (rClean === clean || rClean.includes(clean) || clean.includes(rClean)) {
      return dists;
    }
  }
  return Object.values(MALAWI_REGION_DISTRICTS).flat();
}

/**
 * Infer or look up region from a district name.
 */
export function getRegionForDistrict(district?: string): string | undefined {
  if (!district) return undefined;
  const target = norm(district);
  for (const [rName, dists] of Object.entries(MALAWI_REGION_DISTRICTS)) {
    if (dists.some(d => norm(d) === target)) {
      return rName;
    }
  }
  return undefined;
}

/**
 * Get all constituencies for a given district.
 */
export function getConstituenciesForDistrict(district?: string): string[] {
  if (!district) return [];
  const target = norm(district);
  for (const [dName, constMap] of Object.entries(MALAWI_ADMIN_HIERARCHY)) {
    if (norm(dName) === target) {
      return Object.keys(constMap);
    }
  }
  return [];
}

/**
 * Get all wards for a given constituency (and optional district).
 */
export function getWardsForConstituency(constituency?: string, district?: string): string[] {
  if (!constituency) return [];
  const targetConst = norm(constituency);

  if (district) {
    const targetDist = norm(district);
    for (const [dName, constMap] of Object.entries(MALAWI_ADMIN_HIERARCHY)) {
      if (norm(dName) === targetDist) {
        for (const [cName, wards] of Object.entries(constMap)) {
          if (norm(cName) === targetConst) {
            return wards;
          }
        }
      }
    }
  }

  // Global search across all districts if district not provided or not found
  for (const constMap of Object.values(MALAWI_ADMIN_HIERARCHY)) {
    for (const [cName, wards] of Object.entries(constMap)) {
      if (norm(cName) === targetConst) {
        return wards;
      }
    }
  }

  return [];
}

/**
 * Get all wards for a given district across all its constituencies.
 */
export function getWardsForDistrict(district?: string): string[] {
  if (!district) return [];
  const target = norm(district);
  for (const [dName, constMap] of Object.entries(MALAWI_ADMIN_HIERARCHY)) {
    if (norm(dName) === target) {
      const wardsSet = new Set<string>();
      for (const wards of Object.values(constMap)) {
        wards.forEach(w => wardsSet.add(w));
      }
      return Array.from(wardsSet);
    }
  }
  return [];
}

/**
 * Find which constituency a ward belongs to.
 */
export function getConstituencyForWard(ward?: string): string | undefined {
  if (!ward) return undefined;
  const target = norm(ward);
  const targetClean = target.replace(/\s*ward$/i, '');
  for (const constMap of Object.values(MALAWI_ADMIN_HIERARCHY)) {
    for (const [cName, wards] of Object.entries(constMap)) {
      if (wards.some(w => norm(w) === target || norm(w).replace(/\s*ward$/i, '') === targetClean)) {
        return cName;
      }
    }
  }
  return undefined;
}

/**
 * Check if a ward belongs to a constituency.
 */
export function isWardInConstituency(ward: string, constituency: string): boolean {
  const wards = getWardsForConstituency(constituency);
  const target = norm(ward);
  const targetClean = target.replace(/\s*ward$/i, '');
  return wards.some(w => norm(w) === target || norm(w).replace(/\s*ward$/i, '') === targetClean);
}
