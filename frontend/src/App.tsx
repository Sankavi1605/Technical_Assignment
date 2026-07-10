import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member/dashboard" element={
          <ProtectedRoute role="MEMBER"><MemberDashboard /></ProtectedRoute>
        } />
        <Route path="/manager/dashboard" element={
          <ProtectedRoute role="MANAGER"><ManagerDashboard /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
