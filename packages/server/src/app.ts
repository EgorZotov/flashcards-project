import Koa from 'koa'; // koa@2
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-koa';
import { mergeTypeDefs, mergeResolvers } from '@graphql-toolkit/schema-merging';
import { AccountsModule } from '@accounts/graphql-api';
import { Mongo } from '@accounts/mongo';
import mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

mongoose.connect('mongodb://localhost:27017/flashcards', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const accountsMongo = new Mongo(mongoose.connection);

const accountsPassword = new AccountsPassword({});

const accountsServer = new AccountsServer(
    {
        db: accountsMongo,
        tokenSecret: 'my-super-random-secret',
    },
    {
        password: accountsPassword,
    },
);

const accountsGraphQL = AccountsModule.forRoot({ accountsServer });

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
