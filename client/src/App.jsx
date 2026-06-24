import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Results from './pages/Results'
import Trips from './pages/Trips'
import LoginPage from './pages/LoginPage'
import SharedTrip from './pages/SharedTrip'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen bg-slate-900" />
  if (!user) return <Navigate to={`/login?next=${location.pathname}`} replace />
  return children
}

// Reset scroll to the top on every route change — otherwise navigating from a
// scrolled-down form to /results lands you mid-page.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/shared/:shareId" element={<SharedTrip />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trips" element={
          <ProtectedRoute><Trips /></ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
