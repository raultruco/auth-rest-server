import config from 'config';
import { Member } from 'models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default {
    signUp: async ({ email, password }) => {
        const member = new Member({
            email: email,
            password: password
        });

        try {
            await member.save();
            return member;
        } catch (err) {
            console.log(err);
            throw new Error({ message: 'Error saving member', status: 400 });
        }
    },

    login: async ({ email, password }) => {
        let memberFound;
        try {
            memberFound = await Member.findOne({ email }).exec();
        } catch (err) {
            console.error(err);
            throw new Error({ message: 'Error retrieving member', status: 400 });
        }

        if (!memberFound) {
            throw new Error({ message: 'Member not found', status: 404 });
        }

        let passwordMatches;
        try {
            passwordMatches = await bcrypt.compare(password, memberFound.password);
        } catch (err) {
            console.error(err);
            throw new Error({ message: 'Error retrieving member', status: 500 });
        }

        if (!passwordMatches) {
            throw new Error({ message: 'Unauthorised', status: 400 });
        }

        try {
            const token = await jwt.sign({
                id: memberFound._id,
                fn: memberFound.fullName,
                ia: memberFound.isAdmin,
                av: memberFound.avatarUrl,
            },
                config.jwtSecret, {
                expiresIn: 86400 // 24 hours
            }
            );

            return {
                id: memberFound._id,
                fullName: memberFound.fullName,
                isAdmin: memberFound.isAdmin,
                avatarUrl: memberFound.avatarUrl,
                accessToken: token
            };
        } catch (err) {
            console.error(err);
            throw new Error({ message: 'Error signing token', status: 500 });
        }
    }
}
