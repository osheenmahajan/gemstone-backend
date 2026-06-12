import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


const LOGIN_PATH = '/login';
const HOME_PATH = '/';

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to={LOGIN_PATH} replace />;
  if (user?.role !== 'admin') return <Navigate to={HOME_PATH} replace />;
  return children;
}


