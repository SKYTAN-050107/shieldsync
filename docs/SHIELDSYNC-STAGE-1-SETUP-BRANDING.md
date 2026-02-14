# STAGE 1: PROJECT SETUP & BRANDING (3 Hours)

**Goal**: Fork SynCure, rebrand to ShieldSync, setup Firebase with Auth/Analytics, create safety design system

---

## HOUR 1: Project Initialization & Firebase Setup

### Tasks (60 min)
- [ ] Fork SynCure project to ShieldSync (10 min):
  ```bash
  # Copy SynCure codebase
  cp -r syncure-johor shieldsync
  cd shieldsync
  
  # Clean old build artifacts
  rm -rf node_modules dist build .firebase
  
  # Fresh install
  npm install
  ```

- [ ] Update project metadata (10 min):
  ```json
  // package.json
  {
    "name": "shieldsync",
    "version": "1.0.0",
    "description": "Emergency Services Finder & Community Alert for Johor Bahru",
    "keywords": ["safety", "emergency", "johor", "public-safety", "shieldsync"]
  }
  ```

- [ ] Create new Firebase project "shieldsync-jb" (15 min):
  - Go to https://console.firebase.google.com
  - Create new project: "shieldsync-jb"
  - Enable **Firebase Authentication** (Anonymous + Google providers)
  - Enable **Cloud Firestore** (Start in test mode)
  - Enable **Google Analytics** (create Analytics account)
  - Enable **Firebase Hosting**
  - Copy project configuration

- [ ] Update Firebase config (20 min):
  ```javascript
  // src/services/firebase.js
  import { initializeApp } from 'firebase/app'
  import { getFirestore } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'
  import { getAnalytics, logEvent } from 'firebase/analytics'
  
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "shieldsync-jb.firebaseapp.com",
    projectId: "shieldsync-jb",
    storageBucket: "shieldsync-jb.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
  
  const app = initializeApp(firebaseConfig)
  
  export const db = getFirestore(app)
  export const auth = getAuth(app)
  export const analytics = getAnalytics(app)
  
  // Analytics helper
  export const trackEvent = (eventName, params = {}) => {
    logEvent(analytics, eventName, params)
  }
  ```

- [ ] Test Firebase connection (5 min):
  ```bash
  npm run dev
  # Check browser console for Firebase initialization
  ```

### Deliverables
- ✅ ShieldSync project initialized
- ✅ Firebase project created with Auth + Analytics
- ✅ Firebase SDK configured and tested
- ✅ Development server running

---

## HOUR 2: Safety Design System & Logo Setup

### Tasks (60 min)
- [ ] **Create logo directories** (5 min):
  ```bash
  # Create asset directories
  mkdir -p public/assets/logos
  mkdir -p src/assets/logos
  
  # Logo file structure:
  # public/assets/logos/
  #   ├── shieldsync-logo.svg       # Main logo (for favicon, etc)
  #   ├── shieldsync-logo.png       # PNG version (512x512)
  #   ├── shieldsync-icon.svg       # Icon only (no text)
  #   └── favicon.ico               # Browser favicon
  #
  # src/assets/logos/
  #   ├── logo-light.svg            # Light theme logo
  #   └── logo-dark.svg             # Dark theme logo
  
  # Update public/index.html
  # <link rel="icon" type="image/x-icon" href="/assets/logos/favicon.ico">
  ```

- [ ] Update Tailwind config with safety colors (20 min):
  ```javascript
  // tailwind.config.js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Safety color palette
          danger: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            900: '#7F1D1D'
          },
          safe: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            500: '#10B981',
            600: '#059669',
            700: '#047857'
          },
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309'
          },
          trust: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#1D4ED8',
            700: '#1E40AF'
          }
        },
        fontFamily: {
          'montserrat': ['Montserrat', 'sans-serif'],
          'inter': ['Inter', 'sans-serif']
        },
        animation: {
          'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
          'slide-up': 'slideUp 0.3s ease-out'
        },
        keyframes: {
          slideUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          }
        },
        backdropBlur: {
          xs: '2px'
        }
      }
    },
    plugins: []
  }
  ```

- [ ] Create safety design system CSS (25 min):
  ```css
  /* src/styles/design-system.css */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
  
  :root {
    /* Safety Colors */
    --danger-red: #DC2626;
    --safe-green: #059669;
    --warning-orange: #D97706;
    --trust-blue: #1D4ED8;
    --glass-alert: rgba(255, 255, 255, 0.95);
    
    /* Emergency Gradients */
    --gradient-emergency: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
    --gradient-safe: linear-gradient(135deg, #059669 0%, #10B981 100%);
    --gradient-warning: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  }
  
  /* Glass Morphism */
  .glass-alert {
    backdrop-filter: blur(24px) saturate(180%);
    background: var(--glass-alert);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  /* Emergency Button */
  .emergency-button {
    background: var(--gradient-emergency);
    @apply text-white font-bold py-4 px-8 rounded-xl 
           shadow-2xl hover:scale-105 transition-transform
           animate-pulse-slow;
  }
  
  .emergency-button:hover {
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
  }
  
  /* Panic Pulse Animation */
  .panic-pulse {
    animation: panicPulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes panicPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px rgba(220, 38, 38, 0);
    }
  }
  
  /* Incident Ping */
  .incident-ping {
    animation: incidentPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes incidentPing {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  /* Emergency Glow */
  .emergency-glow {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.6),
                0 0 40px rgba(220, 38, 38, 0.4),
                0 0 60px rgba(220, 38, 38, 0.2);
  }
  
  /* Safe Zone Gradient */
  .safe-zone {
    background: var(--gradient-safe);
  }
  
  /* Danger Zone Gradient */
  .danger-zone {
    background: var(--gradient-emergency);
  }
  
  /* Hover Lift Effect */
  .hover-lift {
    @apply transition-all duration-300;
  }
  
  .hover-lift:hover {
    @apply -translate-y-1 shadow-2xl;
  }
  ```

- [ ] Update index.html with fonts and meta tags (10 min):
  ```html
  <!-- public/index.html -->
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/x-icon" href="/assets/logos/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <!-- SEO Meta Tags -->
      <title>ShieldSync - Emergency Services Finder | Johor Bahru Safety</title>
      <meta name="description" content="Find nearest police, fire stations & hospitals in JB. Anonymous crime reporting & neighborhood watch coordination." />
      <meta name="keywords" content="emergency, safety, johor bahru, police, fire station, crime report, neighborhood watch" />
      
      <!-- Open Graph -->
      <meta property="og:title" content="ShieldSync - Emergency Services Finder" />
      <meta property="og:description" content="Nearest police/fire stations + anonymous crime reporting + neighborhood watch" />
      <meta property="og:type" content="website" />
      
      <!-- Theme Color -->
      <meta name="theme-color" content="#DC2626" />
      
      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  ```

### Deliverables
- ✅ Logo directories created (ready for your logo files)
- ✅ Safety color palette configured
- ✅ Design system CSS with emergency animations
- ✅ Fonts loaded (Montserrat + Inter)
- ✅ SEO meta tags added

---

## HOUR 3: Mock Safety Data & Project Structure

### Tasks (60 min)
- [ ] Create JB emergency services data (35 min):
  ```javascript
  // src/data/mockSafetyData.js
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
  ```

- [ ] Update constants for Johor Bahru (15 min):
  ```javascript
  // src/utils/constants.js
  export const JB_POSTCODES = [
    '81200', // Taman Molek
    '80100', // City Center
    '80300', // Tebrau
    '81100', // Skudai
    '80990', // Larkin
    '81300', // Pasir Gudang
    '81400', // Senai
    '81000'  // Kulai
  ]
  
  export const DEFAULT_COORDINATES = {
    jb_center: { lat: 1.4927, lon: 103.7414, name: 'JB City Center' },
    taman_molek: { lat: 1.5389, lon: 103.7850, name: 'Taman Molek' },
    tebrau: { lat: 1.5520, lon: 103.7850, name: 'Tebrau' },
    skudai: { lat: 1.5353, lon: 103.6594, name: 'Skudai' }
  }
  
  export const INCIDENT_TYPES = [
    'Snatch Theft',
    'Break-In',
    'Road Rage',
    'Suspicious Activity',
    'Fire',
    'Accident',
    'Vandalism',
    'Other'
  ]
  
  export const EMERGENCY_NUMBERS = {
    police: '999',
    fire: '994',
    ambulance: '991',
    civil_defense: '991'
  }
  
  export const SAFETY_TIPS = [
    'Stay on well-lit main roads, especially at night',
    'Travel in groups during peak crime hours (8-11PM)',
    'Keep emergency numbers on speed dial',
    'Report suspicious activity immediately',
    'Avoid displaying valuables in public areas',
    'Be aware of your surroundings at all times',
    'Park in well-lit, populated areas',
    'Trust your instincts - if something feels wrong, leave'
  ]
  ```

- [ ] Create project structure documentation (10 min):
  ```markdown
  <!-- PROJECT_STRUCTURE.md -->
  # ShieldSync Project Structure
  
  shieldsync/
  ├── public/
  │   ├── assets/
  │   │   └── logos/
  │   │       ├── shieldsync-logo.svg      # Your main logo here
  │   │       ├── shieldsync-logo.png      # PNG version (512x512)
  │   │       ├── shieldsync-icon.svg      # Icon only
  │   │       └── favicon.ico              # Browser favicon
  │   └── index.html
  ├── src/
  │   ├── assets/
  │   │   └── logos/
  │   │       ├── logo-light.svg           # Light theme
  │   │       └── logo-dark.svg            # Dark theme
  │   ├── components/
  │   │   ├── SafetyMap.jsx                # Interactive SVG map
  │   │   ├── EmergencyCard.jsx            # Service cards
  │   │   ├── IncidentCard.jsx             # Incident reports
  │   │   ├── ReportModal.jsx              # Anonymous reporting
  │   │   ├── WatchGroupWidget.jsx         # Neighborhood watch
  │   │   ├── SafetyScorePanel.jsx         # Safety scoring
  │   │   ├── AIAlertsPanel.jsx            # AI insights
  │   │   ├── LiveIncidentsPanel.jsx       # Real-time feed
  │   │   └── MobileNav.jsx                # Mobile navigation
  │   ├── screens/
  │   │   ├── HomeScreen.jsx               # Emergency finder
  │   │   ├── SafetyMapScreen.jsx          # Map view
  │   │   ├── ReportScreen.jsx             # Report incident
  │   │   └── WatchGroupsScreen.jsx        # Watch groups
  │   ├── services/
  │   │   ├── firebase.js                  # Firebase config
  │   │   ├── emergencyService.js          # Emergency services
  │   │   ├── reportService.js             # Anonymous reports
  │   │   ├── watchService.js              # Watch groups
  │   │   ├── safetyAnalytics.js           # Safety scoring
  │   │   └── aiSafetyInsights.js          # AI predictions
  │   ├── utils/
  │   │   ├── haversine.js                 # Distance calculation
  │   │   ├── constants.js                 # App constants
  │   │   └── helpers.js                   # Utility functions
  │   ├── data/
  │   │   └── mockSafetyData.js            # Mock emergency data
  │   ├── styles/
  │   │   ├── design-system.css            # Safety design system
  │   │   └── index.css                    # Global styles
  │   ├── App.jsx                          # Main app component
  │   └── main.jsx                         # Entry point
  ├── tailwind.config.js
  ├── vite.config.js
  ├── package.json
  └── README.md
  ```

### Deliverables
- ✅ 9 emergency services (police/fire/hospital)
- ✅ 4 mock incidents with timestamps
- ✅ 3 watch groups
- ✅ JB postcodes and coordinates
- ✅ Project structure documented

---

## Stage 1 Checkpoint

### What You Should Have Now:
1. ✅ ShieldSync project running (`npm run dev`)
2. ✅ Firebase configured (Auth + Firestore + Analytics)
3. ✅ Safety design system ready
4. ✅ Logo directories created (waiting for your logo files)
5. ✅ Mock JB safety data (9 services, 4 incidents, 3 watch groups)
6. ✅ Project structure established

### Logo Files Needed:
Place your ShieldSync logos in these locations:
```
public/assets/logos/
├── shieldsync-logo.svg       # Main logo (recommended: horizontal layout)
├── shieldsync-logo.png       # PNG backup (512x512px minimum)
├── shieldsync-icon.svg       # Icon/badge only (square, no text)
└── favicon.ico               # 16x16, 32x32, 48x48 multi-size

src/assets/logos/
├── logo-light.svg            # For light backgrounds
└── logo-dark.svg             # For dark backgrounds (optional)
```

### Quick Test:
```bash
npm run dev
# Open http://localhost:5173
# Should see SynCure UI but with ShieldSync Firebase config
```

### File Changes Summary:
```
Created:
- src/data/mockSafetyData.js
- src/styles/design-system.css
- PROJECT_STRUCTURE.md
- public/assets/logos/ (directory)
- src/assets/logos/ (directory)

Modified:
- package.json (name, description)
- tailwind.config.js (safety colors)
- public/index.html (fonts, meta tags)
- src/services/firebase.js (Auth + Analytics)
```

### Next Stage Preview:
Stage 2 will build all safety services (emergency service logic, anonymous reporting, safety analytics, watch groups) - the backend brain of ShieldSync.

---

**Estimated Time**: 3 hours  
**Difficulty**: ⭐⭐ (Easy - mostly configuration)  
**Dependencies**: SynCure codebase available
