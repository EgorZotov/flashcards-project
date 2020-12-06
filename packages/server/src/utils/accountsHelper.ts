import { AccountsModule } from '@accounts/graphql-api';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { Mongo } from '@accounts/mongo';
import mongoose from 'mongoose';
import { GraphQLModule } from '@graphql-modules/core';

export const getAccountsSchema = (): GraphQLModule => {
    const accountsMongo = new Mongo(mongoose.connection);
    const accountsPassword = new AccountsPassword({
        validateNewUser: user => {
            if (user.firstname.length < 2) {
                throw new Error('First name too short');
            }
            return user;
        },
    });
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
    return accountsGraphQL;
};
