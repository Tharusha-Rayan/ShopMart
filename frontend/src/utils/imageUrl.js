const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const resolveImageUrl = (image) => {
  const candidate = typeof image === 'string' ? image : image?.url;

  if (!candidate) {
    return null;
  }

  if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:') || candidate.startsWith('blob:')) {
    return candidate;
  }

  const normalizedPath = candidate.startsWith('/') ? candidate : `/${candidate}`;

  return `${API_BASE_URL}${normalizedPath}`;
};
