const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/' && req.method === 'GET') {

      const filePath = path.join(__dirname, 'public', 'index.html');

      const data = await fs.readFile(filePath, 'utf8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(data);
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');

  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});
