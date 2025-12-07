import UserAccount from "../models/user.model.js";

class UserAccountRepository {
    async createUser(userData) {
        const user = new UserAccount(userData);
        return user.save();
    }

    async findUserByLogin(login) {
        return UserAccount.findById(login);
    }

    async deleteUser(login) {
        return UserAccount.findByIdAndDelete(login);
    }

    async updateUser(login, updateData) {
        return UserAccount.findByIdAndUpdate(
            login,
            updateData,
            {new: true}
        );
    }

    async addRole(login, role) {
        return UserAccount.findByIdAndUpdate(
            login,
            {$addToSet: {roles: role}},
            {new: true}
        );
    }

    async removeRole(login, role) {
        return UserAccount.findByIdAndUpdate(
            login,
            {$pull: {roles: role}},
            {new: true}
        );
    }

    async ChangePassword(login, password) {
        const user = await UserAccount.findById(login);
        if(user){
            user.password = password;
            return await user.save();
        }
    }
}

export default new UserAccountRepository();