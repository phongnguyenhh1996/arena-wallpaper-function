module.exports = (req, res, next) => {
  if (req.user.username === 'admin') {
    return next();
  } else {
    res.status(403).json({ error: 'Admin only' });
  }
}