module.exports = (err, req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal error' });
};
