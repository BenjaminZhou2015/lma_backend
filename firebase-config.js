var admin = require("firebase-admin");

var serviceAccount = require("./adminsdk.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://lmaproject.firebaseio.com"//"https://newlmatest.firebaseio.com"// 
})

var token="";
module.exports.admin = admin