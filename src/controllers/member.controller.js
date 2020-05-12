import { Member } from 'models';
import ServerError from 'utils/ServerError';

export default {
    create: async (data) => {
        const member = new Member(data);

        try {
            return await member.save();
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error saving member', status: 401 });
        }
    },

    update: async (data) => {
        let updated;
        const { id, ...dataWithoutId } = data;

        try {
            updated = await Member.findByIdAndUpdate(id, dataWithoutId, { new: true, useFindAndModify: false });
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: `Error updating member with id ${id}`, status: 400 });
        }

        if (!updated) {
            throw new ServerError({ message: `Member with id ${id} not found`, status: 400 });
        } else {
            return updated;
        }
    },

    delete: async (id) => {
        try {
            return await Member.findByIdAndRemove(id);
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: `Error deleting member with id ${id}`, status: 400 });
        }
    },

    deleteAll: async () => {
        let deleted;
        try {
            deleted = await Member.deleteMany({});
            const deletedCount = deleted ? deleted.deletedCount : 0;
            return { deletedCount };
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error deleting all members', status: 400 });
        }
    },

    findAll: async () => {
        try {
            return await Member.find();
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error retrieving members', status: 400 });
        }
    },

    findOneById: async (id) => {
        try {
            return await Member.findById(id);
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error retrieving member by id', status: 400 });
        }
    },

    findOneByEmail: async (email) => {
        try {
            return await Member.findOne({ email });
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error retrieving member by email', status: 400 });
        }
    },

    findByIsAdmin: async ({ isAdmin = false }) => {
        try {
            return await Member.find({ isAdmin: !!isAdmin});
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error retrieving member by email', status: 400 });
        }
    },

    search: async ({ keyword }) => {
        let conditions = {};
        if (keyword) {
            conditions.email = { $regex: new RegExp(keyword), $options: "i" };
            conditions.fullName = { $regex: new RegExp(keyword), $options: "i" };
        }

        try {
            return await Member.find({ conditions });
        } catch (err) {
            console.error(err);
            throw new ServerError({ message: 'Error searching members', status: 400 });
        }
    }
}
