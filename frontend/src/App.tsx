
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/admin/AdminPage'

import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

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

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminPage />}
          />

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
