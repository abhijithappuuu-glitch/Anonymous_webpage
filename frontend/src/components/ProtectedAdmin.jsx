import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Admin from '../pages/Admin';

const ProtectedAdmin = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyber-blue"></div></div>;
  if (!user || user.role !== 'admin') {
    return <div className="max-w-xl mx-auto p-8 text-center text-red-600 bg-red-100 rounded mt-20">Access Denied. You must be logged in as an admin to view this page.</div>;
  }
  return <Admin />;
};

export default ProtectedAdmin;
