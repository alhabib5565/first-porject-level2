import { Schema, model } from "mongoose";
import { TFaculty, TFacultyName } from "./faculty.interface";
import { BloodGroup, Gender } from "./faculty.constant";

const userNameSchema = new Schema<TFacultyName>({
    firstName: {
        type: String,
        required: [true, 'firstName is reqired'],
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last Name is required'],
        maxlength: [20, 'Name can not be more than 20 characters'],
    },

}, { _id: false })


const facultySchema = new Schema<TFaculty>({
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
    },
    name: {
        type: userNameSchema,
        required: [true, 'Name is required'],
    },
    gender: {
        type: String,
        enum: {
            values: Gender,
            message: '{VALUE} is not supported'
        },
        required: [true, 'gender is required']
    },
    dateOfBirth: {
        type: Date,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    contactNo: {
        type: String,
        required: [true, 'contactNo is required']
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
        type: String,
        enum: {
            values: BloodGroup,
            message: '{VALUE} is not a valid blood group',
        },
    },
    presentAddress: {
        type: String,
        required: [true, 'Present address is required'],
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required'],
    },
    profileImg: { type: String },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        required: [true, 'academicDepartment id is required'],
        ref: "AcademicDepartment"
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true
    }
)

export const Faculty = model<TFaculty>('Faculty', facultySchema)
