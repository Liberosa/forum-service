import express from 'express';
import postController from '../controllers/post.controller.js';
import validate from '../middlewares/validation.middleware.js';


const router = express.Router();

router.post('/post/:author',validate('createPost'), postController.createPost);
router.get('/post/:id', postController.getPostById);
router.delete('/post/:id', postController.deletePost);


export default router;