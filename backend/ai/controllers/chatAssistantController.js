const { askAssistant } = require('../services/chatAssistantService');
const { getProvider, isLlmConfigured } = require('../services/llmClient');

exports.chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        error: 'message is required'
      });
    }

    const response = await askAssistant({
      message,
      userId: req.user?.id,
      sessionId
    });

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    return next(error);
  }
};

exports.chatHealth = async (req, res) => {
  const provider = getProvider();
  const llmConfigured = isLlmConfigured();

  return res.status(200).json({
    success: true,
    data: {
      provider,
      llmConfigured,
      mode: llmConfigured ? 'llm_rag_with_fallback' : 'deterministic_fallback_only',
      fallbackAvailable: true
    }
  });
};
