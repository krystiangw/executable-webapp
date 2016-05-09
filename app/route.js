/* globals app */
var archiver = require('archiver');
var url = require('url');
var randomstring = require('randomstring');
var del = require('del');

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
  .then(function () {
    return execGenerator.create(format, tempDirectory);
  }).then(function () {
    return archiveAndSendDir(res, tempDirectory + '/' + config.GENERATED_APP_NAME + '/' + format);
  }).then(function () {
    removeDir(tempDirectory);
  }).catch(function (error) {
    res.status(500).send({ error: error });
    removeDir(tempDirectory);
  });
});

function archiveAndSendDir(res, dir) {
  var promise = new Promise(function(resolve, reject) {
    var archive = archiver('zip', {});
    archive.on('error', reject);

    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
      resolve();
    });

    archive.pipe(res);

    archive.directory(dir, '');
    archive.finalize();
  });

  return promise;
}

function getFormat(req) {
  return url.parse(req.url, true).query.format || config.DEFAULT_FORMAT;
}

function removeDir(dir) {
  return del(dir).then(paths => {
    console.log('Deleted temp folder:\n', paths.join('\n'));
  });
}
