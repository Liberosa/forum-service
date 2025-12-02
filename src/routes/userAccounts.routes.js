import express from 'express';
import UserAccountController from '../controllers/userAccount.controller.js';
import validate from '../middlewares/validation.middleware.js';
import userAccountService from "../services/userAccount.service.js";
import {route} from "express/lib/application.js";

const router = express.Router();

router.post('/register',UserAccountController.register);
router.post('/login',UserAccountController.getUser);
router.delete('/user/:user',UserAccountController.removeUser);
router.patch('/user/:user',UserAccountController.updateUser);
router.patch('/user/:user/role/:role',UserAccountController.addRole);
router.delete('/user/:user/role/:role',UserAccountController.deleteRole);
router.patch('/password',UserAccountController.changePassword);
router.get('/user/:user',UserAccountController.getUser);









export default router;


