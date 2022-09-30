const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs");


function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password1, done) => { //email is received from line 27 , whereas password is authomatically fetched from req
    const user = await getUserByEmail(email)
    if (user == null) {
      console.log('user is not present')
      //if use this , then res is not send back to lgin route
      // return done(null, false, { message: 'No user with that email' })
      //this helps in sending response back to login api ..
      //only issue is that it will set cookie in browser even if person hasn't logged in
      //and this issue is resolved in login router by clearing session at that time 
      return done(null, email, { message: 'No user with that email' })

    }

    try {
      if (await bcrypt.compare(password1, user.password)) {
        console.log('password good')
        return done(null, user)  //this goes back to login otheriwse default is returned to frontend with status code 401
      } else {
        console.log('password not good')
        // return done(null, false, { message: 'Password incorrect' })
        return done(null, email, { message: 'Password incorrect' })
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