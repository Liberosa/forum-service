import UserAccountService from '../services/userAccount.service.js';

class UserAccountController {
    async register(req, res, next) {
        try {
            const user = await UserAccountService.register(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await UserAccountService.getUser(req.params.user);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await UserAccountService.deleteUser(req.params.user)
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await UserAccountService.updateUser(req.params.user, req.body)
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async addRole(req, res, next) {
        try {
            const user = await UserAccountService.changeRoles(req.params.user, req.params.role, true)
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async deleteRole(req, res, next) {
        try {
            const user = await UserAccountService.changeRoles(req.params.user, req.params.role, false)
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

    async changePassword(req, res, next) {
        //do it later
    }

    async login(req, res, next) {
//do it later
    }


}

export default new UserAccountController();