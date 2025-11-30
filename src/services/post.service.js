import postRepository from "../repositories/post.repository.js";

class PostService {
    async createPost(author, data) {
        return await postRepository.createPost({...data, author});
    }

    async getPostById(id) {
        const post = await postRepository.findPostById(id);
        if (!post) {
            throw new Error(`Post with id=${id} not found`);
        }
        return post;
    }

    async addLike(postId) {
        const result = await postRepository.addLike(postId, {$inc: {likes: 1}});
        if (!result) {
            throw new Error(`Post with id=${postId} not found`);
        }
        return result;
    }

    async getPostsByAuthor(author) {
        return await postRepository.findPostsByAuthor(author);
    }

    async addComment(postId, commenter, message) {
        const comment = {
            user: commenter,
            message: message,
            dateCreated: new Date(),
            likes: 0
        };

        const post = await postRepository.addComment(postId, comment);
        if (!post) {
            throw new Error(`Post with id=${postId} not found`);
        }
        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.deletePost(postId);
        if (!post) {
            throw new Error(`Post with this ${postId} not found`);
        }
        return post;
    }

    async getPostsByTags(tagsString) {
        const tags = tagsString.split(',').map(tag => tag.trim());
        return await postRepository.findPostsByTags(tags);
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        return await postRepository.findPostsByPeriod(dateFrom, dateTo);
    }

    async updatePost(postId, data) {
        const post = await postRepository.updatePost(postId, data);
        if (!post) {
            throw new Error(`Post with id=${postId} not found`);
        }
        return post;
    }
}

export default new PostService();