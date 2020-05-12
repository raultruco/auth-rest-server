import jwt from 'jsonwebtoken';
import config from 'config';
import { Member } from 'models';

export const verifyToken = (req, res, next) => {
    let token = '';
    const tokenHeaderKey =
      req.header('Authorization') || req.headers['x-access-token'];

    if (tokenHeaderKey) {
        token = tokenHeaderKey.replace(/Bearer /g, '');
    }

    if (!token) {
        req.member = null;
        return next();
    }

    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return next({ status: 401, message: 'Unauthorized!', err });
        }
        req.member = {
            id: decoded.id,
            fullName: decoded.fn,
            isAdmin: decoded.ia,
            avatarUrl: decoded.av,
        };
        return next();
    });
};

export const checkExistingMember = (req, res, next) => {
    return Member.findOne({ email: req.body.email })
        .then((member) => {
            if (member) {
                next({ status: 500, message: 'Member already exists!' });
            } else {
                next();
            }
        })
        .catch((err) => {
            next({ status: 500, message: 'Member already exists!', err });
        });
};
