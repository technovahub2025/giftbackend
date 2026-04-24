const NodeCache = require('node-cache');

// Create cache instances with different TTLs
const productCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes for products
  checkperiod: 60 // Check for expired keys every 60 seconds
});

const productDetailCache = new NodeCache({ 
  stdTTL: 600, // 10 minutes for product details
  checkperiod: 120 
});

// Cache middleware for products list
const cacheProducts = (duration = 300) => {
  return (req, res, next) => {
    const key = `products:${JSON.stringify(req.query)}`;
    const cachedData = productCache.get(key);
    
    if (cachedData) {
      console.log('Cache hit for products list');
      return res.status(200).json(cachedData);
    }
    
    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache response
    res.json = function(data) {
      productCache.set(key, data, duration);
      console.log('Cache set for products list');
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Cache middleware for single product
const cacheProductDetail = (duration = 600) => {
  return (req, res, next) => {
    const { id } = req.params;
    const key = `product:${id}`;
    const cachedData = productDetailCache.get(key);
    
    if (cachedData) {
      console.log('Cache hit for product detail');
      return res.status(200).json(cachedData);
    }
    
    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache response
    res.json = function(data) {
      productDetailCache.set(key, data, duration);
      console.log('Cache set for product detail');
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Clear cache functions
const clearProductCache = () => {
  productCache.flushAll();
  console.log('Product cache cleared');
};

const clearProductDetailCache = (id) => {
  if (id) {
    productDetailCache.del(`product:${id}`);
    console.log(`Product detail cache cleared for id: ${id}`);
  } else {
    productDetailCache.flushAll();
    console.log('All product detail cache cleared');
  }
};

// Clear all product-related caches
const clearAllProductCaches = () => {
  productCache.flushAll();
  productDetailCache.flushAll();
  console.log('All product caches cleared');
};

module.exports = {
  cacheProducts,
  cacheProductDetail,
  clearProductCache,
  clearProductDetailCache,
  clearAllProductCaches
};
