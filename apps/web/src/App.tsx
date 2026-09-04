import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth/AuthContext';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Repository } from './pages/Repository';
import { Search } from './pages/Search';
import { Dashboard } from './pages/Dashboard';
import { MapExplorer } from './pages/MapExplorer';
import { Workspace } from './pages/Workspace';
import { Simulator } from './pages/Simulator';
import { GrievanceForm } from './pages/GrievanceForm';
import { GrievanceInbox } from './pages/GrievanceInbox';
import { InnovationPortal } from './pages/InnovationPortal';
import { Profile } from './pages/Profile';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapExplorer />} />
        <Route path="/repository" element={<Repository />} />
        <Route path="/search" element={<Search />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/grievance" element={<GrievanceForm />} />
        <Route path="/inbox" element={<GrievanceInbox />} />
        <Route path="/innovation" element={<InnovationPortal />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
