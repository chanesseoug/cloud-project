import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import RoomsPage from './pages/RoomsPage'
import CalendarPage from './pages/CalendarPage'
import ReservationsPage from './pages/ReservationsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/admin/AdminPage'

import {
  ProtectedRoute,
} from './components/ProtectedRoute'

import {
  AdminRoute,
} from './components/AdminRoute'

import {
  AppLayout,
} from './components/layout/AppLayout'

export default function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/rooms"
            element={<RoomsPage />}
          />

          <Route
            path="/calendar"
            element={<CalendarPage />}
          />

          <Route
            path="/reservations"
            element={<ReservationsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminPage />}
            />

          </Route>

        </Route>

      </Route>

      <Route
        path="*"
        element={
          <Navigate to="/dashboard" replace />
        }
      />

    </Routes>
  )
}