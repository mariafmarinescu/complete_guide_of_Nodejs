const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Starting an app</title></head>');
    res.write('<body>');
    res.write('<h2>This is yet another input</h2>');
    res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>');
    res.write('<button type="button"><a href="http://localhost:8080/users"> Click to see the future user list</a></button>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Starting an app</title></head>');
    res.write('<body><h3>Yet another list</h3><ul><li>place for a  future  username</li><li>another place for a future user here</li></ul></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/create-user') {
    let username = '';
    req.on('data', chunk => {
      username += chunk.toString();
    });
    req.on('end', () => {
      console.log(username); 
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  }
});

server.listen(3000);
