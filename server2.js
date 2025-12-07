const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url, httpVersion, headers } = req;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Request Details</title>
      </head>
      <body>
        <h1>Request Details</h1>

        <p><strong>Method:</strong> ${method}</p>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>HTTP Version:</strong> ${httpVersion}</p>

        <h2>Headers:</h2>
        <ul>
          ${Object.entries(headers)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join('')}
        </ul>
      </body>
    </html>
  `;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});
