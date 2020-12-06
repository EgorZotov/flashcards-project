import { CreateUserErrors } from '@accounts/password';
import { Resolver, Query, InputType, Field, Mutation, Arg } from 'type-graphql';
import { User, UserModel } from '../models/User';

// @InputType()
// class CreateUserProfile implements Partial<User> {
//     @Field()
//     firstname!: string;
// }

@InputType()
export class CreateUserInput implements Partial<User> {
    @Field({ nullable: true })
    firstname!: string;
    // profile!: CreateUserProfile;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users(): Promise<User[]> {
        return UserModel.find().lean();
    }

    // @Mutation(() => Boolean)
    // CreateUserInput(@Arg('user') user: NewUserInput): boolean {
    //     return true;
    // }
}
