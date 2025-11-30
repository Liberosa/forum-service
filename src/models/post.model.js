import {model, Schema, Types} from "mongoose";
import commentSchema from "./comment.model.js";

const postSchema = new Schema(
    {
        _id: { type: String, default: () => new Types.ObjectId().toHexString()},
        title: {type: String, required: true, trim: true},
        content: {type: String, required: true, trim: true},
        author: {type: String, required: true, trim: true},
        dateCreated: {type: Date, default: Date.now},
        tags: {type: [String], default: [], trim: true},
        likes: {type: Number, default: 0, min: 0},
        comments: {type: [commentSchema], default: [], trim: true}
    }, {
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                ret.dateCreated = ret.dateCreated.toISOString().slice(0, 19);
            }
        }
    });

export default model('Post', postSchema, 'posts');