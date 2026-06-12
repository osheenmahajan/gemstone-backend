import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-700">
          💎 GemStone
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/catalog" className="text-slate-600 hover:text-blue-600">
            Catalog
          </Link>

          {token ? (
            <>
              <Link
                to="/recommend"
                className="text-slate-600 hover:text-blue-600"
              >
                Recommend
              </Link>
              <Link to="/history" className="text-slate-600 hover:text-blue-600">
                History
              </Link>
              <Link to="/profile" className="text-slate-600 hover:text-blue-600">
                Profile
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-violet-600 hover:text-violet-800"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

