const router = require('express').Router();

// Request validator
const {
  validSign,
  validLogin,
  validSendOTP,
} = require('../reqValidator/validAuth');

// import controllers
const {
  sendOTP,
  signUp,
  login_post,
  logout_delete,
} = require('../controllers/auth.controller');
const { RequireLogin, verifyotp } = require('../middlewares/authMiddleware');

// actual routes
router.post('/sendotp', validSendOTP, sendOTP);
router.post('/create', validSign, verifyotp, signUp);
router.post('/login', validLogin, verifyotp, login_post);
router.delete('/logout', RequireLogin, logout_delete);

module.exports = router;
