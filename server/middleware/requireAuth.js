const { verifyAccessToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });

  try {
    const token = header.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token expired or invalid' });
  }
};
