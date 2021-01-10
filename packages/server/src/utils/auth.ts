import { Request, Response } from 'express';
import jwt, { verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { User, UserModel } from '../models/User';
import { ApolloContext } from '../types/server';

export const generateAccessToken = (user: User) => {
    return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: User) => {
    return jwt.sign({ userId: user._id, version: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1w' });
};

export const sendRefreshToken = (res: Response, user: User) => {
    res.cookie('token', generateRefreshToken(user), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
};

export const refreshTokenRoute = async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: '' });
    }

    const user = await UserModel.findOne({ id: payload.userId });

    if (!user) {
        return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: '' });
    }
    sendRefreshToken(res, user);
    return res.send({ ok: true, accessToken: generateAccessToken(user) });
};

export const customAuthChecker: AuthChecker<ApolloContext> = ({ root, args, context, info }, roles) => {
    // here we can read the user from context
    // and check his permission in the db against the `roles` argument
    // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        return false;
    }

    try {
        const token = authorization.split(' ')[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        if (payload.userId) {
            context.userId = payload.userId;
        }
        return true;
    } catch (err) {
        console.error('Auth check error', err);
        return false;
    }
};
