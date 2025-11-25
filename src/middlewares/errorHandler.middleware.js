// src/middlewares/error.middleware.js

const errorHandler = (error, req, res, _next) => {
    console.error('Error:', error.message);

    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Обработка ошибки Mongoose CastError (невалидный ID)
    if (error.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
    }

    // Обработка ошибки Mongoose ValidationError
    if (error.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(error.errors).map(err => err.message);
        message = `Validation failed: ${errors.join(', ')}`;
    }

    // Обработка дубликата (код 11000 от MongoDB)
    if (error.code === 11000) {
        statusCode = 409;
        const field = Object.keys(error.keyPattern || {})[0];
        message = `Duplicate value for field: ${field}`;
    }

    return res.status(statusCode).json({
        status: statusCode >= 500 ? 'error' : 'fail',
        code: statusCode,
        message: message,
        path: req.path
    });
};

export default errorHandler;