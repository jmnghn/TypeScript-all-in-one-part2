import fs = require("fs");
import http = require("http");
import path = require("path");

http
  .createServer((req, res) => {
    setTimeout(() => {}, 1000);
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8080, () => {
    console.log("서버 시작됨");
  });
