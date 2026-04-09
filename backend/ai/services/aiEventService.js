const AiEvent = require('../models/AiEvent');

const pickClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || req.connection?.remoteAddress || null;
};

const createAiEvent = async ({ req, body, userId }) => {
  const event = await AiEvent.create({
    user: userId || null,
    sessionId: body.sessionId,
    eventType: body.eventType,
    source: body.source || 'web',
    payload: {
      productId: body.payload?.productId || null,
      orderId: body.payload?.orderId || null,
      query: body.payload?.query || null,
      quantity: body.payload?.quantity ?? null,
      price: body.payload?.price ?? null
    },
    metadata: {
      userAgent: req.headers['user-agent'] || null,
      ipAddress: pickClientIp(req),
      page: body.metadata?.page || null,
      referrer: req.headers.referer || body.metadata?.referrer || null
    }
  });

  return event;
};

module.exports = {
  createAiEvent
};
