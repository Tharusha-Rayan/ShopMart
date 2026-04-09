# SmartShop AI Features Guide

This document explains:
1) What AI features are implemented
2) Where users experience them
3) How each feature works technically (Software Engineer view)

---

## 1) AI Event Tracking (Behavior Data)

### As a User (Where used)
- Happens automatically while browsing.
- Triggered when users:
  - View products
  - Search products
  - Add to cart
  - (Purchase events can be logged in checkout flow)

### As a Software Engineer (How it works)
- Endpoint: `POST /api/ai/events`
- Stores event type + payload + metadata + session/user context.
- Uses validation before saving.
- Data model includes indexed fields for analytics performance.
- Main purpose: provide training/evaluation data for recommender, search quality, and product insights.

---

## 2) Personalized Recommendations

### As a User (Where used)
- Home page: "Recommended For You"
- Product detail page: related/recommended products

### As a Software Engineer (How it works)
- Endpoint: `GET /api/ai/recommendations`
- Hybrid scoring approach:
  - Behavior signal (weighted events: view/add-to-cart/purchase)
  - Content similarity (category/tags/price proximity)
  - Popularity/rating boosts
- Filters for active and in-stock items.
- Returns ranked product list with score.
- Recommendation interactions can be measured using analytics scripts.

---

## 3) Review Sentiment Analysis

### As a User (Where used)
- Seller dashboard shows sentiment summary (positive/neutral/negative) and overall trend.

### As a Software Engineer (How it works)
- Admin recompute endpoint: `POST /api/ai/sentiment/recompute`
- Summary endpoint: `GET /api/ai/sentiment/summary`
- Sentiment pipeline:
  - Tokenize review title/comment
  - Lexicon-based positive/negative scoring
  - Blend with numeric rating signal
  - Output label + normalized score
- Persists in review model fields:
  - `sentimentLabel`
  - `sentimentScore`
  - `sentimentUpdatedAt`
- Supports seller/admin insight aggregation.

---

## 4) Semantic Search (AI Search)

### As a User (Where used)
- Product listing search uses semantic matching when search query is present.
- Better results for intent-level queries, close words, and related terms.

### As a Software Engineer (How it works)
- Endpoint: `GET /api/ai/search/semantic?q=...`
- Search scoring combines:
  - Token overlap similarity (semantic score)
  - Keyword bonus
  - Popularity and rating bonus
  - Typo tolerance (fuzzy match bonus)
  - Synonym expansion for common shopping terms
- Includes script pipeline for building product text embeddings:
  - `npm run ai:build-embeddings`
- Evaluation script compares semantic vs keyword baseline:
  - `npm run ai:eval:search`

---

## 5) AI Chat Assistant

### As a User (Where used)
- Floating chat widget available across the app.
- Helps with:
  - Product discovery
  - Order tracking
  - Returns/shipping questions

### As a Software Engineer (How it works)
- Endpoint: `POST /api/ai/chat`
- Intent-driven assistant flow:
  - Detects intent from message
  - Routes to response strategy (search/order/help/fallback)
  - Returns response + suggestions + confidence
- Integrates semantic product search for shopping queries.
- Logs conversations for improvement in `AiChatLog`.
- Marks unresolved/low-confidence requests for future tuning.

---

## 6) AI Data Export + Evaluation (Internship/Production Readiness)

### As a User (Where used)
- Not directly visible to users.
- Improves recommendation/search/sentiment quality over time.

### As a Software Engineer (How it works)
- Dataset export:
  - `npm run ai:export-data`
- Recommendation evaluation:
  - `npm run ai:eval:recommendations`
  - `npm run ai:eval:recommendation-metrics`
- Sentiment evaluation:
  - `npm run ai:eval:sentiment`
- Semantic search evaluation:
  - `npm run ai:eval:search`
- Privacy guidance stored in AI data folder to avoid sensitive-data training leakage.

---

## Current Scope vs Future Scope

### Implemented now
- AI event tracking
- Recommendation API + frontend integration
- Sentiment pipeline + seller summary integration
- Semantic search + frontend integration
- Chat assistant + widget integration
- Export/evaluation scripts

### Not implemented yet (future work)
- Dynamic pricing suggestions
- Fraud/anomaly detection
- Notification send-time intelligence
- Advanced model serving (external vector DB / LLM orchestration)

---

## Quick API Map

- `POST /api/ai/events`
- `GET /api/ai/recommendations`
- `POST /api/ai/sentiment/recompute` (admin)
- `GET /api/ai/sentiment/summary` (seller/admin)
- `GET /api/ai/search/semantic`
- `POST /api/ai/chat`

---

## Practical User Journey Example

1. User searches "wireless earbuds" -> semantic search returns intent-matched products.
2. User opens product pages -> events logged for behavior profile.
3. Home page recommendations improve based on those events.
4. User adds item to cart -> stronger recommendation signal recorded.
5. Seller receives sentiment trends from incoming reviews for decision support.
6. User can ask assistant about orders/returns without navigating multiple pages.
