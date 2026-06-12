import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function HeroSection() {
  const { token } = useAuth();

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            💎 Discover Your Perfect Gemstone
          </h1>
          <p className="mt-4 text-slate-600 text-base md:text-lg">
            Find gems aligned with your zodiac, birth month and personal energy.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to={token ? '/recommend' : '/register'}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 text-center"
            >
              Get My Recommendation
            </Link>
            <Link
              to="/catalog"
              className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 text-center"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const cards = [
    {
      title: 'Why Gemstones?',
      desc: 'A personalized approach to energy and intention based on your zodiac.',
    },
    {
      title: 'How it Works',
      desc: 'Enter your details to get curated recommendations aligned to you.',
    },
    {
      title: 'Popular Stones',
      desc: 'Explore the most requested gemstones by category and preference.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 pb-16">
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="font-bold text-slate-900">{c.title}</div>
            <div className="text-slate-600 text-sm mt-2">{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeatureCards />
    </div>
  );
}

