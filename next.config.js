// next.config.js
const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),   // 👈 pehle se jo aliases the unko preserve karo
      '@': path.resolve(__dirname),
      '@/data': path.resolve(__dirname, 'data'),
      // jo bhi aur chahiye idhar
    };

    return config;
  },
};
