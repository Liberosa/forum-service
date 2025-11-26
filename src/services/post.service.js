import postRepository from "../repositories/post.repository.js";

class PostService {
    async createPost(author, data) {
        return await postRepository.createPost({...data, author});
    }

    async getPostById(id) {
        const post = await postRepository.findPostById(id);
        if (!post) {
            throw new Error('Post with this id not found');
        }
        return post;
    }

    async addLike(postID) {
        //TODO add like to post.
        throw new Error('Not implemented');
    }

    async getPostsByAuthor(author) {
        //TODO return all posts by author.
        throw new Error('Not implemented');
    }

    async addComment(postId, commenter, message) {
        //TODO add comment to post.
        throw new Error('Not implemented');
    }

    async deletePost(postId) {
     const post = await postRepository.deletePost(postId);
     if (!post) {
         throw new Error(`Post with this ${postId} not found`);
     }
     return post;
    }

    async getPostsByTags(tagsString) {
        //TODO return posts by tags.
        throw new Error('Not implemented');
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        //TODO return posts by period.
        throw new Error('Not implemented');
    }

    async updatePost(postId, data) {
        //TODO update post.
        throw new Error('Not implemented');
    }
}

export default new PostService();