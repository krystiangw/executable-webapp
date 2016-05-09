var jsonfile = require('jsonfile');
jsonfile.spaces = 4;

var config = require('./config');

module.exports = {
  create: create
};

function create(dest) {
  var obj = {
    version: '1.0.0',
    name: config.GENERATED_APP_NAME,
    main: config.TEMP_FILENAME,
    window: {
      frame: true,
      toolbar: false
    }
  };

  var promise = new Promise(function(resolve, reject) {
    jsonfile.writeFile(dest + '/package.json', obj, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('Json file created');
      }
    });
  });

  return promise;
}
