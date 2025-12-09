import UserAccount from "../models/userAccount.model.js";

const authentication = async (req, res, next) => {
    const publicEndpoints = [
        ['/account/register', 'POST'],
        ['/forum/posts', 'GET']
    ];

    const isPublic = publicEndpoints.some(([path, method]) =>
        req.path === path && req.method === method
    );

    if (isPublic) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({message: 'Authorization required'});
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = Buffer.from(token, 'base64').toString('ascii');
    const [login, password] = decodedToken.split(':');

    const userAccount = await UserAccount.findById(login);
    if (!userAccount || !(await userAccount.comparePassword(password))) {
        return res.status(401).json({message: 'Invalid login or password'});
    }

    req.headers.authorization = '';
    req.principal = {username: login, roles: userAccount.roles};

    return next();
};

export default authentication;