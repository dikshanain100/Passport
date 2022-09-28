const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs"); 
const session = require('express-session');

function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email)
    console.log('user inside initialize :: ', user);
    if (user == null) {
      console.log('null')
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log('password good')

        let userWithoutPassword = {};
        userWithoutPassword.email = user.email;
        userWithoutPassword.username = user.username;
        // session.user = userWithoutPassword;
        // console.log('session id inside login :: ', session.id)
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

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.email))
  passport.deserializeUser((email, done) => {
    return done(null, getUserByEmail(email))
  })
}

module.exports = initialize