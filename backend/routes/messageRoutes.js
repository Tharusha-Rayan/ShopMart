const express = require('express');
const router = express.Router();
const { sendMessage, getConversations, getMessages, createConversation } = require('../controllers/combinedController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.post('/conversation', protect, createConversation);
router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);

module.exports = router;
