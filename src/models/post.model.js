import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim: true},
        content: {type: String, required: true, trim: true},
        author: {type: String, required: true, trim: true},
        dateCreated: {type: Date, default: Date.now},
        tags: {type: [String], default: [], trim: true},
        likes: {type: Number, default: 0, min: 0},
        comments: {type: [String], default: [], trim: true}//пока так,но дальше будет ссылка на схему для комментариев,как я понимаю.
    }, {
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

const post = mongoose.model('Post', postSchema, 'posts');
export default post;