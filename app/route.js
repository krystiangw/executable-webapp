/* globals app */
var archiver = require('archiver');
var url = require('url');
var randomstring = require('randomstring');

var uploader = require('./uploader');
var execGenerator = require('./execGenerator');
var config = require('./config');

app.post('/', function (req, res) {
  var format = getFormat(req);
  var tempDirectory = config.TEMP_DIRECTORY + randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });

  uploader.upload(req, res, tempDirectory)
  .then(function() {
    return execGenerator.create(format, tempDirectory);
  }).then(function () {
    return archiveAndSendDir(res, tempDirectory + '/' + config.GENERATED_APP_NAME + '/' + format);
  }).catch(function (error) {
    res.status(500).send({ error: error });
  });
});

function archiveAndSendDir(res, dir) {
  var archive = archiver('zip', {});
  archive.on('error', function(err) {
    console.error('error ', err);
  });

  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  archive.pipe(res);

  archive.directory(dir, '');
  return archive.finalize();
}

function getFormat(req) {
  return url.parse(req.url, true).query.format || config.DEFAULT_FORMAT;
}
