
const express = require('express');
var cors = require('cors');
const User = require('./models/user');
const Machine = require('./models/machine')
const Location = require('./models/location')
const bodyParser = require('body-parser');
const logger = require('morgan');
const helper = require('./helper');
const app = express();
const AdminUserName = 'admin';
const AdminPassWord = '123456';
let { admin } = require('./firebase-config');
const path = require('path');

//swagger is used to auto generate API documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { cwd } = require('process');

//Extended: https://swagger.io/specification/#infoObject
const definition = {
  info: {
    title: "Laundry Management App",
    description: "API Master",
    version: "1.0.0",
    contact: {
      name: "Laundry Backend Team"
    }
  }
};

const options = {
  definition,
  apis: ["server.js"]
  // apis: [".routes/*.js"]

};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Use to request all users
 *     produces:
 *       - application/json
 *     responses:
 *       "200":
 *         description: "A successful response"
 */

router.get('/users', (req, res) => {
  User.find((err, docs) => {
    if (err) return res.json({ isSuccess: false, msg: "Get ERROR" });
    return res.json({ isSuccess: true, users: docs });
  });
});


/**
 * @swagger
 * /api/machines:
 *   get:
 *     description: Use to request all machine
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "A successful response"
 */

router.get('/machines', (req, res) => {
  Machine.find((err, machines) => {
    if (err) return res.json({ isSuccess: false, msg: "Get ERROR" });
    var machineModels = [];
    Location.find((err, locations) => {
      machines.forEach(m => {
        locations.forEach(l => {
          if (l.id.toString() == m.locationID) {
            var machineModel = {
              _id: m._id.toString(),
              sn: m.sn,
              isAvailable: m.isAvailable,
              isReserved: m.isReserved,
              isPickedUp: m.isPickedUp,
              machineType: m.machineType,
              startTime: m.startTime,
              userID: m.userID,
              userReservedID: m.userReservedID,
              locationID: m.locationID,
              locationName: l.name,
              scanString: m.scanString
            }
            machineModels.push(machineModel);
          }
        })
      }
      )
      return res.json({ isSuccess: true, machines: machineModels });
    })



  });
});

/**
 * @swagger
 * /api/locations:
 *   get:
 *     description: Use to request all locations
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "A successful response"
 */

router.get('/locations', (req, res) => {
  Location.find((err, docs) => {
    if (err) return res.json({ isSuccess: false, msg: "Get ERROR" });
    return res.json({ isSuccess: true, locations: docs });
  });
});


/**
 * @swagger
 * /api/machines/:locationID:
 *   get:
 *     description: Use to request each machine's location ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: locationID
 *         description: machine's location
 *         in: json
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "A successful response"
 */
router.get('/machines/:locationID', (req, res) => {
  Machine.find({ locationID: req.params["locationID"] }, (err, docs) => {
    if (err) return res.json({ isSuccess: false, msg: "Get ERROR" });
    return res.json({ isSuccess: true, machines: docs });
  });
});

/**
 * @swagger
 * /api/checkEmail:
 *   post:
 *     description: Use to check email if it's valid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email
 *         in: json
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */

router.post('/checkEmail', (req, res) => {
  let isAvailable = true;
  let user = null;
  User.find({ email: req.body.email }, (err, docs) => {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    if (docs.length !== 0) {
      isAvailable = false;
      user = docs[0];
    }
    return res.json({ isAvailable: isAvailable, user: user, msg: "" });
  });
});
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     description: register new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User First Name
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User Last Name
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: email
 *         description: User email
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password
 *         in: JSON
 *         required: true
 *         type: string

 *     responses:
 *       201:
 *         description: "User Registered Successfully"
 */



router.post('/users/register', (req, res) => {
  const addedUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: helper.cryptPwd(req.body.password),
    locationID: ""
  });

  addedUser.save(function (err) {
    if (err) {
      return res.json({ isSuccess: false, msg: err.message })
    }
    return res.json({ isSuccess: true, msg: "" })
  });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     description: to Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Username to use for login.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Login Successfully"
 */
router.post('/users/login', (req, res) => {
  User.findOne({ email: req.body.email, password: helper.cryptPwd(req.body.password) }, (err, user) => {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    if (user) {
      isSuccess = true;
      let token = Buffer.from(req.body.email).toString('base64');
      if (user.locationID) {
        Location.findById(user.locationID, (err, location) => {
          if (err) {
            return res.json({ isSuccess: false, msg: "Get ERROR" });
          }
          else {
            return res.json({ isSuccess: true, user: user, token: token, location: location });
          }
        });
      }
      else {
        return res.json({ isSuccess: true, user: user, token: token, location: null });
      }
    }
    else {
      return res.json({ isSuccess: false, user: null, token: null, msg: "Your email or password is wrong" });
    }
  });
});

/**
 * @swagger
 * /api/location:
 *   post:
 *     description: to locate the machine's location
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: locationID
 *         description: machine location ID.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: token
 *         description: token code.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */

router.post('/location', (req, res) => {
  var locationID = req.body.locationID;
  var token = req.body.token;
  //如果token相关的用户是用户的话，把这个locationID存在token对应的用户里
  var email = Buffer.from(token, 'base64').toString('ascii');
  User.find({ email: email }, (err, docs) => {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    if (docs.length > 0) {
      var user = docs[0];
      user.locationID = locationID;
      user.save();
      return res.json({ isSuccess: true, msg: "" });
    }
    else {
      return res.json({ isSuccess: false, msg: "Token is wrong" });
    }
  })
});



/**
 * @swagger
 * /api/location/add:
 *   post:
 *     description: add new location
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Location Name
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: email
 *         description: Location email
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: defaultRunningTime
 *         description: Location defaultRunningTime
 *         in: JSON
 *         required: true
 *         type: number
 *       - name: defaultReservationExpireTime
 *         description: Location defaultReservationExpireTime
 *         in: JSON
 *         required: true
 *         type: number
 *       - name: defaultPickupTime
 *         description: Location defaultPickupTime
 *         in: JSON
 *         required: true
 *         type: number

 *     responses:
 *       201:
 *         description: "Location Added Successfully"
 */


router.post('/locations', (req, res) => {
  const addedLocation = new Location({
    name: req.body.name,
    email: req.body.email,
    defaultRunningTime: req.body.defaultRunningTime,
    defaultReservationExpireTime: req.body.defaultReservationExpireTime,
    defaultPickupTime: req.body.defaultPickupTime,
  });

  addedLocation.save(function (err) {
    if (err) {
      return res.status(500).json({ isSuccess: false, msg: err.message })
    }
    return res.status(201).json({ isSuccess: true, id: addedLocation._id, msg: "Location Added Successfully" })
  });
});

/**
 * @swagger
 * /locations/:id:
 *   delete:
 *     description: Use to delete a location
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "Location Deleted Successfully"
 */

router.delete('/locations/:id', (req, res) => {
  //console.log(req.params["id"]);
  Location.findByIdAndDelete(req.params["id"], (err, doc) => {
    //console.log(doc);
    if (doc == null) {
      return res.status(404).json({ isSuccess: false, msg: "Cannot find the Location" })
    }
    if (err) {
      return res.status(500).json({ isSuccess: false, msg: err.message })
    }
    return res.status(201).json({ isSuccess: true, msg: "Location Deleted Successfully" })
  });
});

/**
 * @swagger
 * /locations/:id:
 *   update:
 *     description: Use to update a location
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "Location Deleted Successfully"
 */

router.put('/locations/:id', (req, res) => {
  //console.log(req.params["id"]);
  Location.findByIdAndUpdate(req.params["id"],
    {
      name: req.body.name,
      email: req.body.email,
      defaultRunningTime: req.body.defaultRunningTime,
      defaultReservationExpireTime: req.body.defaultReservationExpireTime,
      defaultPickupTime: req.body.defaultPickupTime
    }, (err, doc) => {
      if (doc == null) {
        return res.status(404).json({ isSuccess: false, msg: "Cannot find the Location" })
      }
      if (err) {
        return res.status(500).json({ isSuccess: false, msg: err.message })
      }
      return res.status(201).json({ isSuccess: true, msg: "Location Updated Successfully" })
    });
});

router.post('/machines', (req, res) => {
  const addedMachine = new Machine({
    sn: req.body.sn,
    isAvailable: req.body.isAvailable,
    isPickedUp: req.body.isPickedUp,
    isReserved: req.body.isReserved,
    machineType: req.body.machineType,
    userID: req.body.userID,
    userReservedID: req.body.userReservedID,
    locationID: req.body.locationID,
    scanString: ""
  });

  addedMachine.save(function (err, machine) {
    if (err) {
      return res.json({ isSuccess: false, msg: err.message })
    }
    else {
      console.log(machine);
      machine.scanString = Buffer.from(machine.id.toString()).toString('base64');
      machine.save();
      return res.json({ isSuccess: true, msg: "" });
    }
  });
});

router.delete('/machines/:id', (req, res) => {
  //console.log(req.params["id"]);
  Location.findByIdAndDelete(req.params["id"], (err, doc) => {
    //console.log(doc);
    if (doc == null) {
      return res.status(404).json({ isSuccess: false, msg: "Cannot find the Location" })
    }
    if (err) {
      return res.status(500).json({ isSuccess: false, msg: err.message })
    }
    return res.status(201).json({ isSuccess: true, msg: "Location Deleted Successfully" })
  });
});

router.put('/machines/:id', (req, res) => {
  //console.log(req.params["id"]);
  Location.findByIdAndUpdate(req.params["id"],
    {
      sn: req.body.sn,
      isAvailable: req.body.isAvailable,
      isPickedUp: req.body.isPickedUp,
      isReserved: req.body.isReserved,
      machineType: req.body.machineType,
      userID: req.body.userID,
      userReservedID: req.body.userReservedID,
      locationID: req.body.locationID
    }, (err, doc) => {
      if (doc == null) {
        return res.status(404).json({ isSuccess: false, msg: "Cannot find the Location" })
      }
      if (err) {
        return res.status(500).json({ isSuccess: false, msg: err.message })
      }
      return res.status(201).json({ isSuccess: true, msg: "Location Updated Successfully" })
    });
});
/**
 * /admin/login:
 *   post:
 *     description: to Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Admin
 *         description: Username to admin for login.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: password (123456)
 *         description: Admin's password.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Login Successfully"
 *
 *
 */

router.post('/admin/login', (req, res) => {
  if (req.body.username !== AdminUserName || req.body.password !== AdminPassWord) {
    res.json({ isSuccess: "false", token: null, msg: "Your username or password is wrong" });
  } else {
    let token = Buffer.from(req.body.username).toString('base64');
    res.json({ isSuccess: "true", token: token, msg: "Log in success" });
  }
})

/**
 * @swagger
 * /api/scanToOpen:
 *   post:
 *     description: scan to open machine
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: user token.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: scanString
 *         description: scan string.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */

router.post('/scanToOpen', (req, res) => {
  let email = Buffer.from(req.body.token, 'base64').toString('ascii');
  User.find({ email: email }, (err, docs) => {
    if (err || !docs || docs.length == 0) {
      return res.json({ isSuccess: false, msg: "user's token is wrong", machine: null });
    }
    let isSuccess = false, machine = null;
    Machine.find({ scanString: req.body.scanString }, (err, machines) => {
      let msg = "";
      if (err) {
        return res.json({ isSuccess: false, msg: "Get ERROR" });
      }
      if (machines.length !== 0) {
        machine = machines[0];
        if (machine.isAvailable && !machine.isReserved) {
          isSuccess = true;
          msg = "machine starts to run";
          //make it occupied
          machine.isAvailable = false;
          machine.startTime = Date.now();
          machine.userID = docs[0].id
          machine.isReserved = false;
          machine.userReservedID = "";
          machine.save();
        }
        else {
          isSuccess = false;
          msg = "Sorry ,I am running";
        }
      }
      else {
        isSuccess = false;
        msg = "You may scan a wrong QR code";
      }
      return res.json({ isSuccess: isSuccess, msg: msg, machine: machine });
    })
  })
});

/**
 * @swagger
 * /api/scanToClose:
 *   post:
 *     description: scan to Close machine
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: user token.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: scanString
 *         description: scan string.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */


router.post('/scanToClose', (req, res) => {
  let email = Buffer.from(req.body.token, 'base64').toString('ascii');
  User.find({ email: email }, (err, docs) => {
    if (err || !docs || docs.length == 0) {
      return res.json({ isSuccess: false, msg: "user's token is wrong", machine: null });
    }
    let isSuccess = false, machine = null;
    Machine.find({ scanString: req.body.scanString }, (err, machines) => {
      let msg = "";
      if (err) {
        return res.json({ isSuccess: false, msg: "Get ERROR" });
      }
      if (machines.length !== 0) {
        machine = machines[0];
        if (!machine.isAvailable) {
          isSuccess = true;
          msg = "machine has stopped";
          //release machine
          machine.isAvailable = true;
          machine.startTime = Date.UTC(1970, 0, 1);
          machine.userID = "";
          machine.isPickedUp = true;
          machine.save();

          //let the one who has reserved this machine get notified
          if (machine.userReservedID) {
            User.findById(userReservedID, (err, reservedUser) => {
              if (err) {
                return res.json({ isSuccess: false, msg: "Get ERROR" });
              }
              notifyDevice(reservedUser.token)
            })
          }
        }
        else {
          isSuccess = false;
          msg = "";
        }
      }
      else {
        isSuccess = false;
        msg = "You may have scanned a wrong QR code";
      }
      return res.json({ isSuccess: isSuccess, msg: msg, machine: machine });
    })
  })
});

function notifyDevice(registrationToken) {
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  let message = {
    notification: {
      title: "Your reserved machine can be used now",
      body: "You have reserved a unit of machine. Now it's clear. Go for it!"
    }
  };

  admin.messaging().sendToDevice(registrationToken, message, options)
    .then(response => {
      return res.json({ isSuccess: true, msg: "Notification sent successfully" });
    })
    .catch(error => {
      console.log(error);
    });
}

/**
 * @swagger
 * /api/reserveWasher:
 *   post:
 *     description: reserve a washer when there is no washer available
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: user token.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */
router.post('/reserveWasher', (req, res) => {
  let email = Buffer.from(req.body.token, 'base64').toString('ascii');
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    else {
      Machine.exists({ machineType: "washer", userReservedID: user.id, locationID: user.locationID }, function (err, exist) {
        if (exist) {
          return res.json({ isSuccess: false, msg: "You have already reserved a washer." });
        }
        Location.findById(user.locationID, function (err, location) {

          if (err) {
            return res.json({ isSuccess: false, msg: "Get ERROR" });
          }
          else {
            //If there is available washer, user don't need to wait and can use them right now.
            Machine.exists({ machineType: "washer", isAvailable: true, locationID: location.id }, function (err, exist) {
              if (err) {
                return res.json({ isSuccess: false, msg: "Get ERROR" });
              }
              else {
                if (exist) {
                  return res.json({ isSuccess: false, msg: "There are available washers now, please pull down to refresh." });
                }
                else {
                  //find out the machine to be reserved  where isAvailable=false, isReserved=false and its startime is the oldest
                  Machine.findOne({ machineType: "washer", isAvailable: false, isReserved: false, isPickedUp: true, locationID: location.id }).sort('startTime').exec(function (err, washer) {
                    if (err) {
                      return res.json({ isSuccess: false, msg: "Get ERROR" });
                    }
                    else {
                      if (washer) {
                        //make userReserverId =current user,  isReserved=true
                        washer.userReservedID = user.id;
                        washer.isReserved = true;
                        washer.save();

                        let estimateTime = location.defaultRunningTime - helper.millisToMinutes(Date.now() - washer.startTime) + location.defaultPickupTime;
                        return res.json({ isSuccess: true, msg: "Reserve Successfully!", estimateTime: estimateTime, reserveMachineID: washer.id });
                      }
                      else {
                        return res.json({ isSuccess: false, msg: "No washers now" });
                      }
                    }
                  });
                }
              }
            });
          }
        })
      });
    }
  });
});


/**
 * @swagger
 * /api/reserveDryer:
 *   post:
 *     description: reserve a dryer when there is no dryer available
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: user token.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: ""
 */
router.post('/reserveDryer', (req, res) => {
  let email = Buffer.from(req.body.token, 'base64').toString('ascii');
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    else {
      Machine.exists({ machineType: "dryer", userReservedID: user.id, locationID: user.locationID }, function (err, exist) {
        if (exist) {
          return res.json({ isSuccess: false, msg: "You have already reserved a dryer." });
        }
        Location.findById(user.locationID, function (err, location) {
          if (err) {
            return res.json({ isSuccess: false, msg: "Get ERROR" });
          }
          else {
            //If there is available dryer, user don't need to wait and can use them right now.
            Machine.exists({ machineType: "dryer", isAvailable: true, locationID: location.id }, function (err, exist) {
              if (err) {
                return res.json({ isSuccess: false, msg: "Get ERROR" });
              }
              else {
                if (exist) {
                  return res.json({ isSuccess: false, msg: "There are available dryers now, please pull down to refresh." });
                }
                else {
                  //find out the machine to be reserved  where isAvailable=false, isReserved=false and its startime is the oldest
                  Machine.findOne({ machineType: "dryer", isAvailable: false, isReserved: false, isPickedUp: true, locationID: location.id }).sort('startTime').exec(function (err, dryer) {
                    if (err) {
                      return res.json({ isSuccess: false, msg: "Get ERROR" });
                    }
                    else {
                      if (dryer) {
                        //make userReserverId =current user,  isReserved=true
                        dryer.userReservedID = user.id;
                        dryer.isReserved = true;
                        dryer.save();

                        let estimateTime = location.defaultRunningTime - helper.millisToMinutes(Date.now() - dryer.startTime) + location.defaultPickupTime;
                        return res.json({ isSuccess: true, msg: "Reserve Successfully!", estimateTime: estimateTime, reserveMachineID: dryer.id });
                      }
                      else {
                        return res.json({ isSuccess: false, msg: "No dryers now" });
                      }
                    }
                  });
                }
              }
            });
          }
        })
      });
    }
  });
});

/**
 * @swagger
 * /api/firebase/notification:
 *   post:
 *     description: send usertoekn and registrationToken to server
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: registrationToken
 *         description: device's registration token.
 *         in: JSON
 *         required: true
 *         type: string
 *       - name: userToken
 *         description: user's token.
 *         in: JSON
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "msg send successfully"
 */
router.post('/firebase/notification', (req, res) => {
  let userToken = req.body.token;
  let registrationToken = req.body.registrationToken;
  let email = Buffer.from(userToken, 'base64').toString('ascii');
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.json({ isSuccess: false, msg: "Get ERROR" });
    }
    else {
      console.log(user);
      user.token = registrationToken;
      user.save(function (err) {
        if (err) {
          return res.json({ isSuccess: false, msg: err.message })
        }
        return res.json({ isSuccess: true, msg: "token sent successfully" });
      });
    }
  })
});

setInterval(updateNonPickupMachineStatus, 60000);

function updateNonPickupMachineStatus() {
  //find out all the machines that is reserved ,but no body pick up
  Location.aggregate([
    { $addFields: { "location_id": { "$toString": "$_id" } } },
    {
      $lookup: {
        from: "machines",
        localField: "location_id",
        foreignField: "locationID",
        as: "machines"
      }
    }
  ], function (err, locations) {
    if (err) {
      console.log(err);
      return;
    }

    locations.forEach(location => {
      location.machines.filter(a => !a.isAvailable).forEach(machine => {
        let estimateTime = location.defaultRunningTime - helper.millisToMinutes(Date.now() - machine.startTime) + location.defaultPickupTime;
        if (estimateTime < 0) {
          Machine.findById(machine._id, function (err, m) {
            m.isPickedUp = false;
            m.save();
          })
        }
      });
    });
  })
}
app.use('/api', router);
app.use(express.static(path.join(__dirname, 'client', 'build')))
const API_PORT = process.env.port || 3001;
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
module.exports = app;