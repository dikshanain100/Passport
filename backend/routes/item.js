const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const Mongoose = require("mongoose");
const https = require('https');
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");  //so that passwords are not recognized or changed by anyone
const other = require("./other")




router.get("/todos", (req, res, next) => {
  //return all items
  const todos = TodoModel.find({}, (err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        data: todos
      });
    }
  })
});

//add an item
router.post("/todos", (req, res, next) => {
  let newtodo = new TodoModel({
    _id: new Mongoose.Types.ObjectId(),
    title: req.body["title"],
    content: req.body["content"]
  });

  newtodo.save((err) => {
    if (err) {
      res.status(400).json({
        message: "The Todo data was not saved",
        errorMessage: err.message
      })
    } else {
      res.status(201).json({
        message: "Todo data was saved successfully"
      })
    }
  })

});


router.post("/bulk", (req, res, next) => {
  TodoModel.insertMany(req.body, (err, docs) => {
    if (err) {
      res.status(400).json({
        message: "The Todos were not saved",
        errorMessage: err.message
      })
    } else {
      res.status(200).json({
        message: "Bulk document creation successful",

      })
    }
  })

})

// delete an item
router.delete("/todo/:id", (req, res, next) => {
  let id = req.body._id;
  TodoModel.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.status(404).json({
        message: "Item was not found",
      });
    } else {
      res.status(200).json({
        message: "Item was deleted successfully",
      });
    }
  })

});


router.delete("/bulkDelete", (req, res, next) => {
  TodoModel.deleteMany({ _id: { $in: req.body } }, (err, response) => {
    if (err) {
      res.status(404).json({
        message: "todos not found",
      });
    } else {
      res.status(200).json({
        message: response,
      });
    }
  })
})


router.get("/entries", (req, res, next) => {
  https.get('https://api.publicapis.org/entries', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.status(200).send(data)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  })


});



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
 * Some hardcoded users to make the demo work
 */
// const appUsers = {
//   'max@gmail.com': {
//     email: 'max@gmail.com',
//     name: 'Max Miller',
//     pw: '1234' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
//   },
//   'lily@gmail.com': {
//     email: 'lily@gmail.com',
//     name: 'Lily Walter',
//     pw: '1235' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
//   }
// };



/**
 * Log the user in.
 * User needs to provide pw and email, this is then compared to the pw in the "database"
 * If pw and email match, the user is fetched and stored into the session.
 * Finally the user is returned from the request.
 */
router.post('/login', validatePayloadMiddleware, (req, res) => {
  const custEmail = req.body.email;
  const custPassword = req.body.password;
  console.log('req.body :: ', req.body);
  UserModel.findOne({ email: custEmail }, async (err, user) => {
    if (err) {
      res.status(200).send({
        message: "Error in backend API",
        error: true
      })
    } else {
      console.log('user :: ', user)
      if (!user || user == null) {
        res.status(200).send({
          message: "Couldn't find user details",
          error: false
        })
      }
      else {
        console.log('user from mongo db  ::', user)
        const isMatch = await bcrypt.compare(custPassword, user.password)
        if (!isMatch) {
          res.status(200).send({
            message: "Password mismatch. Please try again",
            error: false,
            passwordMismatch: true
          })
        }
        else {

          let userWithoutPassword = {};
          userWithoutPassword.email = user.email;
          userWithoutPassword.username = user.username;
          req.session.user = userWithoutPassword;
          // req.session.save();
          console.log('session id inside login :: ', req.session.id)
          res.status(200).send({
            message: "Matched.",
            error: false,
            passwordMismatch: false
          })

        }
      }
    }

  })

});



/**
 * Check if user is logged in.
 */
router.get('/login', (req, res) => {
  console.log('inside get -- login ', req.session.id)
  req.session.user ? res.status(200).send({ loggedIn: 'true' }) : res.status(200).send({ loggedIn: 'false' });
});

/**
 * Log the user out of the application.
 */
router.post('/logout', (req, res) => {
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
 * In actual scenario it canbe checked via checking session id in Mongo DB
 */
const authMiddleware = (req, res, next) => {
  //console.log('aut middlelayer :: ', req.session);
  console.log('session id:: authMiddleware :: ', req.session.id)
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You must be logged in.'
    });
  }
};


/* Check if session is valid */



router.get("/landing", authMiddleware, (req, res) => {
  console.log('inside landing :: ', req.body)
  //return  res

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
 */
router.get('/balance', authMiddleware, (req, res) => {
  const user = req.session.user;
  console.log('user :: ', user)
  const balance = getBalance(user.email);
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