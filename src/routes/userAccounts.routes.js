import express from 'express';
import UserAccountController from '../controllers/userAccount.controller.js';
import validate from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/register', validate('register'), UserAccountController.register);
router.post('/login', UserAccountController.login);
router.delete('/user/:user', UserAccountController.deleteUser);
router.patch('/user/:user', validate('updateUser'), UserAccountController.updateUser);
router.patch('/user/:user/role/:role',validate('changeRoles'), UserAccountController.addRole);
router.delete('/user/:user/role/:role', validate('changeRoles'),UserAccountController.deleteRole);
router.patch('/password', UserAccountController.changePassword);
router.get('/user/:user', UserAccountController.getUser);


export default router;


