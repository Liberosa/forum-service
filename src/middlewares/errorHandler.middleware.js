const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    if (err.message && err.message.includes('not found')) {
        return res.status(404).json({
            status: 'Not found',
            code: 404,
            message: err.message,
            path: req.path
        });
    }

    if (err.message && err.message.includes('login already exists')) {
        return res.status(409).json({
            status: 'Conflict',
            code: 409,
            message: err.message,
            path: req.path
        });
    }

    return res.status(500).json({
        status: 'Internal server error',
        code: 500,
        message: err.message,
        path: req.path
    });
};

export default errorHandler;