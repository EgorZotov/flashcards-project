import express from 'express'; // koa@2
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolvers';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect('mongodb://localhost:27017/flashcards', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        validate: false,
    });
    const app = express();
    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
});

// A new schema is created combining our schema and the accounts-js schema
// const schema = makeExecutableSchema({
//     typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
//     resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
//     schemaDirectives: {
//         ...accountsGraphQL.schemaDirectives,
//     },
// });

// When we instantiate our Apollo server we use the schema and context properties
// const server = new ApolloServer({
//     schema,
//     context: accountsGraphQL.context,
// });
