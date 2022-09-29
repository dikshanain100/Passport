const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs"); 
const session = require('express-session');

function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password1, done) => { //email is received from line 27 , whereas password is authomatically fetched from req
    const user = await getUserByEmail(email)
    if (user == null) {
      console.log('null')
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password1, user.password)) {
        console.log('password good')
        return done(null, user)
      } else {
        console.log('password not good')
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      console.log('got error :: ', e);
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) //email is automatically fetched from req
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => {
    return done(null, user)
  })


}

module.exports = initialize