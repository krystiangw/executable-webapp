var express = require('express');
var app = express();
var multer = require('multer');
var cors = require('cors');
var NwBuilder = require('nw-builder');
var archiver = require('archiver');
var url = require('url');

const DOWNLOADS_DIRECTORY = 'downloads/';
const BUILD_DIRECTORY = DOWNLOADS_DIRECTORY + 'build/';
const TEMP_FILENAME = 'off.html';
const DEFAULT_FORMAT = 'win64';
const REQUEST_TIMEOUT = 200000;

app.use(cors());

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DOWNLOADS_DIRECTORY);
  },
  filename: function (req, file, cb) {
    cb(null, TEMP_FILENAME);
  } 
});

var upload = multer({ storage: storage }).single('file');

var server = app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

server.timeout = REQUEST_TIMEOUT;

app.post('/', upload, function (req, res) {
  var format = getFormat(req);
  generateExecutable(format).then(function () {
    return archiveAndSendDir(res, BUILD_DIRECTORY + 'off/' + format);
  }).catch(function (error) {
    console.error('ERROR!!! ', error);
  });
});

function getFormat(req) {
  return url.parse(req.url, true).query.format || DEFAULT_FORMAT;
}

function archiveAndSendDir(res, dir) {
  var archive = archiver('zip', {});
  archive.on('error', function(err){
      console.error('error ', err);
  });

  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  archive.pipe(res);

  archive.directory(dir, '');
  return archive.finalize();
}

function generateExecutable(format) {
  var nw = new NwBuilder({
    files: DOWNLOADS_DIRECTORY + '**/*',
    platforms: [format],
    version: '0.12.0',
    buildDir: BUILD_DIRECTORY,
    window: {
      frame: false,
      toolbar: false
    },
  });

  nw.on('log',  console.log);
  return nw.build();
}
