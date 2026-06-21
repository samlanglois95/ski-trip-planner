import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Results from './pages/Results'
import Trips from './pages/Trips'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen bg-slate-900" />
  if (!user) return <Navigate to={`/login?next=${location.pathname}`} replace />
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
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
