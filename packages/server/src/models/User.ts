import { Field, ObjectType } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';

// Schema
@ObjectType()
export class User {
    @Field()
    public _id!: string;

    @Field()
    @prop({ required: true, unique: true })
    public email!: string;

    @Field({ nullable: true })
    @prop()
    public firstname!: string;

    @Field()
    @prop()
    public lastName!: string;

    @Field()
    @prop({ required: true })
    public password!: string;

    @prop({ default: 0 })
    public tokenVersion!: number;
}

// Default export
export const UserModel = getModelForClass(User);
