import crypto from 'crypto';

export const hashPassword = (password: string, salt: string | undefined = process.env.PASSWORD_SALT) => {
    console.log('Password salt', salt);
    return crypto.createHmac('sha512', salt!).update(password).digest('hex');
};
