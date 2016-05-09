var NwBuilder = require('nw-builder');

var packageGenerator = require('./packageGenerator');

module.exports = {
  create: create
};

function create(format, tempDirectory) {
  var nw = new NwBuilder({
    files: tempDirectory + '/**/*',
    platforms: [format],
    version: '0.12.0',
    buildDir: tempDirectory,
    main: 'main.html',
    window: {
      frame: false,
      toolbar: false
    }
  });

  nw.on('log',  console.log);

  return packageGenerator.create(tempDirectory)
  .then(function() {
    return nw.build();
  });
}
