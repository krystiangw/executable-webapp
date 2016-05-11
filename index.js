var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var fs = require('fs');

var config = require('./app/config');

app.use(cors());
app.set('port', (process.env.PORT || config.DEFAULT_PORT));
app.use(express.static(__dirname + '/public'));

var accessLogStream = fs.createWriteStream(__dirname + '/logfile.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

var server = app.listen(app.get('port'), function() {
  console.log('App is running at port:' + app.get('port'));
});

server.timeout = config.REQUEST_TIMEOUT;

global.app = app;
require('./app/route');
require('./app/exitHandler');
