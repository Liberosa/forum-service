import postService from "../services/post.service.js";

class Authorization {
    hasRole(role) {
        return (req, res, next) => {
            req.principal.roles.includes(role.toUpperCase().trim()) ? next() : res.status(403).send('Access denied');
        }
    }

    ifOwner(paramName) {
        return (req, res, next) => {
            req.params[paramName] === req.principal.username ? next() : res.status(403).send('Access denied');
        }
    }

    ifOwnerOrHasRole(paramName, role) {
        return (req, res, next) => {
            const isOwner = req.params[paramName] === req.principal.username;
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim());
            return isOwner || hasRole ? next() : res.status(403).send('Access denied');
        }
    }

    isPostAuthor(postIdParam) {
        return async (req, res, next) => {
            const postId = req.params[postIdParam];
            const post = await postService.getPostById(postId);
            return post.author === req.principal.username ? next() : res.status(403).send('Access denied');
        }
    }

    isPostAuthorOrHasRole(postIdParam, role) {
        return async (req, res, next) => {
            const postId = req.params[postIdParam];
            const post = await postService.getPostById(postId);
            const isOwner = post.author === req.principal.username;
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim());
            return isOwner || hasRole ? next() : res.status(403).send('Access denied');
        }
    }
}

export default new Authorization();