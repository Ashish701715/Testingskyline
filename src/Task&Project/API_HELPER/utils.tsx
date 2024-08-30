// utils.js
import crypto from 'crypto';

export const hashPassword = (password: any) => {
    const salt = 'your-salt-string'; // Replace with your desired salt value
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
};