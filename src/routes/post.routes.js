import express from 'express';
import postController from '../controllers/post.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { checkPostOwner, checkAuthorMatch } from '../middlewares/ownerCheck.middleware.js';
import authorize from "../middlewares/authorization.middleware.js";
import {ADMIN, MODERATOR, USER} from "../config/constants.js";

const router = express.Router();

router.post('/post/:author', validate('createPost'),checkAuthorMatch, postController.createPost);
router.get('/post/:id', postController.getPostById);
router.delete('/post/:id',checkPostOwner, postController.deletePost);
router.patch('/post/:id/like', postController.addLike);
router.get('/posts/author/:author', postController.getPostsByAuthor);
router.patch('/post/:id/comment/:commenter',authorize(USER,MODERATOR,ADMIN),validate('addComment'),postController.addComment);
router.get('/posts/tags', postController.getPostsByTags);
router.get('/posts/period',validate('dateFormat','query'), postController.getPostsByPeriod);
router.patch('/post/:id',validate('updatePost'),checkPostOwner,postController.updatePost);


export default router;