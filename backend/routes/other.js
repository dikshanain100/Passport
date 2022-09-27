const express = require("express");
const router = express.Router();



/**
 * Endpoint to get users' account balance. Uses AuthMiddleware, such that only authenticated users can fetch balance.
 */
router.get('/tryAPI', (req, res) => {
console.log('inside tryAPI')
    //const user = req.session.user;
  //console.log('user :: ', user)
  res.status(201).json({
    message: "tryAPI working fine"
  })
});





module.exports = router;