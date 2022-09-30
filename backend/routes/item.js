const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");  //so that passwords are not recognized or changed by anyone
const passport = require("passport");
const initializePassport = require('../passport/passport-config')


initializePassport(
  passport,
  async userByEmail => {
    let user = await UserModel.findOne({ email: userByEmail });
    return user;
  })



/**
 * Simple session example from tutorials point, unrelated to rest of the application.
 * This creates cookie in browser : port 8080
 * test on 2 diff browsers to check if session is created
 * cookie is managed by express-session in the background
 */
router.get('/', function (req, res) {
  console.log('req :: ', req)
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1; //setting some cookie
    res.send("Welcome to this page for the first time!");
  }
});


/**
 * Middleware to check that a payload is present
 */
const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};




/**
 * Log the user in.
 * User needs to provide pw and email, this is then compared to the pw in the "database"
 * If pw and email match, the user is fetched and stored into the session.  <-- Done by passport lib
 * Finally the user is returned from the request.
 */
router.post('/login', validatePayloadMiddleware, passport.authenticate('local'), (req, res) => {

  //response in case of success 

  //// Separate session is not required here as we will be using passport session which internally uses express-session
  // let userWithoutPassword = {};
  // userWithoutPassword.email = req.user.email;
  // userWithoutPassword.username = req.user.username;
  // req.session.user = userWithoutPassword;

  console.log('req.authInfo  :: ', req.authInfo.message);
  if (req.authInfo.message == 'Password incorrect') {
    res.clearCookie('connect.sid');
    req.session.destroy();
    res.status(200).send({
      message: req.authInfo.message,
      error: false,
      passwordMismatch: true
    })
  }
  else if (req.authInfo.message == 'No user with that email') {
    res.clearCookie('connect.sid');
    req.session.destroy();
    res.status(200).send({
      message: req.authInfo.message,
      error: false,
      passwordMismatch: true
    })
    
  }
  else {
    res.status(200).send({
      message: "Matched.",
      error: false,
      passwordMismatch: false
    })
  }



  //// For this to work UI and backend should be on same domain  :::
  // successRedirect: 'http://localhost:4200/landing',
  // failureRedirect: 'http://localhost:4200/login',
  // failureFlash: true
})




/**
  * Check if user is logged in. >>should not use credentials again 
  * This projectdoesn't require this part as , redirections are handled at frontend only using Auth Guard class
  */
// router.get('/login', (req, res) => {
// console.log('inside login get');
//   if (req.isAuthenticated()) {   //function present in passport lib 
//     res.status(200).send({ loggedIn: 'true' })
//   }
//   else {
//     res.status(200).send({ loggedIn: 'false' });
//   }

// });

/**
 * Log the user out of the application.
 */
router.post('/logout', (req, res) => {
  // req.logOut(); //passport session and all other session 
  res.clearCookie('connect.sid');
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Could not log out.');
    } else {
      res.status(200).send({});
    }
  });
});


/**
 * Checks if user is logged in, by checking if user is stored in session.
 * In actual scenario it can be checked via checking session id in Mongo DB
 */
// const authMiddleware = (req, res, next) => {
//   if (req.session && req.session.passport.user) {
//     console.log('req.session ::  ', req.session)
//     console.log('req.session.passport.user ::  ', req.session.passport.user)
//     next();
//   } else {
//     res.status(403).send({
//       errorMessage: 'You must be logged in.'
//     });
//   }
// };


/* Check if user is Authenticated 
* Don't need self craeted auth Middleware then 
*/
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {   //function present in passport lib 
    console.log('authentic user')
    return next()
  }
  else {
    console.log('not authenticated')
    res.status(403).send({
      errorMessage: 'You must be logged in.'
    });
  }
}



router.get("/landing", checkAuthenticated, (req, res) => {
  console.log('inside landing ', req)
})


//need to check session first 
router.post("/register", async (req, res) => {
  const { custUsername, custEmail, custPassword } = req.body;
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
})




/**
 * Some hardcoded values of account balances of users and method to fetch the balance.
 */
const accountBalances = {
  'max@gmail.com': 53762,
  'lily@gmail.com': 4826
};
const getBalance = (email) => {
  return accountBalances[email];
};


/**
 * Endpoint to get users' account balance. Uses AuthMiddleware, such that only authenticated users can fetch balance.
 * We shouldn't use req.session to validate if authentic user is accesisng the API; 
 * instead use token 
 */
router.get('/balance', checkAuthenticated, (req, res) => {
  //const user = req.session.user; Not required, as will fetch value from passport session
  console.log('session id inside balance :: ', req.session.id)
  const balance = getBalance(req.session.passport.user.email);
  if (balance) {
    res.status(200).send({
      balance: balance
    })
  } else {
    res.status(403).send({
      errorMessage: 'Access Denied.'
    });
  }
});





module.exports = router;