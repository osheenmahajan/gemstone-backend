import API from '../api/axios';

const extractUserAndToken = (res) => {
  // Backend returns: { success, token, user }
  const data = res?.data || {};
  return {
    token: data.token,
    user: data.user,
  };
};

const authService = {
  async register(userData) {
    const res = await API.post('/auth/register', userData);
    return extractUserAndToken(res);
  },

  async login(credentials) {
    const res = await API.post('/auth/login', credentials);
    return extractUserAndToken(res);
  },

  async logout() {
    // Stateless logout: backend only returns message.
    // Token cleanup is handled by UI/AuthContext.
    await API.post('/auth/logout');
    return { success: true };
  },

  async getCurrentUser() {
    const res = await API.get('/users/me');
    return res.data?.user;
  },

  async updateProfile(profileData) {
    const res = await API.put('/users/me', profileData);
    return res.data?.user;
  },
};

export default authService;

