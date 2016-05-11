var NwBuilder = require('nw-builder');

var packageGenerator = require('./packageGenerator');

module.exports = {
  create: create
};

function create(format, tempDirectory, title) {
  var nw = new NwBuilder({
    files: tempDirectory + '/**/*',
    platforms: [format],
    version: '0.12.0',
    buildDir: tempDirectory
  });

  nw.on('log',  console.log);

  return packageGenerator.create(
    tempDirectory,
    {
      name: title,
      window: {
        title: title
      }
    })
    .then(function() {
      return nw.build();
    });
}
