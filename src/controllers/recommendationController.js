import { Gemstone, Recommendation, User } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

// ─────────────────────────────────────────────────────────────────────────────
// ZODIAC COMPATIBILITY MAP
// Each sign lists itself first (exact), then compatible signs (+3 group score)
// ─────────────────────────────────────────────────────────────────────────────
const COMPATIBLE_ZODIACS = {
  Aries:       ['Aries', 'Leo', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'],
  Taurus:      ['Taurus', 'Virgo', 'Capricorn', 'Cancer', 'Scorpio', 'Pisces'],
  Gemini:      ['Gemini', 'Libra', 'Aquarius', 'Aries', 'Leo', 'Sagittarius'],
  Cancer:      ['Cancer', 'Scorpio', 'Pisces', 'Taurus', 'Virgo', 'Capricorn'],
  Leo:         ['Leo', 'Aries', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'],
  Virgo:       ['Virgo', 'Taurus', 'Capricorn', 'Cancer', 'Scorpio', 'Pisces'],
  Libra:       ['Libra', 'Gemini', 'Aquarius', 'Aries', 'Leo', 'Sagittarius'],
  Scorpio:     ['Scorpio', 'Cancer', 'Pisces', 'Taurus', 'Virgo', 'Capricorn'],
  Sagittarius: ['Sagittarius', 'Aries', 'Leo', 'Gemini', 'Libra', 'Aquarius'],
  Capricorn:   ['Capricorn', 'Taurus', 'Virgo', 'Cancer', 'Scorpio', 'Pisces'],
  Aquarius:    ['Aquarius', 'Gemini', 'Libra', 'Aries', 'Leo', 'Sagittarius'],
  Pisces:      ['Pisces', 'Cancer', 'Scorpio', 'Taurus', 'Virgo', 'Capricorn'],
};

// Purpose aliases: normalise synonyms so "health" matches "healing" etc.
const PURPOSE_ALIASES = {
  health:    ['health', 'healing'],
  healing:   ['healing', 'health'],
  wealth:    ['wealth', 'prosperity', 'abundance'],
  love:      ['love', 'relationships', 'emotional healing', 'comfort'],
  protection:['protection', 'grounding', 'safety', 'ward off negativity'],
  success:   ['success', 'confidence', 'courage', 'ambition'],
  energy:    ['energy', 'optimism', 'joy', 'vitality'],
  clarity:   ['clarity', 'focus', 'spirituality', 'peace', 'mindfulness'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE IN-MEMORY CACHE (5-minute TTL)
// ─────────────────────────────────────────────────────────────────────────────
class SimpleCache {
  constructor(ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttlMs;
  }
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) { this.cache.delete(key); return null; }
    return item.value;
  }
  set(key, value) {
    this.cache.set(key, { value, expiry: Date.now() + this.ttl });
  }
  delete(key) { this.cache.delete(key); }
}

const recommendationCache = new SimpleCache();

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE
// Points:
//   +5  exact zodiac match
//   +3  compatible zodiac group match
//   +4  purpose matches benefits (with alias expansion)
//   +2  birth month match (seasonal logic)
//   +1  general popularity fallback (always given — ensures non-zero score)
// ─────────────────────────────────────────────────────────────────────────────
const scoreGemstone = (g, { zodiacSign, birthMonth, purpose }) => {
  let score = 1; // +1 popularity baseline — guarantees no zero scores
  const reasons = [];

  // Parse JSON fields if stored as strings
  const gemZodiacs = Array.isArray(g.zodiacSigns)
    ? g.zodiacSigns
    : JSON.parse(g.zodiacSigns || '[]');
  const gemMonths = Array.isArray(g.birthMonths)
    ? g.birthMonths
    : JSON.parse(g.birthMonths || '[]');
  const benefitsList = g.benefits
    ? g.benefits.split('|').map((b) => b.trim().toLowerCase())
    : [];

  // Zodiac scoring
  const exactZodiacMatch = gemZodiacs.map(z => z.toLowerCase()).includes((zodiacSign || '').toLowerCase());
  const compatibleList   = (COMPATIBLE_ZODIACS[zodiacSign] || [zodiacSign]).map(z => z.toLowerCase());
  const compatibleZodiacMatch = !exactZodiacMatch &&
    gemZodiacs.some((z) => compatibleList.includes(z.toLowerCase()));

  if (exactZodiacMatch) {
    score += 5;
    reasons.push(`+5 exact zodiac match (${zodiacSign})`);
  } else if (compatibleZodiacMatch) {
    score += 3;
    reasons.push(`+3 compatible zodiac group match`);
  }

  // Birth month scoring
  const monthMatch = gemMonths.includes(Number(birthMonth));
  if (monthMatch) {
    score += 2;
    reasons.push(`+2 birth month match (month ${birthMonth})`);
  }

  // Purpose / benefits scoring (with alias expansion)
  const purposeKey    = (purpose || '').toLowerCase();
  const purposeTerms  = PURPOSE_ALIASES[purposeKey] || [purposeKey];
  const purposeMatch  = benefitsList.some((b) => purposeTerms.includes(b));
  if (purposeMatch) {
    score += 4;
    reasons.push(`+4 purpose match ("${purpose}")`);
  }

  reasons.push('+1 popularity baseline');

  return {
    score,
    exactZodiacMatch,
    compatibleZodiacMatch,
    monthMatch,
    purposeMatch,
    reasons,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// MAP GEMSTONE TO RESPONSE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const mapGemstoneResponse = (g, userZodiac, userBirthMonth, userPurpose) => {
  const details = scoreGemstone(g, {
    zodiacSign: userZodiac,
    birthMonth: userBirthMonth,
    purpose: userPurpose,
  });
  const { exactZodiacMatch, compatibleZodiacMatch, monthMatch, purposeMatch } = details;

  const gemZodiacs = Array.isArray(g.zodiacSigns)
    ? g.zodiacSigns
    : JSON.parse(g.zodiacSigns || '[]');

  let reason;
  if (exactZodiacMatch && monthMatch && purposeMatch) {
    reason = `Perfect match! Aligns with your zodiac sign ${userZodiac}, birth month, and directly supports your purpose of ${userPurpose}.`;
  } else if (exactZodiacMatch && purposeMatch) {
    reason = `Excellent match! Aligns with your zodiac sign ${userZodiac} and supports your purpose of ${userPurpose}.`;
  } else if (compatibleZodiacMatch && purposeMatch) {
    reason = `Highly compatible with your sign ${userZodiac} and supports your purpose of ${userPurpose}.`;
  } else if (purposeMatch) {
    reason = `Directly aligned with your purpose of ${userPurpose} to amplify your success.`;
  } else if (exactZodiacMatch) {
    reason = `Selected due to its strong natural compatibility with your zodiac sign ${userZodiac}.`;
  } else if (compatibleZodiacMatch) {
    reason = `Energetically compatible with your sign ${userZodiac} for overall balance.`;
  } else {
    reason = `A universally beneficial stone chosen to enhance your energy field and well-being.`;
  }

  const zodiacDisplay = exactZodiacMatch ? userZodiac : (gemZodiacs[0] || userZodiac);

  return {
    id: g.id,
    name: g.name,
    imageUrl: g.imageUrl,
    price: g.price,
    currency: g.currency || 'INR',
    zodiacSign: zodiacDisplay,
    benefits: g.benefits || '',
    reason,
    buyLink: g.buyLink || '',
    color: g.color || '',
    category: g.category || '',
    description: g.description || '',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION ENDPOINT
// @route POST /api/recommendations/recommend
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const recommend = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    console.log('\n🔍 [RECOMMEND] ══════════════════════════════════════');
    console.log('   userId from token:', userId);
    console.log('   body parameters:', req.body);

    if (!userId) return next(new AppError('Unauthorized: User ID not found in token', 401));

    const userIdNumber = Number(userId);
    if (!Number.isInteger(userIdNumber) || userIdNumber < 1) {
      return next(new AppError('Invalid user ID format', 400));
    }

    const userExists = await User.findByPk(userIdNumber);
    if (!userExists) return next(new AppError('User not found in database', 404));

    // Accept both camelCase and snake_case
    const zodiacSign    = req.body.zodiac_sign || req.body.zodiacSign;
    const birthMonthRaw = req.body.birth_month ?? req.body.birthMonth;
    const purpose       = req.body.purpose || req.body.preference;

    if (!zodiacSign)                           return next(new AppError('zodiacSign is required', 400));
    if (birthMonthRaw === undefined || birthMonthRaw === null) {
      return next(new AppError('birthMonth is required', 400));
    }
    if (!purpose)                              return next(new AppError('purpose/preference is required', 400));

    const birthMonth = Number(birthMonthRaw);
    if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
      return next(new AppError('birthMonth must be an integer between 1 and 12', 400));
    }

    // Cache
    const cacheKey    = `${userIdNumber}-${zodiacSign}-${birthMonth}-${purpose}`;
    const bypassCache = req.body.regenerate === true || req.body.bypassCache === true;
    if (!bypassCache) {
      const cachedResult = recommendationCache.get(cacheKey);
      if (cachedResult) {
        console.log('🚀 [RECOMMEND] Returning cached recommendation!');
        return res.status(200).json(cachedResult);
      }
    } else {
      console.log('🔄 [RECOMMEND] Bypassing cache per regenerate request.');
      recommendationCache.delete(cacheKey);
    }

    // Fetch all in-stock gemstones
    const candidates = await Gemstone.findAll({ where: { inStock: true } });
    if (!candidates || candidates.length === 0) {
      return next(new AppError('No gemstones available in stock', 404));
    }

    const DEV_LOG = process.env.NODE_ENV !== 'production';

    if (DEV_LOG) {
      console.log(`\n📊 [RECOMMEND] Scoring ${candidates.length} candidates for:`);
      console.log(`   zodiac=${zodiacSign}, month=${birthMonth}, purpose=${purpose}`);
      console.log('─────────────────────────────────────────────────');
    }

    // ── TIER 1: Score every gemstone ──────────────────────────────────────
    const scored = candidates.map((g) => {
      const details = scoreGemstone(g, { zodiacSign, birthMonth, purpose });
      if (DEV_LOG) {
        console.log(
          `   [${g.name.padEnd(22)}] score=${details.score.toString().padStart(2)}  | ` +
          details.reasons.join(', ')
        );
      }
      return { g, ...details };
    });

    // Sort descending by score, then alphabetically for deterministic tie-break
    scored.sort(
      (a, b) => b.score - a.score || String(a.g.name).localeCompare(String(b.g.name))
    );

    // ── TIER 2: Tiered fallback selection ─────────────────────────────────
    let finalCandidates = [];
    let fallbackPath    = 'primary';

    // Path A — at least one exact zodiac + purpose match
    const exactPurpose = scored.filter((x) => x.exactZodiacMatch && x.purposeMatch);
    if (exactPurpose.length >= 1) {
      fallbackPath    = 'exact_zodiac_and_purpose';
      finalCandidates = scored.map((x) => x.g);           // still use full ranking
    }

    // Path B — compatible zodiac + purpose match
    if (finalCandidates.length === 0) {
      const compatPurpose = scored.filter((x) => (x.exactZodiacMatch || x.compatibleZodiacMatch) && x.purposeMatch);
      if (compatPurpose.length >= 1) {
        fallbackPath    = 'compatible_zodiac_and_purpose';
        finalCandidates = scored.map((x) => x.g);
      }
    }

    // Path C — purpose only
    if (finalCandidates.length === 0) {
      const purposeOnly = scored.filter((x) => x.purposeMatch);
      if (purposeOnly.length >= 1) {
        fallbackPath    = 'purpose_only_fallback';
        finalCandidates = scored.map((x) => x.g);
      }
    }

    // Path D — full popularity fallback (baseline score guarantees this always works)
    if (finalCandidates.length === 0) {
      fallbackPath    = 'popularity_fallback';
      finalCandidates = scored.map((x) => x.g);
    }

    console.log(`\n📌 [RECOMMEND] Fallback path used: "${fallbackPath}"`);

    // Guarantee minimum 3 results
    const limit         = Math.min(Math.max(Number(req.body.limit) || 5, 3), 6);
    const finalGemstones = finalCandidates.slice(0, limit);

    console.log(`✅ [RECOMMEND] Returning ${finalGemstones.length} gemstones: ${finalGemstones.map(g => g.name).join(', ')}`);
    console.log('══════════════════════════════════════════════════\n');

    // Save history
    const recommendationData = {
      userId: userIdNumber,
      zodiacSign,
      birthMonth,
      purpose,
      gemstones: finalGemstones.map((g) => g.id),
    };
    const doc = await Recommendation.create(recommendationData);
    console.log('💾 [RECOMMEND] Saved recommendation ID:', doc.id);

    // Build response
    const recommendationsMapped = finalGemstones.map((g) =>
      mapGemstoneResponse(g, zodiacSign, birthMonth, purpose)
    );

    const responseData = {
      success: true,
      recommendations: recommendationsMapped,
      recommendationHistoryId: doc.id,
      debug: {
        fallbackPath,
        totalCandidates: candidates.length,
        zodiacSign,
        birthMonth,
        purpose,
      },
    };

    recommendationCache.set(cacheKey, responseData);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ [RECOMMEND] Unexpected error:', error.message);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return next(new AppError('Foreign key constraint failed: check user and gemstone references', 400));
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPAND HISTORY RECORD WITH GEMSTONE DETAILS
// ─────────────────────────────────────────────────────────────────────────────
const expandRecommendationWithGemstones = async (rec) => {
  const gemstoneIds = Array.isArray(rec.gemstones) ? rec.gemstones : [];
  if (gemstoneIds.length === 0) return { ...rec, gemstones: [] };

  const gemstones = await Gemstone.findAll({ where: { id: gemstoneIds } });
  const mapped    = gemstones.map((g) =>
    mapGemstoneResponse(g, rec.zodiacSign, rec.birthMonth, rec.purpose)
  );

  const byId    = new Map(mapped.map((m) => [m.id, m]));
  const ordered = gemstoneIds.map((id) => byId.get(Number(id))).filter(Boolean);

  return {
    ...rec,
    preference: rec.purpose,
    gemstones: ordered,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET LATEST RECOMMENDATION HISTORY
// @route GET /api/recommendations/history/latest
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const latestHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const userIdNumber = Number(userId);
    const latest = await Recommendation.findOne({
      where: { userId: userIdNumber },
      order: [['createdAt', 'DESC']],
    });

    if (!latest) return res.status(200).json({ success: true, recommendations: [] });

    const expanded = await expandRecommendationWithGemstones(
      latest.toJSON ? latest.toJSON() : latest
    );

    res.status(200).json({
      success: true,
      recommendationHistory: expanded,
      recommendations: expanded.gemstones || [],
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL RECOMMENDATION HISTORY (PAGINATED)
// @route GET /api/recommendations/history
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const history = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const userIdNumber = Number(userId);
    const page   = Number(req.query.page)  || 1;
    const limit  = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Recommendation.findAndCountAll({
      where: { userId: userIdNumber },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const data = [];
    for (const row of rows) {
      const rec      = row.toJSON ? row.toJSON() : row;
      const expanded = await expandRecommendationWithGemstones(rec);
      data.push(expanded);
    }

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      recommendations: data,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE A RECOMMENDATION
// @route DELETE /api/recommendations/:id
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const remove = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const userIdNumber = Number(userId);
    const recIdNumber  = Number(req.params.id);

    if (!Number.isInteger(recIdNumber) || recIdNumber < 1) {
      return next(new AppError('Invalid recommendation ID', 400));
    }

    const deleted = await Recommendation.destroy({
      where: { id: recIdNumber, userId: userIdNumber },
    });

    if (!deleted) {
      return next(new AppError('Recommendation not found or you do not have permission', 404));
    }

    return res.status(200).json({ success: true, message: 'Recommendation deleted' });
  } catch (error) {
    next(error);
  }
};
