import { useContext } from 'react';
import { AuthContext } from './AuthContextBase.jsx';

export function useAuth() {
  return useContext(AuthContext);
}

