import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import SafetyMapScreen from './screens/SafetyMapScreen'
import WatchGroupScreen from './screens/WatchGroupScreen'
import MobileNav from './components/MobileNav'
import './App.css'

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
