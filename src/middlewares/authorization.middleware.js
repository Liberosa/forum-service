const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.principal) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        const userRoles = req.principal.roles || [];
        const hasRole = allowedRoles.some(role =>
            userRoles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

export default authorize;