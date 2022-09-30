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
    httpOnly: true,
    path : '/'
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

app.use("/", item);
app.use("/other/", other);



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


