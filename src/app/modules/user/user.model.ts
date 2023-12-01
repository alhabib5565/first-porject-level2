import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";
// import config from '../config';



const userSchema = new Schema<TUser>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
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
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    // console.log(this, 'before save student data PRE')
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
    next()
})
userSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})
export const User = model('user', userSchema)