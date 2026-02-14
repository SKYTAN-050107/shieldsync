# ShieldSync

**Real-Time Community Safety Platform for Malaysia**

<div align="center">

### 🎬 Demo Video

<a href="https://drive.google.com/file/d/1mOb5Wg33yteVTV8ULIOg6opBUqCGHl90/view?usp=sharing">
  <img src="https://drive.google.com/thumbnail?id=1mOb5Wg33yteVTV8ULIOg6opBUqCGHl90&sz=w1280" alt="ShieldSync Demo Video" width="720" />
</a>

<p><strong>▶ Click the image above to watch the full demo</strong></p>

[![Watch Demo](https://img.shields.io/badge/▶_Watch_Demo-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1mOb5Wg33yteVTV8ULIOg6opBUqCGHl90/view?usp=sharing)

</div>

---

ShieldSync is a web-based public safety application that empowers residents of Johor Bahru to report incidents, locate emergency services, receive AI-driven safety insights, and coordinate neighbourhood watch groups — all in real time.

Built with React 19, Firebase, Leaflet (OpenStreetMap), and Google Gemini AI.

This is a solo sprint hackathon that made in single day development.

This application was built with AI assistance using agent in planning in Antigravity and Visual Studio Code as secondary text editor ,AI agent model used(Claude Opus 4.6).
The AI assisted with:
Raw plan organizing
Code generation for quick frontend code 
Searching unknown(silent) bugs
Assist in solving unknown bugs
Tailwind CSS styling
Organized and structured plan is used for generation of codes. All codes are reviewed ,read ,and validated by solo developer.
AI is an assistant in structuring large volume of plans for developer but not autonomous agent that thinks and build by it owns.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Feature Breakdown](#feature-breakdown)
- [Mock vs Live Data](#mock-vs-live-data)
- [Go-to-Market Plan](#go-to-market-plan)
- [Measurable Community Benefits](#measurable-community-benefits)
- [Firestore Data Schema](#firestore-data-schema)
- [Scripts](#scripts)

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| Interactive Safety Map | Live | Real-time Leaflet map with OpenStreetMap tiles, emergency service markers, incident pins |
| Incident Reporting | Live | Submit reports with GPS or pin-on-map location, stored in Firestore |
| Real-Time Alerts | Live | Firestore `onSnapshot` listener — new incidents appear on every user's map instantly |
| 12-Hour Auto-Expire | Live | Incidents older than 12 hours automatically disappear from the map |
| Emergency Service Finder | Live | Overpass API queries for police, fire stations, hospitals within Johor Bahru |
| Gamification (Points) | Live | +5 points per report, rank progression (Observer → Shield Master), animated counters |
| AI Safety Insights | Live | Gemini 2.0 Flash generates neighbourhood summaries, contribution reviews, safety tips |
| Rewards Shop | Mock | Redeemable rewards UI (coffee, movie tickets, safety kits, GrabFood vouchers) |
| Watch Groups | Mock | Group creation, member management, chat interface with mock data |
| Settings Page | Mock | Theme and notification preferences UI |
| Firebase Auth | Live | Email/password sign-up & login, anonymous auth fallback for reporting |
| Mobile Responsive | Live | Sidebar collapses, mobile-optimised layouts throughout |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, JSX |
| Styling | Tailwind CSS 4, custom design system (glassmorphism, dark theme) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Maps | Leaflet + React-Leaflet, CartoDB dark tiles, Overpass API |
| Backend | Firebase Firestore (database), Firebase Auth (authentication) |
| AI | Google Gemini 2.0 Flash via `@google/generative-ai` SDK |
| Routing | React Router DOM v7 |
| Analytics | Firebase Analytics (optional) |

---

## Project Structure

```
shieldsync/
├── .env                        # Environment variables (git-ignored)
├── .env.example                # Template for environment variables
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
├── public/
│   └── assets/logos/
│
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Router configuration
│   │
│   ├── components/
│   │   ├── AiInsightsPanel.jsx     # Gemini AI insights (3 tabs: Area, You, Tips)
│   │   ├── DashboardLayout.jsx     # Sidebar + main content layout wrapper
│   │   ├── EmergencyCard.jsx       # Emergency service detail card
│   │   ├── IncidentCard.jsx        # Incident detail card
│   │   ├── PointsDisplay.jsx       # Gamification — points, rank, progress bar
│   │   ├── ReportModal.jsx         # Incident report form (type, description, GPS/pin)
│   │   ├── RewardsShop.jsx         # Mock rewards redemption shop
│   │   ├── SafetyMap.jsx           # Leaflet map with all markers & layers
│   │   └── Sidebar.jsx             # Navigation sidebar with collapse
│   │
│   ├── pages/
│   │   ├── ActivityDashboardScreen.jsx  # Points, chart, AI insights, mini map, rewards
│   │   ├── HomeScreen.jsx               # Main dashboard — stats, emergency services, panic button
│   │   ├── LandingPage.jsx              # Public landing page with feature cards
│   │   ├── LoginPage.jsx               # Firebase email/password login
│   │   ├── SafetyMapScreen.jsx          # Full-screen safety map with filters & reporting
│   │   ├── SignUpPage.jsx               # Firebase email/password registration
│   │   └── WatchGroupScreen.jsx         # Watch groups UI (mock data)
│   │
│   ├── services/
│   │   ├── firebase.js              # Firebase app init, auth, Firestore exports
│   │   ├── geminiService.js         # Gemini AI: neighbourhood summary, tips, user summary
│   │   ├── reportService.js         # Submit/subscribe incidents, user stats, points system
│   │   ├── emergencyService.js      # Overpass API: police, fire, hospital queries + caching
│   │   ├── locationService.js       # Browser Geolocation API wrapper
│   │   ├── watchService.js          # Watch group CRUD (scaffolded)
│   │   ├── aiSafetyInsights.js      # Legacy AI insights (pre-Gemini)
│   │   └── safetyAnalytics.js       # Safety scoring utilities
│   │
│   ├── data/
│   │   └── mockSafetyData.js        # Fallback mock incidents & services
│   │
│   ├── hooks/
│   │   └── useIsMobile.js           # Responsive breakpoint hook
│   │
│   ├── utils/
│   │   ├── constants.js             # App-wide constants
│   │   ├── haversine.js             # Haversine distance formula (km)
│   │   └── voiceInput.js            # Voice input utility (Web Speech API)
│   │
│   └── styles/
│       ├── index.css                # Global styles, Leaflet dark popup overrides
│       ├── app.css                  # App-specific styles
│       └── design-system.css        # Design tokens & glassmorphism utilities
│
└── docs/                            # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/shieldsync.git
cd shieldsync

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and Gemini API keys

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (enable Generative Language API in GCP) |

> **Note**: All keys are loaded via `import.meta.env.VITE_*` (Vite convention). The `.env` file is git-ignored.

### Firebase Setup Requirements

1. **Authentication** → Enable **Email/Password** and **Anonymous** sign-in methods
2. **Firestore** → Create database, set security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /incidents/{doc} {
         allow read: if true;
         allow create, update: if request.auth != null;
       }
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
3. **Firestore Indexes** → Create composite index: collection `incidents`, fields `timestamp ASC`, scope `Collection`

---

## Feature Breakdown

### 1. Interactive Safety Map (`SafetyMapScreen` + `SafetyMap`)
- Full-screen Leaflet map with CartoDB dark tiles
- Real-time emergency service markers (police, fire, hospital) via Overpass API
- Real-time incident markers with **type-specific icons**: Crime (red), Accident (orange), Hazard (yellow), Harassment (purple), Medical (blue), Other (gray)
- User location marker with accuracy circle
- Dynamic filter pills (All / Police / Fire / Hospital)
- Zoom controls positioned at bottom-left

### 2. Incident Reporting (`ReportModal` + `reportService`)
- **6 incident types**: Crime, Accident, Hazard, Harassment, Medical, Other
- **Two location modes**: GPS auto-detect or manual pin-on-map
- Pin-on-map flow: modal closes → crosshair cursor → user clicks map → modal re-opens with pinned coordinates
- Firestore document: `{ type, description, latitude, longitude, timestamp, userId, pointsAwarded }`
- Inline error messages (auth failure, permission denied, network error)

### 3. Real-Time Alerts (`subscribeToIncidents`)
- Firestore `onSnapshot` for live updates — new reports appear on every connected map within seconds
- **12-hour auto-expiry**: query window is `timestamp >= now - 12h`; stale incidents disappear automatically
- Gracefully handles pending server timestamps

### 4. Emergency Service Finder (`emergencyService`)
- Overpass API with Johor Bahru bounding box (1.35,103.55 → 1.70,103.90)
- Returns police, fire stations, hospitals (nodes + ways)
- In-memory cache prevents repeated API calls
- Client-side haversine sort → top N nearest
- Falls back to mock data if Overpass is unreachable

### 5. Activity Dashboard (`ActivityDashboardScreen`)
- **Points & Rank** — animated counter, 6-tier rank progression bar
- **Weekly Contribution Chart** — bar chart of the user's reports over 7 days
- **Mini Safety Map** — incidents within 5 km of the user only
- **AI Insights Panel** — Gemini-powered, three tabs
- **Rewards Shop** — mock redemption interface
- **Floating Action Button** — quick access to Report Modal

### 6. AI Safety Insights (`geminiService` + `AiInsightsPanel`)
- **Area tab**: Neighbourhood safety assessment — count, types, patterns, actionable advice
- **You tab**: Personalised contribution summary based on reporting history
- **Tips tab**: 3 actionable safety tips matching local incident patterns
- Powered by **Gemini 2.0 Flash** via `@google/generative-ai`
- Falls back to locally generated text if the API is unavailable

### 7. Gamification (`reportService` + `PointsDisplay`)
- **+5 points per report** — stored in Firestore `users/{uid}`
- 6 ranks: Observer (0 pts) → Reporter (10) → Guardian (50) → Sentinel (100) → Protector (250) → Shield Master (500)
- Animated counter & progress bar

### 8. Authentication (`LoginPage` + `SignUpPage`)
- Firebase Email/Password auth
- Anonymous auth fallback for reporting
- Protected routes redirect unauthenticated users to `/login`

### 9. Home Dashboard (`HomeScreen`)
- Quick stat cards (services, alerts, safety score)
- Nearest emergency services with call/navigate
- Expandable emergency call button (Police 999, Nearest Hospital, Bomba 994)

### 10. Landing Page (`LandingPage`)
- Public feature overview with expandable detail cards
- CTA buttons to sign up / login

---

## Mock vs Live Data

| Component | Data Source | Notes |
|-----------|-----------|-------|
| Safety Map markers (services) | **Live** — Overpass API | Falls back to `mockSafetyData.js` if API fails |
| Safety Map markers (incidents) | **Live** — Firestore `onSnapshot` | Real-time, 12h window |
| Incident reporting | **Live** — Firestore `addDoc` | Writes to `incidents` collection |
| Points & user stats | **Live** — Firestore `users/{uid}` | Incremented on each submission |
| AI Insights (Area, You, Tips) | **Live** — Gemini 2.0 Flash | Falls back to local text generation |
| Emergency phone numbers | **Hardcoded** | Malaysia: 999 (Police), 994 (Bomba), 991 (Ambulance) |
| Rewards Shop | **Mock** | UI only — no backend redemption |
| Watch Groups | **Mock** | Mock groups, members, chat messages in `mockSafetyData.js` |
| Settings page | **Mock** | UI toggles only, no persistence |

---

## Go-to-Market Plan

### Phase 1: Campus Pilot (Month 1–2)
- **Target**: UTM (Universiti Teknologi Malaysia) JB campus — ~25,000 students
- **Action**: Partner with Student Affairs, distribute via university WhatsApp groups and orientation kits
- **Goal**: 500 active users, 100+ incident reports
- **KPI**: App installs, weekly active reporters

### Phase 2: Community Expansion (Month 3–4)
- **Target**: Taman Universiti, Skudai, Nusajaya residential areas
- **Action**: Partner with Rukun Tetangga (neighbourhood associations), local PDRM community policing units, and Majlis Bandaraya Johor Bahru (MBJB)
- **Goal**: 2,000 active users, 50+ watch groups
- **KPI**: Reports per postcode, group engagement rate

### Phase 3: City-Wide Launch (Month 5–6)
- **Target**: All of Johor Bahru (~1.5 million population)
- **Action**: Media (The Star, Berita Harian), social media campaigns, PDRM volunteer integration
- **Goal**: 10,000 active users
- **KPI**: Incident response time improvement, geographic coverage density

### Phase 4: Multi-City & Sustainability (Month 7–12)
- **Target**: Kuala Lumpur, Penang, Kuching
- **Revenue**: Premium features for gated communities / corporate campuses; anonymised safety data for local government
- **Partnerships**: Grab (safety corridor data), 7-Eleven / Petronas (rewards redemption partners)
- **Goal**: 50,000 users nationally

### Distribution Channels
1. **PWA** — install directly from browser (no app store needed)
2. **University orientation packs** — QR code in welcome kits
3. **Neighbourhood WhatsApp groups** — shareable invite links
4. **Police stations** — poster QR codes with PDRM endorsement

---

## Measurable Community Benefits

### Safety Outcomes

| Metric | How We Measure | Expected Impact |
|--------|----------------|-----------------|
| Incident response time | Compare average response before/after ShieldSync in pilot areas | **20–30% faster** — real-time alerts reach neighbours and responders instantly |
| Incident reporting rate | Reports per 1,000 residents per month | **3–5x increase** — gamification + anonymity lowers friction |
| Crime awareness | Pre/post survey on safety awareness | **60%+ improvement** — AI summaries and visible map pins make threats tangible |
| Under-reporting reduction | Compare ShieldSync vs official PDRM statistics | **Bridge 40–60% gap** — anonymous reporting captures incidents people won't call 999 for |

### Community Engagement

| Metric | How We Measure | Expected Impact |
|--------|----------------|-----------------|
| Active reporters | Unique users with ≥1 report per month | **15–20% of install base** — points system drives ongoing participation |
| Watch group participation | Members per group, messages per week | **3x more engagement** than traditional WhatsApp groups |
| Neighbourhood coverage | % of JB postcodes with ≥5 active users | **80% coverage** within 6 months of city-wide launch |

### Data Value for Authorities

| Output | Benefit |
|--------|---------|
| Incident heat maps | PDRM patrol route optimisation |
| Temporal patterns | Targeted patrols during peak incident hours |
| Type-frequency analysis | Prioritise resources (e.g., high harassment area → CCTV request) |
| Before/after comparison | Measure intervention effectiveness (new lights → fewer incidents?) |

### Social Impact Summary

> ShieldSync transforms passive bystanders into active community guardians. By gamifying safety reporting and delivering AI-driven insights, we expect to **reduce average incident response time by 25%**, **increase reporting by 4x**, and build a **self-sustaining safety network** where every resident contributes to — and benefits from — their neighbourhood's security.

---

## Firestore Data Schema

### `incidents` collection
```json
{
  "type": "crime | accident | hazard | harassment | medical | other",
  "description": "string",
  "latitude": 1.4927,
  "longitude": 103.7414,
  "timestamp": "ServerTimestamp",
  "userId": "firebase_uid",
  "pointsAwarded": 5
}
```

### `users` collection
```json
{
  "totalPoints": 25,
  "incidentCount": 5,
  "lastReportAt": "ServerTimestamp"
}
```

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Emergency Numbers (Malaysia)

| Service | Number |
|---------|--------|
| Police | 999 |
| Fire (Bomba) | 994 |
| Ambulance | 991 |

> **Do NOT call during development — use mock data for testing.**

---

## License

This project was built for **KrackAthon 2025** — Johor Bahru's community safety hackathon.

---

<p align="center"><strong>ShieldSync</strong> — Making Johor Bahru safer, together.</p>

