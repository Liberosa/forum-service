import PostService from "../services/post.service.js";

class PostController {
    async createPost(req, res, next) {
        try {
            const post = await PostService.createPost(req.params.author, req.body);
            return res.status(201).json(post);
        } catch (error) {
            return next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await PostService.getPostById(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }

    async deletePost(req, res, next) {
        try {
            const post = await PostService.deletePost(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }

    async addLike(req, res, next) {
        try {
            await PostService.addLike(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }

    async getPostsByAuthor(req, res, next) {
        try {
            const posts = await PostService.getPostsByAuthor(req.params.author);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }

    async addComment(req, res, next) {
        try {
            const post = await PostService.addComment(
                req.params.id,
                req.params.commenter,
                req.body.message
            );
            return res.status(200).json(post);
        } catch (error) {
            return next(error);
        }
    }
    async getPostsByTags(req, res, next) {
        let values;
        if (Array.isArray(req.query.values)) {
            values = req.query.values.reduce((acc, item) => acc + ',' + item);
        } else {
            values = req.query.values;
        }
        try {
            const posts = await PostService.getPostsByTags(values);
            return res.json(posts);
        } catch (err) {
            return next(err);
        }
    }
    async getPostsByPeriod(req, res, next) {
        try {
            const posts = await PostService.getPostsByPeriod(
                req.query.dateFrom,
                req.query.dateTo
            );
            return res.status(200).json(posts);
        } catch (error) {
            return next(error);
        }
    }
    async updatePost(req, res, next) {
        try {
            const post = await PostService.updatePost(req.params.id, req.body);
            return res.status(200).json(post);
        } catch (error) {
            return next(error);
        }
    }
}

export default new PostController();