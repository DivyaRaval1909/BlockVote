// simple check local network
const http = require('http');
http.get('http://127.0.0.1:8545', (res) => {
  console.log("127.0.0.1 responds with status:", res.statusCode);
}).on('error', (e) => {
  console.error("127.0.0.1 error:", e.message);
});

http.get('http://localhost:8545', (res) => {
  console.log("localhost responds with status:", res.statusCode);
}).on('error', (e) => {
  console.error("localhost error:", e.message);
});
