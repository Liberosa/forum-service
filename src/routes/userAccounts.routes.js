import express from 'express';
import UserAccountController from '../controllers/userAccount.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { checkAccountOwner } from '../middlewares/ownerCheck.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';
import {ADMIN} from "../config/constants.js";

const router = express.Router();

router.post('/register', validate('register'), UserAccountController.register);
router.post('/login', UserAccountController.login);
router.delete('/user/:user',checkAccountOwner, UserAccountController.deleteUser);
router.patch('/user/:user', validate('updateUser'), UserAccountController.updateUser);
router.patch('/user/:user/role/:role',authorize(ADMIN),validate('changeRoles'), UserAccountController.addRole);
router.delete('/user/:user/role/:role', authorize(ADMIN),validate('changeRoles'),UserAccountController.deleteRole);
router.patch('/password', UserAccountController.changePassword);
router.get('/user/:user', UserAccountController.getUser);


export default router;


