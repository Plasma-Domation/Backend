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
  checkSession,
} = require('../controllers/auth.controller');
const { RequireLogin, verifyotp } = require('../middlewares/authMiddleware');

// actual routes
router.post('/sendotp', validSendOTP, sendOTP);
router.post('/signup', validSign, verifyotp, signUp);
router.post('/login', validLogin, verifyotp, login_post);
router.delete('/logout', RequireLogin, logout_delete);
router.get('/checksession', checkSession);
module.exports = router;
