var del = require('del');

var config = require('./config');

//so the program will not close instantly
process.stdin.resume();

function exitHandler(options, err) {
  if (options.cleanup) {
    cleanUp();
  }

  if (err) {
    console.log(err.stack);
  }

  if (options.exit) {
    process.exit();
  }
}

function cleanUp() {
  del.sync(config.TEMP_DIRECTORY);
  console.log('Clean up!');
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup:true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit:true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit:true }));
