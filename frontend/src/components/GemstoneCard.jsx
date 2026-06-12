import React from 'react';

export default function GemstoneCard({ gemstone, onEdit, onDelete }) {
  const {
    id,
    _id,
    name,
    color,
    category,
    imageUrl,
    price,
    currency,
    description,
    zodiacSign,
    zodiacSigns,
    benefits,
    reason,
    buyLink,
    buy_link,
  } = gemstone;

  // Handle flexible properties from different API forms
  const displayBuyLink = buyLink || buy_link;
  const displayCurrency = currency || 'INR';
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: displayCurrency,
    maximumFractionDigits: 0,
  }).format(price || 0);

  // Zodiac Sign parsing (can be a string or JSON array)
  let displayZodiac = '';
  if (zodiacSign) {
    displayZodiac = zodiacSign;
  } else if (zodiacSigns) {
    if (Array.isArray(zodiacSigns)) {
      displayZodiac = zodiacSigns.join(', ');
    } else {
      try {
        const parsed = JSON.parse(zodiacSigns);
        displayZodiac = Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
      } catch {
        displayZodiac = String(zodiacSigns);
      }
    }
  }

  // Split benefits (pipe-separated values)
  const benefitsList = benefits
    ? benefits.split('|').map((b) => b.trim())
    : [];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      {/* Gemstone Image with Badge */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop'}
          alt={name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/90 backdrop-blur text-slate-800 px-3 py-1 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Gemstone Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-lg text-slate-800 tracking-tight leading-snug">
            {name}
          </h3>
          <p className="font-extrabold text-slate-900 text-base flex-shrink-0">
            {formattedPrice}
          </p>
        </div>
        
        <p className="text-xs text-slate-400 font-medium mb-3 capitalize">
          {color} · {displayZodiac ? `✨ Compatible: ${displayZodiac}` : ''}
        </p>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
          {description}
        </p>

        {/* Benefits Badges */}
        {benefitsList.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {benefitsList.map((benefit, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full capitalize"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Reason */}
        {reason && (
          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-800 leading-relaxed font-medium">
            💡 {reason}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-2 space-y-2">
          {displayBuyLink && (
            <a
              href={displayBuyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition duration-300 shadow-sm"
            >
              🛍 Buy Now
            </a>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(gemstone)}
                  className="flex-1 text-xs py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition duration-300"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id || _id)}
                  className="flex-1 text-xs py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition duration-300"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
