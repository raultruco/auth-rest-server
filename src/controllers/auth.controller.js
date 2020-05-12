import config from 'config';
import { Member } from 'models';
import jwt from 'jsonwebtoken';

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
            console.error(err);
            throw new Error({ message: 'Error saving member', status: 400 });
        }
    },

    login: async ({ email, password }) => {
        let registeredMember;
        try {
            registeredMember = await Member.findByCredentials({ email, password });
        } catch (err) {
            console.error(err);
            throw new Error({ message: 'Error retrieving member', status: 400 });
        }

        if (!registeredMember || !registeredMember.email) {
            throw new Error({ message: 'Member not found', status: 404 });
        }

        try {
            const token = await jwt.sign({
                id: registeredMember._id,
                fn: registeredMember.fullName,
                ia: registeredMember.isAdmin,
                av: registeredMember.avatarUrl,
            },
                config.jwtSecret, {
                expiresIn: config.jwtExpires // 24 hours
            }
            );

            return {
                id: registeredMember._id,
                fullName: registeredMember.fullName,
                isAdmin: registeredMember.isAdmin,
                avatarUrl: registeredMember.avatarUrl,
                accessToken: token
            };
        } catch (err) {
            console.error(err);
            throw new Error({ message: 'Error signing token', status: 500 });
        }
    }
}
