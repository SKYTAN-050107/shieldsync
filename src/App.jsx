import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomeScreen from './pages/HomeScreen'
import SafetyMapScreen from './pages/SafetyMapScreen'
import WatchGroupScreen from './pages/WatchGroupScreen'
import DashboardLayout from './components/DashboardLayout'
import './styles/app.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Dashboard with Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="map" element={<SafetyMapScreen />} />
          <Route path="report" element={<SafetyMapScreen />} />
          <Route path="watch" element={<WatchGroupScreen />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
