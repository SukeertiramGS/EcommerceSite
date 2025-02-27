module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    if (process.env.NODE_ENV === 'production') {
        let message = err.message;

        // ✅ Fix: Properly handle CastError
        if (err.name === 'CastError') {
            message = `Invalid ${err.path}: ${err.value}. Resource not found.`;
            err = new Error(message);
            err.statusCode = 400;
        }

        if (err.name === 'ValidationError') {
            message = Object.values(err.errors).map((value) => value.message).join(', ');
            err = new Error(message);
            err.statusCode = 400;
        }
//haven,t yet covered
        if (err.code === 11000) {
            message = `Duplicate ${Object.keys(err.keyValue)} error`;
            err = new Error(message);
            err.statusCode = 400;
        }

        if (err.name === 'JSONWebTokenError') {
            message = `JSON Web Token is invalid. Try again`;
            err = new Error(message);
            err.statusCode = 400;
        }

        if (err.name === 'TokenExpiredError') {
            message = `JSON Web Token is expired. Try again`;
            err = new Error(message);
            err.statusCode = 400;
        }

        res.status(err.statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    }
};
