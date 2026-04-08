const memoryCache = new Map();

/**
 * simple in-memory cache middleware
 * @param {number} ttl - Time to live in seconds (default: 300 / 5 mins)
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = memoryCache.get(key);

    if (cachedResponse && Date.now() < cachedResponse.expires) {
      console.log(`Cache hit for ${key}`);
      return res.status(200).json(cachedResponse.data);
    }

    // Intercept res.json to store the response
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode === 200) {
        memoryCache.set(key, {
          data: body,
          expires: Date.now() + ttl * 1000
        });
      }
      return originalJson.call(res, body);
    };

    next();
  };
};

/**
 * Manual cache invalidation
 * @param {string} prefix - URL prefix to clear (e.g., "/api/content")
 */
const clearCache = (prefix) => {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
};

module.exports = { cacheMiddleware, clearCache };
