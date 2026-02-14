# 🛡️ ShieldSync

**Emergency Services Finder & Community Safety Alert System for Johor Bahru**

ShieldSync helps you find the nearest police stations, fire stations, and hospitals in Johor Bahru. It also enables anonymous crime reporting and neighborhood watch coordination to keep communities safe.

---

## 🚀 Features

- **🚨 Emergency Finder**: Find nearest police, fire stations & hospitals with real-time distance
- **📍 Interactive Safety Map**: SVG-based map showing emergency services and incident locations
- **📝 Anonymous Reporting**: Report crimes/incidents anonymously with Firebase Auth
- **👥 Neighborhood Watch**: Join and coordinate with local watch groups
- **📊 Safety Analytics**: Real-time safety scoring for different areas
- **🤖 AI Safety Insights**: Predictive alerts based on incident patterns
- **📱 Mobile-First Design**: Responsive design with bottom navigation

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Custom Design System
- **Backend**: Firebase (Firestore + Auth + Analytics + Hosting)
- **Maps**: Custom SVG-based interactive maps
- **Fonts**: Montserrat (headings) + Inter (body text)

---

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shieldsync

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## ⚙️ Configuration

### Firebase Setup (Required)

1. Create a Firebase project at https://console.firebase.google.com
2. Create a project named "shieldsync-jb"
3. Enable these services:
   - **Firebase Authentication** (Enable Anonymous + Google providers)
   - **Cloud Firestore** (Start in test mode)
   - **Google Analytics**
   - **Firebase Hosting**

4. Get your Firebase configuration:
   - Go to Project Settings → General → Your apps
   - Click "SDK setup and configuration"
   - Copy the config object

5. Update `src/services/firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",              // Replace this
     authDomain: "shieldsync-jb.firebaseapp.com",
     projectId: "shieldsync-jb",
     storageBucket: "shieldsync-jb.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID", // Replace this
     appId: "YOUR_APP_ID",                // Replace this
     measurementId: "YOUR_MEASUREMENT_ID"  // Replace this
   }
   ```

### Logo Files (Optional)

Add your logo files to:
- `public/assets/logos/` - Main logo files for public access
- `src/assets/logos/` - Theme-specific logos for React components

See the README.md files in each logo directory for details.

---

## 📂 Project Structure

```
shieldsync/
├── public/
│   └── assets/logos/          # Public logo files
├── src/
│   ├── assets/logos/          # React logo imports
│   ├── components/            # Reusable UI components
│   ├── screens/               # Main app screens
│   ├── services/              # Firebase & API services
│   ├── utils/                 # Helper functions & constants
│   ├── data/                  # Mock data (9 services, 4 incidents)
│   └── styles/                # CSS & design system
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── vite.config.js             # Vite configuration
```

See `PROJECT_STRUCTURE.md` for detailed file structure.

---

## 🎨 Design System

### Safety Color Palette
- **Danger Red** (#DC2626): Emergencies, panic button
- **Safe Green** (#059669): Safe zones, open status
- **Warning Orange** (#D97706): Warnings, fire stations
- **Trust Blue** (#1D4ED8): Police, trust elements

### Typography
- **Headings**: Montserrat (Bold/Black)
- **Body**: Inter (Regular to Bold)

### Key Animations
- `panic-pulse` - Panic button pulsing effect
- `incident-ping` - Incident marker animation
- `emergency-glow` - Red glow effect
- `hover-lift` - Card lift on hover

---

## 📊 Mock Data

The project includes mock data for development:
- **9 Emergency Services**: 4 police stations, 3 fire stations, 2 hospitals
- **4 Incident Reports**: Snatch theft, break-in, suspicious activity, road rage
- **3 Watch Groups**: Taman Molek, Tebrau, Daya

Data location: `src/data/mockSafetyData.js`

---

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Firebase Hosting
```bash
# Login to Firebase (first time only)
firebase login

# Initialize Firebase (first time only)
firebase init

# Deploy
firebase deploy
```

---

## 📱 Development Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## 🗺️ Roadmap

### Stage 1: Setup & Branding ✅
- [x] Project initialization
- [x] Firebase setup
- [x] Safety design system
- [x] Mock data creation

### Stage 2: Core Services (Next)
- [ ] Emergency service logic
- [ ] Anonymous reporting
- [ ] Safety analytics
- [ ] Neighborhood watch

### Stage 3: UI Components
- [ ] HomeScreen with panic button
- [ ] Interactive SafetyMap
- [ ] Emergency & Incident cards
- [ ] Report modal & Watch widget

### Stage 4: Deployment & Polish
- [ ] Firebase deployment
- [ ] Data seeding
- [ ] Production optimization
- [ ] Final testing

---

## 🐛 Common Issues

### GPS not working
- Ensure you're using HTTPS (required for geolocation)
- `localhost` is allowed for testing
- Check browser permissions

### Firebase Auth error
- Verify Anonymous auth is enabled in Firebase Console
- Check Firebase config in `src/services/firebase.js`

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## 📞 Emergency Numbers (Johor Bahru)

- **Police**: 999
- **Fire**: 994
- **Ambulance**: 991

**⚠️ DO NOT call during development - use mock data for testing!**

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built for Johor Bahru community safety 🛡️

---

**Follow the stage files (SHIELDSYNC-STAGE-*.md) for detailed development instructions.**

