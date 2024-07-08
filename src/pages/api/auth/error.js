// src/pages/api/auth/error.js
export default function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Simulate error response
  return res.status(400).json({ success: false, error: 'Invalid request' });
}
