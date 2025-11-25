import postModel from "../models/post.model.js";

export function createPost(author,post) {
   return postModel.create(author,post)
}
export function getPostById(postId){
    return postModel.findById(postId)
}
