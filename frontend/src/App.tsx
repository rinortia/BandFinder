import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import AdDetailPage from './pages/AdDetailPage'
import AdFormPage from './pages/AdFormPage'
import AdsPage from './pages/AdsPage'
import DashboardPage from './pages/DashboardPage'
import EditAdPage from './pages/EditAdPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MusicianDetailPage from './pages/MusicianDetailPage'
import MusiciansPage from './pages/MusiciansPage'
import RegisterPage from './pages/RegisterPage'
import './styles/global.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="musicians" element={<MusiciansPage />} />
            <Route path="musicians/:id" element={<MusicianDetailPage />} />
            <Route path="ads" element={<AdsPage />} />
            <Route path="ads/create" element={<AdFormPage />} />
            <Route path="ads/:id/edit" element={<EditAdPage />} />
            <Route path="ads/:id" element={<AdDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
