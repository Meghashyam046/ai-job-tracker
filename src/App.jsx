import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { JobProvider } from './context/JobContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import JobFeed from './pages/JobFeed'
import ApplicationTracker from './components/ApplicationTracker'
import AIAssistant from './components/AIAssistant'

const App = () => {
  return (
    <AuthProvider>
      <JobProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<JobFeed />} />
              <Route path="/applications" element={<ApplicationTracker />} />
            </Routes>
          </main>
          <AIAssistant />
        </div>
      </JobProvider>
    </AuthProvider>
  )
}

export default App
