
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import PlaceholderPage from './pages/PlaceholderPage'

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
          <Navigate
            to="/dashboard"
            replace
          />
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
            element={
              <PlaceholderPage
                title="Salles de réunion"
                description="Recherchez un espace adapté à vos besoins."
              />
            }
          />

          <Route
            path="/calendar"
            element={
              <PlaceholderPage
                title="Calendrier"
                description="Visualisez vos réunions et vos créneaux."
              />
            }
          />

          <Route
            path="/reservations"
            element={
              <PlaceholderPage
                title="Mes réservations"
                description="Retrouvez et gérez vos réservations."
              />
            }
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
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  )
}
