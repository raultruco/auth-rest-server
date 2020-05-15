import { default as mongoose, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import config from 'config';

const memberSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    fullName: String,
    isAdmin: { type: Boolean, default: false },
    sex: { type: Number, default: 2 },
    bornDate: { type: Date, required: false },
    phone: String,
    avatarUrl: String,
    country: String,
    city: String
}, {
    timestamps: true
});

// Hash passwords before saving it to the database
memberSchema.pre('save', async function () {
    const member = this;
    if (member.isModified('password')) {
        const salt = bcrypt.genSaltSync(config.saltLength);
        member.password = await bcrypt.hash(member.password, salt);
    }
});

// Find by email and (hashed) password
memberSchema.statics.findByCredentials = async ({ email, password }) => {
    const member = await Member.findOne({ email });
    if (!member) {
        throw new Error(`Member ${email} not found` );
    }
    const isPasswordMatch = await bcrypt.compare(password, member.password);
    if (!isPasswordMatch) {
        throw new Error(`Password mismatch for member ${email}`);
    }
    return member;
}

// Never serialise (and return) the password field
mongoose.set('toJSON', { transform: (doc, converted) => { delete converted.password; } });

const Member = mongoose.model('Member', memberSchema);
export default Member;
