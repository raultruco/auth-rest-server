import { default as mongoose, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const memberSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    full_name: String,
    is_admin: { type: Boolean, default: false },
    sex: { type: Number, default: 2 },
    born_date: { type: Date, required: false },
    phone: String,
    avatar_url: String,
    country: String,
    city: String,
    updated: { type: Date, default: Date.now },
});

// Hashing a password before saving it to the database
memberSchema.pre('save', function (next) {
    let member = this;
    const salt = bcrypt.genSaltSync(10);
    bcrypt.hash(member.password, salt, function (err, hash) {
        if (err) {
            return next(err);
        }
        member.password = hash;
        next();
    });
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
