import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Home from './pages/user/Home'
import Students from './pages/user/Students'
import Classes from './pages/user/Classes'
import ClassDetail from './pages/user/ClassDetail'
import Menu from './pages/user/Menu'
import Login from './pages/admin/Login'
import AdminHome from './pages/admin/AdminHome'
import AdminStudents from './pages/admin/AdminStudents'
import Sale from './pages/admin/Sale'
import MenuManagement from './pages/admin/MenuManagement'
import Reports from './pages/admin/Reports'
import DebtView from './pages/admin/DebtView'

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/admin/login" replace />
}

export const router = createBrowserRouter([
  // User routes
  { path: '/', element: <Home /> },
  { path: '/students', element: <Students /> },
  { path: '/classes', element: <Classes /> },
  { path: '/classes/:code', element: <ClassDetail /> },
  { path: '/menu', element: <Menu /> },
  
  // Admin routes
  { path: '/admin/login', element: <Login /> },
  { path: '/admin', element: <ProtectedRoute><AdminHome /></ProtectedRoute> },
  { path: '/admin/students', element: <ProtectedRoute><AdminStudents /></ProtectedRoute> },
  { path: '/admin/sale', element: <ProtectedRoute><Sale /></ProtectedRoute> },
  { path: '/admin/menu', element: <ProtectedRoute><MenuManagement /></ProtectedRoute> },
  { path: '/admin/reports', element: <ProtectedRoute><Reports /></ProtectedRoute> },
  { path: '/admin/debt', element: <ProtectedRoute><DebtView /></ProtectedRoute> },
  
  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
])
