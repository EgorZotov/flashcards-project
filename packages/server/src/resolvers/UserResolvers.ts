import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserModel } from '../models/User';
import { hashPassword } from '../utils/crypto';
import { ApolloContext } from '../types/server';
import { UserInputError } from 'apollo-server-express';

@InputType({ description: 'Data for user login' })
class LoginInput implements Partial<User> {
    @Field()
    email!: string;

    @Field()
    password!: string;
}

@InputType({ description: 'Data for user login' })
class SignUpInput implements Partial<User> {
    @Field()
    email!: string;

    @Field()
    password!: string;

    @Field({ nullable: true })
    firstname!: string;

    @Field({ nullable: true })
    lastname!: string;
}

@Resolver()
export class UserResolver {
    @Query(() => User)
    me(@Arg('id') id: string): Promise<User> {
        return UserModel.findById(id).lean();
    }

    @Mutation(() => User)
    async signUp(@Arg('user') signUpData: SignUpInput, @Ctx() ctx: ApolloContext) {
        const checkUser = await UserModel.exists({ email: signUpData.email });
        if (checkUser) {
            throw new UserInputError('Failed to signup', {
                code: 'USER_ALREADY_REGISTERED',
            });
        } else {
            const user = new UserModel(signUpData);
            user.password = hashPassword(signUpData.password);
            return user.save();
        }
    }

    @Mutation(() => User)
    async login(@Arg('user') loginData: LoginInput, @Ctx() ctx: ApolloContext) {
        const user = await UserModel.findOne({ email: loginData.email, password: hashPassword(loginData.password) });
        if (!user) {
            throw new UserInputError('Failed to login', {
                code: 'USER_NOT_FOUND',
            });
        }
        return user;
    }
}
