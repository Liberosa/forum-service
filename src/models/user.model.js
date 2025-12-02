import {model, Schema, Types} from "mongoose";

const userAccountSchema = new Schema(
    {
        _id: { type: String, default: () => new Types.ObjectId().toHexString()},
        login: {
            type: String,
            required: true,
            unique: true,
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
            default: ['USER'],
            enum: ['USER', 'MODERATOR', 'ADMIN']
        }
    },
    {
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret._id;
            }
        }
    }
);

export default model('UserAccount', userAccountSchema, 'userAccounts');