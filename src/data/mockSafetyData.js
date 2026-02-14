export const emergencyServices = [
  // Police Stations
  {
    id: 'ipd_tebrau',
    name: 'IPD Tebrau',
    type: 'police',
    lat: 1.5520,
    lon: 103.7850,
    postcode: '81200',
    phone: '07-333 2222',
    status: 'open24hr',
    address: 'Jalan Tebrau, Johor Bahru',
    callsToday: 47,
    responseTime: 8,
    safetyScore: 8.2
  },
  {
    id: 'ipd_balok',
    name: 'IPD Balok Baru',
    type: 'police',
    lat: 1.5100,
    lon: 103.7200,
    postcode: '80100',
    phone: '07-224 2222',
    status: 'open24hr',
    address: 'Jalan Balok, Johor Bahru',
    callsToday: 32,
    responseTime: 10,
    safetyScore: 7.8
  },
  {
    id: 'ipd_senai',
    name: 'IPD Senai',
    type: 'police',
    lat: 1.6006,
    lon: 103.6470,
    postcode: '81400',
    phone: '07-599 7222',
    status: 'open24hr',
    address: 'Jalan Senai, Senai',
    callsToday: 18,
    responseTime: 12,
    safetyScore: 7.5
  },
  {
    id: 'ipd_larkin',
    name: 'IPD Larkin',
    type: 'police',
    lat: 1.4850,
    lon: 103.7300,
    postcode: '80350',
    phone: '07-237 2222',
    status: 'open24hr',
    address: 'Jalan Larkin, JB',
    callsToday: 25,
    responseTime: 9,
    safetyScore: 7.9
  },
  
  // Fire Stations
  {
    id: 'bbp_jalan_tun',
    name: 'BBP Jalan Tun Abdul Razak',
    type: 'fire',
    lat: 1.4930,
    lon: 103.7600,
    postcode: '80100',
    phone: '07-224 4999',
    status: 'open24hr',
    address: 'Jalan Tun Abdul Razak, JB',
    responseTime: 6
  },
  {
    id: 'bbp_kulai',
    name: 'BBP Kulai',
    type: 'fire',
    lat: 1.6598,
    lon: 103.6052,
    postcode: '81000',
    phone: '07-663 2444',
    status: 'open24hr',
    address: 'Jalan Kulai Besar, Kulai',
    responseTime: 12
  },
  {
    id: 'bbp_skudai',
    name: 'BBP Skudai',
    type: 'fire',
    lat: 1.5353,
    lon: 103.6594,
    postcode: '81300',
    phone: '07-557 2444',
    status: 'open24hr',
    address: 'Jalan Skudai, Skudai',
    responseTime: 10
  },
  
  // Hospitals
  {
    id: 'hospital_sultanah',
    name: 'Hospital Sultanah Aminah',
    type: 'hospital',
    lat: 1.4655,
    lon: 103.7578,
    postcode: '80100',
    phone: '07-225 7000',
    status: 'open24hr',
    address: 'Jalan Persiaran Abu Bakar Sultan, JB',
    emergencyWait: 25
  },
  {
    id: 'hospital_kpj',
    name: 'KPJ Johor Specialist Hospital',
    type: 'hospital',
    lat: 1.4948,
    lon: 103.7618,
    postcode: '80100',
    phone: '07-225 3000',
    status: 'open24hr',
    address: 'Jalan Dato Sulaiman, Taman Century, JB',
    emergencyWait: 15
  }
]

export const mockIncidents = [
  {
    id: 'inc_001',
    type: 'Snatch Theft',
    lat: 1.5389,
    lon: 103.7820,
    location: 'Plaza Pelangi parking lot',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    description: 'Motorcycle snatch at parking basement',
    verified: true,
    severity: 'high',
    upvotes: 5
  },
  {
    id: 'inc_002',
    type: 'Suspicious Activity',
    lat: 1.5420,
    lon: 103.7840,
    location: 'Taman Molek Jalan 5',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    description: 'Unknown car circling residential area',
    verified: false,
    severity: 'medium',
    upvotes: 2
  },
  {
    id: 'inc_003',
    type: 'Break-In',
    lat: 1.5300,
    lon: 103.7750,
    location: 'Taman Daya shophouse',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    description: 'Shop broken into overnight',
    verified: true,
    severity: 'high',
    upvotes: 8
  },
  {
    id: 'inc_004',
    type: 'Road Rage',
    lat: 1.5200,
    lon: 103.7650,
    location: 'Jalan Tebrau traffic light',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    description: 'Aggressive driver threatening others',
    verified: false,
    severity: 'medium',
    upvotes: 3
  }
]

export const watchGroups = [
  {
    id: 'watch_molek',
    name: 'Taman Molek Watch Group',
    area: 'Taman Molek',
    postcodes: ['81200', '81100'],
    members: 127,
    lat: 1.5389,
    lon: 103.7850,
    active: true,
    description: 'Active neighborhood watch covering Taman Molek area'
  },
  {
    id: 'watch_tebrau',
    name: 'Tebrau Residents Alert',
    area: 'Taman Tebrau',
    postcodes: ['81200'],
    members: 89,
    lat: 1.5520,
    lon: 103.7900,
    active: true,
    description: 'Community safety group for Tebrau residents'
  },
  {
    id: 'watch_daya',
    name: 'Daya Community Watch',
    area: 'Taman Daya',
    postcodes: ['81100'],
    members: 64,
    lat: 1.5300,
    lon: 103.7750,
    active: true,
    description: 'Protecting Taman Daya neighborhood together'
  }
]
