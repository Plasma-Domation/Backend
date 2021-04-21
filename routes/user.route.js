const router = require('express').Router();


// Validator
const {
  validUserUpdate
} = require('../reqValidator/validUser');




// import controllers
const {
  userDetail,
  userUpdate,
  userDelete,
} = require('../controllers/user.controller');
const { RequireLogin } = require('../middlewares/authMiddleware');

// actual routes
router.get('/detail/:id', RequireLogin, userDetail);
router.put('/update',validUserUpdate, RequireLogin, userUpdate);
router.delete('/delete', RequireLogin, userDelete);

module.exports = router;
