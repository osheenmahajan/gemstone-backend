import { useEffect, useMemo, useState } from 'react';
import API from '../../api/axios';
import GemstoneCard from '../../components/GemstoneCard';

const emptyGemForm = {
  name: '',
  description: '',
  category: 'healing',
  color: '',
  zodiacSigns: [],
  birthMonths: [],
  imageUrl: '',
  price: 0,
  inStock: true,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [gemstones, setGemstones] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [gemForm, setGemForm] = useState(emptyGemForm);
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditTarget(null);
    setGemForm(emptyGemForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (g) => {
    setEditTarget(g);
    setGemForm({
      name: g.name || '',
      description: g.description || '',
      category: g.category || 'healing',
      color: g.color || '',
      zodiacSigns: g.zodiacSigns || [],
      birthMonths: g.birthMonths || [],
      imageUrl: g.imageUrl || '',
      price: g.price || 0,
      inStock: g.inStock ?? true,
    });
    setError('');
    setShowModal(true);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, gemsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/gemstones'),
          API.get('/admin/users'),
        ]);
        setStats(statsRes.data || null);
        setGemstones(gemsRes.data.gemstones || gemsRes.data || []);
        setUsers(usersRes.data.users || usersRes.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleteGem = async (id) => {
    try {
      await API.delete(`/gemstones/${id}`);
      setGemstones((prev) => prev.filter((g) => String(g.id) !== String(id)));

    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete gemstone');
    }
  };

  const saveGem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editTarget) {
      await API.put(`/gemstones/${editTarget.id}`, gemForm);
        setGemstones((prev) =>
          prev.map((g) => (String(g.id) === String(editTarget.id) ? { ...g, ...gemForm } : g))
        );
      } else {
        const res = await API.post('/gemstones', gemForm);
        const created = res.data.gemstone || res.data;
        setGemstones((prev) => [created, ...prev]);
      }

      setShowModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save gemstone');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete user');
    }
  };


  const statCards = useMemo(() => {
    return [
      { label: 'Users', value: stats?.users ?? users.length },
      { label: 'Gemstones', value: stats?.gemstones ?? gemstones.length },
      { label: 'Recs', value: stats?.recommendations ?? stats?.recs ?? '—' },
      { label: 'Top Zodiac', value: stats?.topZodiac ?? '—' },
    ];
  }, [stats, users.length, gemstones.length]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      {error ? (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-semibold ${
            activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('gemstones')}
          className={`px-4 py-2 rounded-xl font-semibold ${
            activeTab === 'gemstones' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Gemstones
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-semibold ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Users
        </button>
      </div>

      {loading ? (
        <div className="mt-10 text-slate-600">Loading...</div>
      ) : activeTab === 'gemstones' ? (
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Gemstones</h2>
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700"
            >
              + Add Gemstone
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gemstones.map((g) => (
              <GemstoneCard
                key={g.id}
                gemstone={g}
                onEdit={openEdit}
                onDelete={handleDeleteGem}
              />
            ))}


          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">Users</h2>
          <div className="mt-4 bg-white rounded-2xl shadow-sm p-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Zodiac</th>
                  <th className="py-2">Role</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {users.map((u) => (
                  <tr key={u.id || u._id} className="border-t border-slate-100">
                    <td className="py-3">{u.name}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.zodiacSign}</td>
                    <td className="py-3">{u.role}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id || u._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-slate-600">
          Select a tab to manage admin data.
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div className="font-bold text-slate-900">
                {editTarget ? 'Edit Gemstone' : 'Add Gemstone'}
              </div>
              <button className="text-slate-500 hover:text-slate-700" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={saveGem} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  value={gemForm.name}
                  onChange={(e) => setGemForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={gemForm.description}
                  onChange={(e) => setGemForm((p) => ({ ...p, description: e.target.value }))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <input
                    value={gemForm.category}
                    onChange={(e) => setGemForm((p) => ({ ...p, category: e.target.value }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Color</label>
                  <input
                    value={gemForm.color}
                    onChange={(e) => setGemForm((p) => ({ ...p, color: e.target.value }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    value={gemForm.price}
                    onChange={(e) => setGemForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Image URL</label>
                  <input
                    value={gemForm.imageUrl}
                    onChange={(e) => setGemForm((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">In Stock</label>
                <select
                  value={gemForm.inStock ? 'yes' : 'no'}
                  onChange={(e) => setGemForm((p) => ({ ...p, inStock: e.target.value === 'yes' }))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

