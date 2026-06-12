import { useEffect, useState } from 'react';
import API from '../api/axios';
import GemstoneCard from '../components/GemstoneCard';
import Loader from '../components/Loader';

export default function Catalog() {
  const [gemstones, setGemstones] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGemstones = async (q) => {
    setLoading(true);
    setError('');
    try {
      const qs = q ? `?q=${encodeURIComponent(q)}` : '';
      const res = await API.get(`/gemstones${qs}`);
      setGemstones(res.data.gemstones || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await fetchGemstones('');
      // no-op if unmounted
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGemstones(search);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h1 className="text-2xl font-bold text-slate-900">Gemstone Catalog</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search name, color, category..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {loading ? 'Loading...' : `${gemstones.length} gemstones`}
      </div>

      {loading ? (
        <Loader />
      ) : gemstones.length === 0 ? (
        <div className="mt-8 text-slate-600">No results found.</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {gemstones.map((g) => (
            <GemstoneCard key={g._id || g.id} gemstone={g} />
          ))}
        </div>
      )}
    </div>
  );
}

