import Koa from 'koa'; // koa@2
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import { mergeSchemas } from '@graphql-tools/merge';
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';
import { UserResolver, CreateUserInput } from './resolvers/UserResolvers';
import { getAccountsSchema } from './utils/accountsHelper';

mongoose.connect('mongodb://localhost:27017/flashcards', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        orphanedTypes: [CreateUserInput],
    });
    const accountsGraphQL = getAccountsSchema();
    const server = new ApolloServer({
        schema: mergeSchemas({
            schemas: [accountsGraphQL.schema, schema],
        }),
        context: accountsGraphQL.context,
    });
    const app = new Koa();
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
