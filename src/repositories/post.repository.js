import Post from "../models/post.model.js";

class PostRepository {
    async createPost(postData) {
        const post = new Post(postData);
        return post.save();
    }

    async findPostById(id) {
        return Post.findById(id)
    }

    async deletePost(id) {
        return Post.findByIdAndDelete(id);
    }

    async addLike(id, updateData) {
        return Post.findByIdAndUpdate(id, updateData);
    }

    async findPostsByAuthor(author) {
        return Post.find({author: author});
    }
    async addComment(postId, comment) {
        return Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } },
            { new: true }
        );
    }
    async findPostsByTags(tags) {
        return Post.find({ tags: { $in: tags } });
    }
    async findPostsByPeriod(dateFrom, dateTo) {
        return Post.find({
            dateCreated: {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            }
        });
    }
    async updatePost(id, updateData) {
        return Post.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export default new PostRepository();