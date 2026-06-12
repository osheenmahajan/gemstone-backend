import { useMemo, useState } from 'react';

import API from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const initialForm = useMemo(
    () => ({
      name: user?.name || '',
      zodiacSign: user?.zodiacSign || '',
      birthMonth: user?.birthMonth || '',
      preference: user?.preference || 'healing',
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);


  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');







  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await API.put('/users/me', form);
      updateUser(res.data.user);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-2xl shadow-sm p-5 max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={user?.email || ''}
              readOnly
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Zodiac Sign</label>
            <input
              value={form.zodiacSign}
              onChange={(e) => setForm((p) => ({ ...p, zodiacSign: e.target.value }))}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Birth Month</label>
            <input
              type="number"
              min={1}
              max={12}
              value={form.birthMonth}
              onChange={(e) => setForm((p) => ({ ...p, birthMonth: e.target.value }))}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Preference</label>
            <select
              value={form.preference}
              onChange={(e) => setForm((p) => ({ ...p, preference: e.target.value }))}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {['healing', 'protection', 'wealth', 'love', 'clarity', 'energy'].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {success && <span className="text-sm text-emerald-700">✓ Profile updated!</span>}
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </div>
        )}
      </form>

      {loading ? <Loader /> : null}
    </div>
  );
}

