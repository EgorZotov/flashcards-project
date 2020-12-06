import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';

// Schema
@ObjectType()
export class User {
    @Field({ nullable: true })
    @prop()
    public firstname!: string;

    @Field()
    @prop()
    public lastName!: string;

    @Field()
    @prop({ required: true, unique: true, lowercase: true })
    public username!: string;
}

// Default export
export const UserModel = getModelForClass(User);
