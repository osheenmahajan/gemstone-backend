import { useEffect, useState } from 'react';
import API from '../api/axios';
import GemstoneCard from '../components/GemstoneCard';
import Loader from '../components/Loader';

export default function History() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 5; // recommendations per page

  const fetchHistory = async (pageNumber = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/recommendations/history?page=${pageNumber}&limit=${limit}`);
      setRecs(res.data.recommendations || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || pageNumber);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await fetchHistory(page);
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/recommendations/${id}`);
      // Reload history for current page
      fetchHistory(page);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete entry');
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(d || '');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
          📜 Recommendation History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your astrological consultation history ({totalCount} entries).
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl p-4">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Loading your history...
          </p>
        </div>
      ) : recs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500 font-semibold shadow-sm">
          No recommendations logged yet. Go get your first recommendation!
        </div>
      ) : (
        <div className="space-y-8">
          {/* History Lists */}
          {recs.map((rec) => {
            const displayPurpose = rec.purpose || rec.preference || '';
            return (
              <div
                key={rec.id || rec._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Meta details header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Generated On
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {formatDate(rec.createdAt)}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl capitalize">
                      ⭐ {rec.zodiacSign}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl">
                      📅 Month {rec.birthMonth}
                    </span>
                    {displayPurpose && (
                      <span className="text-xs bg-violet-50 text-violet-700 font-bold px-3 py-1.5 rounded-xl capitalize animate-fade">
                        🎯 {displayPurpose}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(rec.id || rec._id)}
                    className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3.5 py-2 rounded-xl transition duration-200 font-semibold sm:ml-auto"
                    aria-label="Delete recommendation"
                  >
                    🗑 Delete Entry
                  </button>
                </div>

                {/* Mapped Gemstones Grid */}
                {rec.gemstones?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rec.gemstones.map((g) => (
                      <GemstoneCard key={g.id || g._id} gemstone={g} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No gemstones associated with this entry.</p>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition duration-200 disabled:opacity-50"
              >
                ◀ Previous
              </button>

              <span className="text-xs font-bold text-slate-500">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition duration-200 disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
