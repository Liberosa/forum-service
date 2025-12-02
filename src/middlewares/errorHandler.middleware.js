const errorHandler = (error, req, res, _next) => {
    console.log(error.stack);
    const contains = error.message.includes('not found');
    if (error.statusCode === 409) {
        return res.status(409).send();
    }
    if (error.statusCode === 400) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: error.message,
            path: req.path
        });
    }
    if (error.message && contains) {
        return res.status(404).json(
            {
                status: 'Not found',
                code: 404,
                message: error.message,
                path: req.path
            });
    }
    return res.status(500).json({
        status: 'Internal server error',
        code: 500,
        message: error.message,
        path: req.path
    });
};

export default errorHandler;