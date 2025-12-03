import userAccountRepository from "../repositories/userAccount.repository.js";

class UserAccountService {
    async register(user) {
        try {
            return await userAccountRepository.createUser(user);
        } catch (e) {
            throw new Error('User with this login already exists');
        }
    }

    async getUser(login) {
        const user = await userAccountRepository.findUserByLogin(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`);
        }
        return user;
    }

    async deleteUser(login) {
        const user = await userAccountRepository.deleteUser(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`);
        }
        return user;
    }

    async updateUser(login, userData) {
        return await userAccountRepository.updateUser(login, userData);
    }

    async changeRoles(login, role, isAddRole) {
        role = role.toUpperCase();
        let userAccount;
        if (isAddRole) {
            userAccount = await userAccountRepository.addRole(login, role);
        } else {
            userAccount = await userAccountRepository.removeRole(login, role);
        }
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        const {roles, userName = login} = userAccount;
        return {roles, login: userName};
    }

    async changePassword(login, newPassword) {
    }
}

export default new UserAccountService();