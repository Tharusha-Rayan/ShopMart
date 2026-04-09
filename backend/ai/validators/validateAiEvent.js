const allowedEventTypes = new Set(['product_view', 'search', 'add_to_cart', 'purchase']);
const allowedSources = new Set(['web', 'mobile']);

const validateAiEvent = (body = {}) => {
  const errors = [];

  if (!body.eventType || typeof body.eventType !== 'string') {
    errors.push('eventType is required');
  } else if (!allowedEventTypes.has(body.eventType)) {
    errors.push('eventType is invalid');
  }

  if (!body.sessionId || typeof body.sessionId !== 'string' || !body.sessionId.trim()) {
    errors.push('sessionId is required');
  }

  if (body.source && !allowedSources.has(body.source)) {
    errors.push('source is invalid');
  }

  if (body.payload && typeof body.payload !== 'object') {
    errors.push('payload must be an object');
  }

  if (body.payload?.quantity != null) {
    const quantity = Number(body.payload.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push('payload.quantity must be an integer >= 1');
    }
  }

  if (body.payload?.price != null) {
    const price = Number(body.payload.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push('payload.price must be a number >= 0');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateAiEvent
};
