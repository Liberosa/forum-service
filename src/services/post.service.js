import {getPostById} from "../repositories/post.repository.js";
import * as repo from "../repositories/post.repository.js";

class PostService {
    async createPost(author, data) {
        if (await repo.getPostById(data._id)) {
            throw new Error('Post with this id already exists');
        }
        return await repo.createPost({...data,author});
    }
    async getPostById(id){
        const post = await getPostById(id);
     if(post){
         return post;
     }
     throw new Error('Post with this id not found');
    }
    async addLike(postID){
        //TODO add like to post.
        throw new Error('Not implemented');
    }
    async getPostsByAuthor(author){
        //TODO return all posts by author.
        throw new Error('Not implemented');
    }
    async addComment(postId,commenter,message){
        //TODO add comment to post.
        throw new Error('Not implemented');
    }
    async deletePost(postId){
        //TODO delete post.
        throw new Error('Not implemented');
    }
    async getPostsByTags(tagsString){
        //TODO return posts by tags.
        throw new Error('Not implemented');
    }
    async getPostsByPeriod(dateFrom,dateTo){
        //TODO return posts by period.
        throw new Error('Not implemented');
    }
    async updatePost(postId,data){
        //TODO update post.
        throw new Error('Not implemented');
    }
}
export default new PostService();