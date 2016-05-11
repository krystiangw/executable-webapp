var jsonfile = require('jsonfile');
var _ = require('lodash');
jsonfile.spaces = 4;

var config = require('./config');

module.exports = {
  create: create
};

function create(dest, conf) {
  conf = conf || {};
  var defaultConf = {
    version: '1.0.0',
    name: config.DEFAULT_TITLE,
    main: config.TEMP_FILENAME,
    window: {
      title: config.DEFAULT_TITLE,
      position: 'center',
      frame: true,
      toolbar: false
    }
  };

  var promise = new Promise(function(resolve, reject) {
    jsonfile.writeFile(dest + '/package.json', _.merge({}, defaultConf, conf), function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('Json file created');
      }
    });
  });

  return promise;
}
