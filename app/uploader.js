var multer = require('multer');
var fs = require('fs');

var config = require('./config');

module.exports = {
  upload: upload,
  mkdirSync: mkdirSync
};

function upload(req, res, dest) {
  mkdirSync(dest);
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      cb(null, config.TEMP_FILENAME);
    } 
  });

  var promise = new Promise(function(resolve, reject) {
    multer({ storage: storage }).single('file')(req, res, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('File uploaded');
      }
    });
  });

  return promise;
}

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}
