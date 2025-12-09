import postRepository from "../repositories/post.repository.js";

export const checkPostOwner = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await postRepository.findPostById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        const username = req.principal.username;
        const userRoles = req.principal.roles || [];

        if (post.author === username || userRoles.includes('MODERATOR')) {
            return next();
        }

        return res.status(403).json({
            message: 'You can only modify your own posts'
        });
    } catch (error) {
        next(error);
    }
};

export const checkAuthorMatch = (req, res, next) => {
    const authorFromUrl = req.params.author;
    const loggedInUser = req.principal.username;

    if (authorFromUrl !== loggedInUser) {
        return res.status(403).json({
            message: 'Author parameter must match your username'
        });
    }

    next();
};

export const checkAccountOwner = (req, res, next) => {
    const targetUser = req.params.user;
    const loggedInUser = req.principal.username;
    const userRoles = req.principal.roles || [];

    if (userRoles.includes('ADMINISTRATOR') || targetUser === loggedInUser) {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied'
    });
};