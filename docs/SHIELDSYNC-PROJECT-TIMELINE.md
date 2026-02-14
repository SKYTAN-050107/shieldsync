# SHIELDSYNC - PROJECT TIMELINE & QUICK REFERENCE

**Total Estimated Time**: 15 hours  
**Recommended Schedule**: 2-3 full days or 1 week part-time  
**Tech Stack**: Vite + React + Tailwind + Firebase (Firestore + Auth + Analytics)

---

## 🎯 STAGE BREAKDOWN

### Stage 1: Setup & Branding 
**Goal**: Project initialization, Firebase setup, safety design system

| Hour | Tasks | Output |
|------|-------|--------|
| 1 | Project init, Firebase config | Firebase project live |
| 2 | Safety color palette, fonts | Design system ready |
| 3 | Mock data, project structure | 9 services, 4 incidents |

**Critical Path**: Firebase must be configured before Stage 2

---

### Stage 2: Core Services 
**Goal**: Build all backend logic (emergency services, reporting, analytics, watch groups)

| Hour | Tasks | Output |
|------|-------|--------|
| 1 | Emergency service logic | Fetch, sort, filter working |
| 2 | Anonymous reporting | Firebase Auth + report submission |
| 3 | Safety analytics & AI | Safety scoring (0-10) |
| 4 | Neighborhood watch | Groups, alerts, real-time |

**Critical Path**: Services must work before building UI

---

### Stage 3: UI Components 
**Goal**: Build stunning emergency-focused UI with panic button and interactive map

| Hour | Tasks | Output |
|------|-------|--------|
| 1 | HomeScreen | Emergency finder with panic button |
| 2 | SafetyMap (SVG) | Interactive map with pins |
| 3 | EmergencyCard, IncidentCard | Service and incident cards |
| 4 | ReportModal, WatchWidget | Anonymous reporting + groups |
| 5 | SafetyMapScreen, MobileNav | Full screen + navigation |

**Critical Path**: HomeScreen and SafetyMap are the core demo pieces

---

### Stage 4: Deployment & Polish 
**Goal**: Deploy to Firebase, seed data, verify production

| Hour | Tasks | Output |
|------|-------|--------|
| 1 | Firebase config, security rules | Hosting + Firestore rules |
| 2 | Data seeding, build optimization | Production data + optimized build |
| 3 | Final polish, deployment | Live site + analytics verified |

**Critical Path**: Must seed data before final testing

---

## ⚡ CRITICAL FEATURES (MVP)

**Must-Have for Demo:**
1. ✅ HomeScreen with panic button (🚨 pulsing, calls 999)
2. ✅ Nearest police/fire cards with call buttons
3. ✅ Interactive SafetyMap (SVG with pins)
4. ✅ Anonymous report modal
5. ✅ Mobile responsive (bottom nav)
6. ✅ Firebase deployment (live URL)

**Nice-to-Have:**
- Watch group join functionality
- AI safety insights panel
- Real-time incident updates
- Safety score visualization

---

## 🔧 QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Build for production
npm run preview                # Preview production build

# Firebase
firebase login                 # Login to Firebase
firebase init                  # Initialize Firebase project
npm run seed                   # Seed Firestore data
npm run deploy                 # Build + deploy to hosting
firebase deploy --only firestore:rules  # Deploy security rules only

# Testing
npm run build && npm run preview  # Test production build locally
```

---

## 📁 FILE STRUCTURE REFERENCE

```
shieldsync/
├── public/
│   ├── assets/
│   │   └── logos/
│   │       ├── shieldsync-logo.svg      ← YOUR LOGO HERE
│   │       ├── shieldsync-logo.png      ← PNG VERSION
│   │       ├── shieldsync-icon.svg      ← ICON ONLY
│   │       └── favicon.ico              ← FAVICON
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logos/
│   │       ├── logo-light.svg           ← LIGHT THEME
│   │       └── logo-dark.svg            ← DARK THEME (optional)
│   ├── components/
│   │   ├── SafetyMap.jsx                # Interactive SVG map
│   │   ├── EmergencyCard.jsx            # Service cards
│   │   ├── IncidentCard.jsx             # Incident reports
│   │   ├── ReportModal.jsx              # Anonymous reporting
│   │   ├── WatchGroupWidget.jsx         # Watch groups
│   │   ├── LoadingScreen.jsx            # Loading state
│   │   ├── ErrorBoundary.jsx            # Error handling
│   │   └── MobileNav.jsx                # Bottom navigation
│   ├── screens/
│   │   ├── HomeScreen.jsx               # Emergency finder
│   │   └── SafetyMapScreen.jsx          # Map view
│   ├── services/
│   │   ├── firebase.js                  # Firebase config
│   │   ├── emergencyService.js          # Emergency logic
│   │   ├── reportService.js             # Anonymous reports
│   │   ├── safetyAnalytics.js           # Safety scoring
│   │   ├── aiSafetyInsights.js          # AI predictions
│   │   ├── watchService.js              # Watch groups
│   │   └── locationService.js           # GPS detection
│   ├── utils/
│   │   ├── haversine.js                 # Distance calculation
│   │   ├── constants.js                 # App constants
│   │   └── helpers.js                   # Utility functions
│   ├── data/
│   │   └── mockSafetyData.js            # Emergency services data
│   ├── styles/
│   │   ├── design-system.css            # Safety design system
│   │   └── index.css                    # Global styles
│   ├── App.jsx                          # Main app
│   └── main.jsx                         # Entry point
├── scripts/
│   └── seedData.js                      # Firestore data seeding
├── firestore.rules                      # Security rules
├── firestore.indexes.json               # Database indexes
├── firebase.json                        # Firebase config
├── tailwind.config.js                   # Tailwind setup
├── vite.config.js                       # Vite config
└── package.json                         # Dependencies
```

---

## 🎨 DESIGN SYSTEM QUICK REFERENCE

### Colors
```css
--danger-red: #DC2626       /* Emergencies, panic button */
--safe-green: #059669       /* Safe zones, open status */
--warning-orange: #D97706   /* Warnings, fire stations */
--trust-blue: #1D4ED8      /* Police, trust elements */
--glass-alert: rgba(255,255,255,0.95)  /* Glass cards */
```

### Typography
```css
/* Headings */
font-family: 'Montserrat', sans-serif;
font-weight: 900; /* Black */

/* Body Text */
font-family: 'Inter', sans-serif;
font-weight: 400-700; /* Regular to Bold */
```

### Key Animations
```css
.panic-pulse        /* Panic button pulsing */
.incident-ping      /* Incident markers pinging */
.emergency-glow     /* Red glow effect */
.hover-lift         /* Card lift on hover */
.glass-alert        /* Glass morphism */
```

---

## 📊 DATA STRUCTURE REFERENCE

### Emergency Service
```javascript
{
  id: 'ipd_tebrau',
  name: 'IPD Tebrau',
  type: 'police',           // 'police', 'fire', 'hospital'
  lat: 1.5520,
  lon: 103.7850,
  postcode: '81200',
  phone: '07-333 2222',
  status: 'open24hr',
  address: 'Jalan Tebrau, JB',
  callsToday: 47,
  responseTime: 8,          // minutes
  safetyScore: 8.2
}
```

### Incident Report
```javascript
{
  id: 'inc_001',
  type: 'Snatch Theft',     // From INCIDENT_TYPES
  lat: 1.5389,
  lon: 103.7820,
  location: 'Plaza Pelangi parking',
  timestamp: '2024-02-14T20:30:00Z',
  description: 'Motorcycle snatch',
  severity: 'high',         // 'low', 'medium', 'high'
  verified: true,
  upvotes: 5,
  userId: 'anonymous_uid'
}
```

### Watch Group
```javascript
{
  id: 'watch_molek',
  name: 'Taman Molek Watch Group',
  area: 'Taman Molek',
  postcodes: ['81200', '81100'],
  members: 127,
  lat: 1.5389,
  lon: 103.7850,
  active: true,
  description: 'Active neighborhood watch'
}
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: GPS not working
**Fix**: 
- Check HTTPS (required for geolocation)
- `http://localhost` is allowed for testing
- Check browser permissions

### Issue: Firebase Auth error
**Fix**:
- Ensure Anonymous auth enabled in Firebase Console
- Check Firebase config in `src/services/firebase.js`

### Issue: Firestore permission denied
**Fix**:
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check rules allow anonymous auth

### Issue: Build fails
**Fix**:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Map not rendering
**Fix**:
- Check userLocation is not null
- Verify lat/lon coordinates are valid
- Check SVG viewBox dimensions

---

## ✅ DAILY MILESTONES

### Day 1 End-of-Day:
- [ ] Firebase project configured
- [ ] Safety design system ready
- [ ] All services created and tested
- [ ] Can fetch and sort emergency services
- [ ] Anonymous reporting works

### Day 2 End-of-Day:
- [ ] HomeScreen complete with panic button
- [ ] SafetyMap rendering with pins
- [ ] All cards (Emergency, Incident) working
- [ ] Report modal functional
- [ ] Mobile navigation implemented

### Day 3 End-of-Day:
- [ ] Deployed to Firebase
- [ ] Data seeded to Firestore
- [ ] Production site tested
- [ ] Analytics verified
- [ ] Demo ready

---

## 🎯 PRE-DEMO CHECKLIST (5 minutes)

**Before showing to anyone:**
1. [ ] Open https://shieldsync-jb.web.app on phone
2. [ ] Allow GPS permission
3. [ ] Verify "IPD Tebrau" shows with distance
4. [ ] Tap panic button → 999 dialer opens
5. [ ] Tap "Safety Map" → Map loads with pins
6. [ ] Tap "Report" → Modal opens
7. [ ] Submit test report → Success animation
8. [ ] No console errors

**If any step fails → Fix before demo!**

---

## 📈 ANALYTICS EVENTS TO VERIFY

After deployment, check Firebase Console → Analytics:

| Event | Description | Expected Count |
|-------|-------------|----------------|
| home_screen_viewed | User lands on home | Every visit |
| safety_map_viewed | User opens map | 60-80% of users |
| panic_button_pressed | Emergency call | Track for safety |
| incident_reported | Anonymous report | Track community engagement |
| watch_group_joined | Join neighborhood watch | Track feature adoption |

---

## 🚀 DEPLOYMENT CHECKLIST

**Pre-Deployment:**
- [ ] `npm run build` succeeds
- [ ] Bundle size < 500KB
- [ ] No console errors
- [ ] All images loading

**Deployment:**
- [ ] `npm run seed` (first time only)
- [ ] `firebase deploy --only firestore:rules`
- [ ] `npm run deploy`

**Post-Deployment:**
- [ ] Open live URL
- [ ] Test on mobile device
- [ ] Test GPS detection
- [ ] Submit test report
- [ ] Verify in Firestore Console

---

## 💡 PRO TIPS

1. **Test on real mobile device** - Emulators miss GPS/touch issues
2. **Use incognito mode** - Avoid cache issues during testing
3. **Check Firebase quotas** - Free tier has limits
4. **Analytics delay** - Events appear in console after 24h
5. **Use mock data first** - Deploy Firestore when stable
6. **Commit frequently** - Small commits = easy debugging
7. **Test panic button last** - Avoid accidental 999 calls!

---

## 📞 EMERGENCY NUMBERS (JB)

For testing purposes only:
- **Police**: 999
- **Fire**: 994
- **Ambulance**: 991

**⚠️ DO NOT call during development - test with mock data!**

---

**🎉 You're ready to build ShieldSync!**

**Follow the stages in order, commit frequently, and you'll have a production-ready hackathon project in 15 hours.**

---

*Use this guide alongside the stage files for a smooth development experience.*
