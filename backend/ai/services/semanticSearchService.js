const Product = require('../../models/Product');

const STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'with', 'in', 'on', 'to', 'and', 'or', 'of']);
const SYNONYMS = {
  phone: ['mobile', 'smartphone'],
  mobile: ['phone', 'smartphone'],
  laptop: ['notebook'],
  earbuds: ['earphones', 'headphones'],
  shoes: ['sneakers'],
  tv: ['television'],
  watch: ['smartwatch']
};

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));

const unique = (arr) => [...new Set(arr)];

const expandWithSynonyms = (tokens) => {
  const expanded = [...tokens];
  for (const token of tokens) {
    const alternatives = SYNONYMS[token] || [];
    expanded.push(...alternatives);
  }
  return unique(expanded);
};

const levenshteinDistance = (a, b) => {
  const source = String(a || '');
  const target = String(b || '');

  const dp = Array.from({ length: source.length + 1 }, () => Array(target.length + 1).fill(0));

  for (let i = 0; i <= source.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= target.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= source.length; i += 1) {
    for (let j = 1; j <= target.length; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[source.length][target.length];
};

const fuzzyMatchBonus = (queryTokens, candidateTokens) => {
  let bonus = 0;
  for (const queryToken of queryTokens) {
    for (const token of candidateTokens) {
      if (queryToken.length < 4 || token.length < 4) continue;
      const distance = levenshteinDistance(queryToken, token);
      if (distance === 1) {
        bonus += 0.02;
        break;
      }
    }
  }
  return Math.min(bonus, 0.08);
};

const jaccardSimilarity = (aSet, bSet) => {
  const intersectionSize = [...aSet].filter((token) => bSet.has(token)).length;
  const unionSize = new Set([...aSet, ...bSet]).size;
  if (unionSize === 0) return 0;
  return intersectionSize / unionSize;
};

const normalizeLimit = (rawLimit) => {
  const value = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(value) || value <= 0) return 12;
  return Math.min(value, 40);
};

const semanticSearchProducts = async ({ query, limit: rawLimit, categoryId }) => {
  const trimmedQuery = String(query || '').trim();
  if (!trimmedQuery) {
    return [];
  }

  const queryTokens = expandWithSynonyms(unique(tokenize(trimmedQuery)));
  const queryTokenSet = new Set(queryTokens);
  const limit = normalizeLimit(rawLimit);

  const dbFilter = { status: 'active', stock: { $gt: 0 } };
  if (categoryId) {
    dbFilter.category = categoryId;
  }

  const candidates = await Product.find(
    dbFilter,
    {
      name: 1,
      description: 1,
      tags: 1,
      category: 1,
      images: 1,
      price: 1,
      rating: 1,
      sold: 1
    }
  )
    .populate('category', 'name slug')
    .limit(900)
    .lean();

  const scored = candidates
    .map((candidate) => {
      const textTokens = unique([
        ...tokenize(candidate.name),
        ...tokenize(candidate.description),
        ...(candidate.tags || []).flatMap((tag) => tokenize(tag))
      ]);

      const tokenSet = new Set(textTokens);
      const semanticScore = jaccardSimilarity(queryTokenSet, tokenSet);
      const keywordBonus = (candidate.name || '').toLowerCase().includes(trimmedQuery.toLowerCase()) ? 0.25 : 0;
      const popularityBonus = Math.log10((candidate.sold || 0) + 1) * 0.04;
      const ratingBonus = (candidate.rating || 0) * 0.03;
      const typoBonus = fuzzyMatchBonus(queryTokens, textTokens);

      const score = semanticScore + keywordBonus + popularityBonus + ratingBonus + typoBonus;

      return {
        ...candidate,
        semanticScore: Number(score.toFixed(4))
      };
    })
    .filter((item) => item.semanticScore > 0)
    .sort((a, b) => b.semanticScore - a.semanticScore)
    .slice(0, limit);

  return scored;
};

module.exports = {
  semanticSearchProducts
};
