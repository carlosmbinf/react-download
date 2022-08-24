var Promise = require('bluebird').Promise;
var exec = require('child_process').exec;

// retuen a promise(text)
function execute(command) {
  var cmd = command;
  try {
    return new Promise(function (resolve, reject) {
      exec(cmd, function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    return error.message;
  }
}

module.exports = execute;