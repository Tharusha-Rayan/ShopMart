const express = require('express');
const { optionalAuth } = require('../../middleware/auth');
const { protect, authorize } = require('../../middleware/auth');
const { logEvent } = require('../controllers/aiEventController');
const { getRecommendations } = require('../controllers/recommendationController');
const {
	recomputeSentiment,
	getSummary
} = require('../controllers/sentimentController');
const { searchSemantic } = require('../controllers/semanticSearchController');
const { chat, chatHealth } = require('../controllers/chatAssistantController');

const router = express.Router();

router.post('/events', optionalAuth, logEvent);
router.get('/recommendations', optionalAuth, getRecommendations);
router.post('/sentiment/recompute', protect, authorize('admin'), recomputeSentiment);
router.get('/sentiment/summary', protect, authorize('seller', 'admin'), getSummary);
router.get('/search/semantic', optionalAuth, searchSemantic);
router.post('/chat', optionalAuth, chat);
router.get('/chat/health', chatHealth);

module.exports = router;
