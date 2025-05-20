// pairing.js
const axios = require('axios');

async function getPairingSession() {
  try {
    const response = await axios.get('https://taira-web-service.onrender.com/pair');
    if (response.data && response.data.code && response.data.session) {
      return {
        code: response.data.code,
        session: response.data.session
      };
    } else {
      throw new Error('Invalid response from session server.');
    }
  } catch (error) {
    console.error('Failed to fetch pairing code:', error.message);
    return null;
  }
}

module.exports = getPairingSession;
