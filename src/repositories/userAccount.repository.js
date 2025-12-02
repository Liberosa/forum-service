import UserAccount from "../models/user.model.js";

class UserAccountRepository {
    async createUser(userData) {
        const user = new UserAccount(userData);
        return user.save();
    }

    async findUserByLogin(login) {
        return UserAccount.findOne({ login: new RegExp(`^${login}$`, 'i') });
    }

    async deleteUser(login) {
        return UserAccount.findOneAndDelete({ login: new RegExp(`^${login}$`, 'i') });
    }

    async updateUser(login, updateData) {
        return UserAccount.findOneAndUpdate(
            { login: new RegExp(`^${login}$`, 'i') },
            updateData,
            { new: true }
        );
    }

    async addRole(login, role) {
        return UserAccount.findOneAndUpdate(
            { login: new RegExp(`^${login}$`, 'i') },
            { $addToSet: { roles: role.toUpperCase() } },
            { new: true }
        );
    }

    async removeRole(login, role) {
        return UserAccount.findOneAndUpdate(
            { login: new RegExp(`^${login}$`, 'i') },
            { $pull: { roles: role.toUpperCase() } },
            { new: true }
        );
    }
}

export default new UserAccountRepository();