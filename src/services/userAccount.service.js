import userAccountRepository from "../repositories/userAccount.repository.js";

class UserAccountService {
    async register(user) {
        const existingUser = await userAccountRepository.findUserByLogin(user.login);
        if (existingUser) {
            const error = new Error(`User with login ${user.login} already exists`);
            error.statusCode = 409;
            throw error;
        }
        return await userAccountRepository.createUser({
            ...user,
            roles: ['USER']
        });
    }

    async getUser(login) {
        const user = await userAccountRepository.findUserByLogin(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`);
        }
        return user;
    }

    async removeUser(login) {
        const user = await userAccountRepository.deleteUser(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`);
        }
        return user;
    }

    async updateUser(login, userData) {
        console.log('UPDATE USER - login:', login); // <- добавь эту строку
        console.log('UPDATE USER - userData:', userData); // <- и эту

        // Проверяем существование пользователя
        const existingUser = await userAccountRepository.findUserByLogin(login);
        console.log('FOUND USER:', existingUser); // <- и эту
        if (!existingUser) {
            throw new Error(`User with login ${login} not found`);
        }
        const allowedUpdates = {};
        if (userData.firstName) allowedUpdates.firstName = userData.firstName;
        if (userData.lastName) allowedUpdates.lastName = userData.lastName;

        return await userAccountRepository.updateUser(login, allowedUpdates);
    }

    async changeRoles(login, role, isAddRole) {
        const user = await userAccountRepository.findUserByLogin(login);
        if (!user) {
            throw new Error(`User with login ${login} not found`);
        }
        const validRoles = ['USER', 'MODERATOR', 'ADMIN'];
        const upperRole = role.toUpperCase();
        if (!validRoles.includes(upperRole)) {
            const error = new Error(`Invalid role: ${role}. Valid roles: ${validRoles.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }

        if (isAddRole) {
            return await userAccountRepository.addRole(login, upperRole);
        } else {
            if (user.roles.length === 1 && user.roles.includes(upperRole)) {
                const error = new Error(`Cannot remove last role from user ${login}`);
                error.statusCode = 400;
                throw error;
            }
            return await userAccountRepository.removeRole(login, upperRole);
        }
    }

    async changePassword(login, newPassword) {
    }
}

export default new UserAccountService();