var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
//var cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(cors());

app.post('/writefile', function(req, res) {
	var fileData = req.body.fileContent;
    fs.writeFile('message.txt', fileData , function(err) {
      if (err) {
         res.status(500).jsonp({ error: 'Failed to write file' });
      }
      res.send("File write success");
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var port = 3000;

app.set('port', port);
var server = http.createServer(app);

server.listen(port);
