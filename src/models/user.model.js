import {model, Schema} from "mongoose";
import bcrypt from 'bcrypt';
import {USER} from "../config/constants.js";

const userAccountSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
            alias: 'login',
            trim: true,
            minlength: 3,
            maxlength: 20
        },
        password: {
            type: String,
            required: true,
            minlength: 4
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        roles: {
            type: [String],
            default: [USER]
        }
    },
    {
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                ret.login = ret._id;
                delete ret.password;
                delete ret._id;
            }
        }
    }
);

userAccountSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

export default model('UserAccount', userAccountSchema, 'userAccounts');