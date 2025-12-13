import express,{Router} from "express";
import mongoose from "mongoose";
import config from "./config/config.js";
import postRoutes from "./routes/post.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/userAccounts.routes.js";
import authenticationMiddleware from "./middlewares/authentication.middleware.js";
import {createAdmin} from "./config/initAdmin.js";
import authorization from "./middlewares/authorization.middleware.js";
import {ADMIN,MODERATOR} from "./config/constants.js";

const app = express();
const authRouter = Router();

app.use(express.json());
app.use(authenticationMiddleware);
authRouter.all('/account/user/:login/role/:role', authorization.hasRole(ADMIN));
authRouter.patch(['/account/user/:login', '/forum/post/:id/comment/:login'], authorization.ifOwner('login'));
authRouter.delete('/account/user/:login', authorization.ifOwnerOrHasRole('login', ADMIN));
authRouter.post('/forum/post/:author', authorization.ifOwner('author'));
authRouter.delete('/forum/post/:id', authorization.isPostAuthorOrHasRole('id', MODERATOR));
authRouter.patch('/forum/post/:id', authorization.isPostAuthor('id'));

app.use(authRouter);


app.use('/forum', postRoutes);
app.use('/account', userRoutes);

app.use(errorHandler);


const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db);
        await createAdmin();
        console.log('MongoDB connected');
    } catch (error) {
        console.log('MongoDB connection error', error);
    }
};

const startServer = async () => {
    await connectDB();
    app.listen(config.port, () =>
        console.log(`Server started on port ${config.port}.Press Ctrl+C to stop`));
};

startServer().then(console.log('Shalom'));