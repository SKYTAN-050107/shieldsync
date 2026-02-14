import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import SafetyMapScreen from './pages/SafetyMapScreen'
import WatchGroupScreen from './pages/WatchGroupScreen'
import MobileNav from './components/MobileNav'
import './styles/app.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/safety-map" element={<SafetyMapScreen />} />
          <Route path="/report" element={<SafetyMapScreen />} /> {/* Redirect to map for reporting */}
          <Route path="/watch" element={<WatchGroupScreen />} />
        </Routes>
        <MobileNav />
      </div>
    </Router>
  )
}

export default App
