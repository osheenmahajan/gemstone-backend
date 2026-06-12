import { useState } from 'react';
import API from '../api/axios';
import GemstoneCard from '../components/GemstoneCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/useAuth';

const ZODIACS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const PURPOSES = [
  'wealth',
  'love',
  'health',
  'protection',
  'success',
  'healing',
  'energy',
  'clarity'
];

export default function Recommend() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    zodiacSign: user?.zodiacSign || '',
    birthMonth: user?.birthMonth || '',
    purpose: user?.preference || 'healing',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendations = async (bypassCache = false) => {
    setLoading(true);
    setError('');

    try {
      console.log('📤 Recommendation request:');
      console.log('   Form details:', form);
      console.log('   Bypass Cache:', bypassCache);

      const requestBody = {
        zodiacSign: form.zodiacSign,
        birthMonth: Number(form.birthMonth),
        purpose: form.purpose,
        preference: form.purpose, // fallback for legacy safety
        regenerate: bypassCache,
        bypassCache: bypassCache
      };

      const res = await API.post('/recommendations/recommend', requestBody);
      console.log('✅ Recommendations success response:', res.data);
      setResults(res.data.recommendations || []);
      setSubmitted(true);
    } catch (err) {
      console.error('❌ Recommendations request failed:', err);
      let errorMessage = 'Failed to generate recommendations';

      if (err?.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid query parameters. Please check your inputs.';
      }

      setError(errorMessage);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations(false);
  };

  const handleRegenerate = () => {
    fetchRecommendations(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          ✨ Discover Your Gemstone
        </h1>
        <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
          Unlock the astrological power of stones curated matching your zodiac sign, birth month, and personal life purpose.
        </p>
      </div>

      {/* Input Selection Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-8 max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zodiac Sign dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Zodiac Sign
              </label>
              <select
                value={form.zodiacSign}
                onChange={(e) => setForm((p) => ({ ...p, zodiacSign: e.target.value }))}
                required
                className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-50/50 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-400"
              >
                <option value="">Select Zodiac</option>
                {ZODIACS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Birth Month input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Birth Month
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.birthMonth}
                onChange={(e) => setForm((p) => ({ ...p, birthMonth: e.target.value }))}
                required
                placeholder="1 - 12"
                className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-400"
              />
            </div>

            {/* Purpose input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Life Purpose
              </label>
              <select
                value={form.purpose}
                onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
                required
                className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-50/50 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-400"
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition duration-300 shadow-md hover:shadow-lg hover:shadow-violet-200 disabled:opacity-60 text-sm"
            >
              {loading ? 'Analyzing Alignment...' : '✨ Find Recommendations'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader />
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Consulting the Stars...
          </p>
        </div>
      ) : submitted ? (
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Your Astrological Match
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Top matched gemstones saved to your account history.
              </p>
            </div>
            
            {results.length > 0 && (
              <button
                onClick={handleRegenerate}
                className="text-xs font-bold bg-violet-50 text-violet-600 border border-violet-100 px-4 py-2.5 rounded-xl hover:bg-violet-100 transition duration-200 flex items-center gap-1.5"
              >
                🔄 Refresh & Recalculate
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 font-medium">
              No matching gemstones found for these filters. Try adjusting your month or purpose!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((g) => (
                <GemstoneCard key={g.id || g._id} gemstone={g} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
