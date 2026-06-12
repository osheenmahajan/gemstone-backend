import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


const LOGIN_PATH = '/login';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to={LOGIN_PATH} replace />;
}


