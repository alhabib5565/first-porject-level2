import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";
// import config from '../config';



const userSchema = new Schema<TUser, UserModel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'student', 'faculty']
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
    next()
})
userSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})
export const User = model<TUser, UserModel>('user', userSchema)