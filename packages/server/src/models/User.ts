import { Document, Model, model, Types, Schema, ObjectId } from 'mongoose';
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';

// Schema

// class User {
//     @prop({ required: true })
//     public firstname?: string;

//     @prop()
//     public lastName?: string;

//     @prop({ required: true, unique: true, lowercase: true})
//     public username?: string;
// }

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
});

export interface IUser extends Document {
    _id?: ObjectId;
    firstName?: string;
    lastName: string;
    username?: string;
}

export interface IUserModel extends Model<IUser> {
    //Static methods
}

UserSchema.virtual('fullName').get(function (this: IUser) {
    return this.firstName + this.lastName;
});

// Default export
export default model<IUser, IUserModel>('User', UserSchema);
