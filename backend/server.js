const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const host = process.env.host || 'localhost'; //newly added
const port = process.env.PORT || 8080;
const item = require("./routes/item");
const other = require("./routes/other");
const database = require("./database/connection");
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session); // to store session info in MongoDB
const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;
const UserModel = require("./models/user");
const bcrypt = require("bcryptjs");

const initializePassport = require('./passport/passport-config')
initializePassport(
  passport,
  async email => {
    let email1 = await UserModel.findOne({ email: email });
    console.log('email1 :: ', email1);
    return email1;
  }

)

const users = [
  {
    email: 'passport3@gmail.com',
    password: '$2a$12$1mHfdnwhEVb2ckGnSSTo5.L6jE2Mkw21h254j8sEthanSMkoFkwK6'
  }
]


//database connection
mongoose.connect(
  database.connection, {
  //these properties remove some mongoose deprecated warnings
  //refer :https://mongoosejs.com/docs/5.x/docs/deprecations.html
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(connection => {
    console.log("connection established")
  })
  .catch(error => {
    console.log(database);
    console.log({
      error: {
        name: error.name,
        message: error.message,
        errorCode: error.code,
        codeName: error.codeName
      }
    })
  });



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Setting up CORS, such that it can work together with an Application at another domain / port
 */
app.use(
  cors({
    origin: ["http://localhost:4200"],
    credentials: true
  }));


//store session created in mong db 
const userStore = new MongoDBSession({
  uri: database.connection,
  collection: 'user_session'
})

//create session
app.use(session({
  secret: 'secret',
  resave: false,  //'true' means for every req to server, we want to create a new session and 
  //we don't want to care about if it's a same user/browser
  saveUninitialized: false, //if we have not touched or modified the session, we don't want it to be saved.
  store: userStore,
  cookie: {
    maxAge: 1000 * 60, //1 min expiry 
    secure: false,
    httpOnly: false,
  }
}))




app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


app.use(passport.initialize());
app.use(passport.session());

//////////////////////////////END of middlelayer/////////////////////////////////////////////////////////////

// app.use("/", item);
// app.use("/other/", other);




///////////////////////////////////////try code////////////////////////////////////////////////////////////
//routes
// app.get('/', checkAuthenticated, (req, res) => {
//   res.render('index.ejs', { name: req.user.name })
// })


app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("userss: ", req.user);

  //response in case of success
  res.status(200).send({
    message: "Matched.",
    error: false,
    passwordMismatch: false
  })

  //in case of error : get's response is send in error block in UI 

  // For this to work UI and backend should be on same domain
  // successRedirect: 'http://localhost:4200/landing',
  // failureRedirect: 'http://localhost:4200/login',
  // failureFlash: true
})


app.post('/register', async (req, res) => {
  const { custUsername, custEmail, custPassword } = req.body;
  try {
    let user = await UserModel.findOne({ custEmail });
    //check this
    if (user) {
      return res.status(200).json({
        message: "User exist",
        userExist: true,
      })
    }

    const hashedPwd = await bcrypt.hash(custPassword, 12);
    let userData = new UserModel({
      username: custUsername,
      email: custEmail,
      password: hashedPwd
    });

    userData.save((err) => {
      if (err) {
        return res.status(400).json({
          message: "The user data was not saved",
          userExist: true,
          errorMessage: err.message
        })
      } else {
        return res.status(200).json({
          message: "User data was saved successfully",
          userExist: false,
        })
      }
    })
  } catch (err) {
    console.log('catch ', err)
    // res.redirect('/register')
    return res.status(400).json({
      message: "The user data was not saved",
      userExist: false,
      errorMessage: err.message
    })
  }

})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('is autheticated :: ')
    return res.redirect('/')
  }
  next()
}


///////////////////////////////////////try code////////////////////////////////////////////////////////////

// These middlelayer will run if there is not route match...If you put them before calling route; these will run first and give error everytime
// Error message is send if router doesn't exist
app.use((req, res, next) => {
  const error = new Error("Unable to manage the request");
  //send a status code error
  error.status = 404;
  //forward the request with the error
  next(error);
})

//error message 
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    "error": {
      "message": error.message
    }
  })
});

//create the server
app.listen(port, () => {
  console.log("Server is running @host :: ", host, ' and port :  ', port);
});


