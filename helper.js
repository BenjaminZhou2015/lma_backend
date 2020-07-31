var crypto = require('crypto');
module.exports.cryptPwd = function (password) {
  var md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
}

module.exports.millisToMinutes = function (millis) {
  var minutes = Math.floor(millis / 60000);
  return minutes;
}