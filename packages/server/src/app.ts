import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express'; // koa@2
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolvers';
import { customAuthChecker, refreshTokenRoute } from './utils/auth';
dotenv.config();

mongoose.connect('mongodb://localhost:27017/flashcards', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        validate: false,
        authChecker: customAuthChecker,
    });
    const app = express();
    app.use(cookieParser());
    app.post('/refresh_token', refreshTokenRoute);
    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
});
