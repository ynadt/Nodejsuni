const createServer = require('./src/server');

createServer().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
