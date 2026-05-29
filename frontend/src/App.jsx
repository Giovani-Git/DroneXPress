import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewDelivery from './pages/NewDelivery';
import Deliveries from './pages/Deliveries';
import DeliveryDetail from './pages/DeliveryDetail';
import DronePage from './pages/DronePage';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Support from './pages/Support';
import MyReports from './pages/MyReports';

function AuthLayout({ children }) {
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <Routes>
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/dashboard" element={<ProtectedRoute><AuthLayout><Dashboard /></AuthLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AuthLayout><Profile /></AuthLayout></ProtectedRoute>} />
          <Route path="/deliveries/new" element={<ProtectedRoute><AuthLayout><NewDelivery /></AuthLayout></ProtectedRoute>} />
          <Route path="/deliveries" element={<ProtectedRoute><AuthLayout><Deliveries /></AuthLayout></ProtectedRoute>} />
          <Route path="/deliveries/:id" element={<ProtectedRoute><AuthLayout><DeliveryDetail /></AuthLayout></ProtectedRoute>} />
          <Route path="/drones" element={<ProtectedRoute><AuthLayout><DronePage /></AuthLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AuthLayout><AdminDashboard /></AuthLayout></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><AuthLayout><Support /></AuthLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AuthLayout><MyReports /></AuthLayout></ProtectedRoute>} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
