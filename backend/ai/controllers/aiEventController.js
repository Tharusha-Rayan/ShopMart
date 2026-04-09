const { validateAiEvent } = require('../validators/validateAiEvent');
const { createAiEvent } = require('../services/aiEventService');

exports.logEvent = async (req, res, next) => {
  try {
    const { isValid, errors } = validateAiEvent(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    const event = await createAiEvent({
      req,
      body: req.body,
      userId: req.user?.id
    });

    return res.status(201).json({
      success: true,
      data: {
        id: event._id,
        eventType: event.eventType,
        createdAt: event.createdAt
      }
    });
  } catch (error) {
    return next(error);
  }
};
