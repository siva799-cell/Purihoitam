// Frontend API Configuration
// Change the API_URL based on your environment

const API_CONFIG = {
  // Local Development
  development: {
    API_URL: 'http://localhost:5000'
  },

  // Production
  production: {
    API_URL: 'https://your-production-domain.com'
  },

  // Get current API URL based on environment
  getApiUrl: function() {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const env = isDev ? 'development' : 'production';
    return this[env].API_URL;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
