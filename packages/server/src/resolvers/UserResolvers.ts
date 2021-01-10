import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User, UserModel } from '../models/User';
import { hashPassword } from '../utils/crypto';
import { ApolloContext } from '../types/server';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from '../utils/auth';
// import jwt from 'jsonwebtoken';

@InputType({ description: 'Data for user login' })
class LoginInput implements Partial<User> {
    @Field()
    email!: string;

    @Field()
    password!: string;
}

@ObjectType()
class AuthResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}

@InputType({ description: 'Data for user signUp' })
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
    @Authorized()
    @Query(() => User)
    me(@Ctx() ctx: ApolloError): Promise<User> {
        return UserModel.findById(ctx.userId).lean();
    }

    @Mutation(() => AuthResponse)
    async signUp(@Arg('user') signUpData: SignUpInput, @Ctx() ctx: ApolloContext): Promise<AuthResponse> {
        const checkUser = await UserModel.exists({ email: signUpData.email });
        if (checkUser) {
            throw new UserInputError('Failed to signup', {
                code: 'USER_ALREADY_REGISTERED',
            });
        } else {
            const user = new UserModel(signUpData);
            user.password = hashPassword(signUpData.password);
            ctx.res.cookie('token', generateRefreshToken(user), {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            await user.save();
            return {
                user,
                accessToken: generateAccessToken(user),
            };
        }
    }

    @Mutation(() => AuthResponse)
    async login(@Arg('user') loginData: LoginInput, @Ctx() ctx: ApolloContext): Promise<AuthResponse> {
        const user = await UserModel.findOne({ email: loginData.email, password: hashPassword(loginData.password) });
        if (!user) {
            throw new UserInputError('Failed to login', {
                code: 'USER_NOT_FOUND',
            });
        }
        sendRefreshToken(ctx.res, user);
        return {
            user,
            accessToken: generateAccessToken(user),
        };
    }
}
