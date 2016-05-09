/* globals app */

var express = require('express');
global.app = express();
var cors = require('cors');

var config = require('./app/config');
require('./app/route');

app.use(cors());
app.set('port', (process.env.PORT || config.DEFAULT_PORT));
app.use(express.static(__dirname + '/public'));

var server = app.listen(app.get('port'), function() {
  console.log('App is running at port:' + app.get('port'));
});

server.timeout = config.REQUEST_TIMEOUT;
