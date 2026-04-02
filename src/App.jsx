import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import TeacherLogin from './pages/TeacherLogin'
import StudentLogin from './pages/StudentLogin'

// Student Flow
import StudentHome from './pages/student/Home'
import FilterQuestions from './pages/student/FilterQuestions'
import IncidentDetails from './pages/student/IncidentDetails'
import PostReport from './pages/student/PostReport'
import CounselorList from './pages/student/CounselorList'
import AppointmentPage from './pages/student/Appointment'
import NotBullying from './pages/student/NotBullying'
import ThankYou from './pages/student/ThankYou'
import AppointmentStatus from './pages/student/AppointmentStatus'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import ReportDetail from './pages/admin/ReportDetail'
import AppointmentManager from './pages/admin/AppointmentManager'
import AvailabilitySettings from './pages/admin/AvailabilitySettings'

function ProtectedRoute({ children }) {
  const { teacher } = useAuth()
  if (!teacher) return <Navigate to="/ogretmen-girisi" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ogretmen-girisi" element={<TeacherLogin />} />
        <Route path="/giris" element={<StudentLogin />} />

        {/* Student Flow */}
        <Route path="/bildir" element={<StudentHome />} />
        <Route path="/bildir/sorular" element={<FilterQuestions />} />
        <Route path="/bildir/detaylar" element={<IncidentDetails />} />
        <Route path="/bildir/tesekurler" element={<PostReport />} />
        <Route path="/bildir/danismanlar" element={<CounselorList />} />
        <Route path="/bildir/randevu" element={<AppointmentPage />} />
        <Route path="/bildir/zorbalık-degil" element={<NotBullying />} />
        <Route path="/bildir/son" element={<ThankYou />} />
        <Route path="/bildir/durum" element={<AppointmentStatus />} />

        {/* Admin (protected) */}
        <Route path="/panel" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/panel/rapor/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
        <Route path="/panel/randevular" element={<ProtectedRoute><AppointmentManager /></ProtectedRoute>} />
        <Route path="/panel/musaitlik" element={<ProtectedRoute><AvailabilitySettings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
