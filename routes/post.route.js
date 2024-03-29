const router = require('express').Router();

// Validator
const {
  validCreate,
  validUpdate,
} = require('../reqValidator/validPost');

// import controllers
const {
  PostList,
  PostDetail,
  PostCreate,
  PostReport,
  PostUpdate,
  PostDelete,
  UserPosts
} = require('../controllers/post.controller');
const { RequireLogin, verifyotp } = require('../middlewares/authMiddleware');

// actual routes
router.get('/list', PostList);
router.get('/detail/:id', RequireLogin, PostDetail);
router.post('/create', validCreate,verifyotp, PostCreate);
router.post('/report/:id', RequireLogin, PostReport);

router.put('/update', validUpdate, RequireLogin, PostUpdate);
router.delete('/delete', RequireLogin, PostDelete);

router.get('/userposts', UserPosts)

module.exports = router;
