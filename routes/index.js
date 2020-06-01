const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authcontroller = require('../controllers/authcontroller');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/add', authcontroller.isLoggedIn ,storeController.addStore);
router.post('/add',
  authcontroller.isLoggedIn,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/stores/:id/edit',
  authcontroller.isLoggedIn,
  catchErrors(storeController.editStore)
);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authcontroller.login);

router.get('/register', userController.registerForm);
router.post('/register',
  userController.preValidateRegister,
  userController.validateRegister,
  userController.register,
  authcontroller.login
);

router.get('/logout', authcontroller.logout);

router.get('/account',
  authcontroller.isLoggedIn,
  userController.account
);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authcontroller.forgot));
router.get('/account/reset/:token', catchErrors(authcontroller.reset));
router.post('/account/reset/:token',
  authcontroller.confirmedPassword,
  catchErrors(authcontroller.update)
);

/*
  API endpoint
*/

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));

module.exports = router;
