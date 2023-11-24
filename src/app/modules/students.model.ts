import { Schema, model } from 'mongoose';
import { TGuardian, TLocalGuardian, TStudent, StudentModel, TStudentName } from './students/students.interface';
import validator from 'validator';
import bcrypt from 'bcrypt'
import config from '../config';

const nameSchema = new Schema<TStudentName>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [15, 'First name cannot exceed 15 characters'],
        /*validate:  {
            validator: function (value: string) {
                const FNameStr: string = value.charAt(0).toUpperCase() + value.slice(1)
                return value === FNameStr;
            },
            message: '{VALUE} is not valid format'
        } */
    },
    middleName: {
        type: String || undefined,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: '{VALUE} is not valid last name'
        },
    }
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: { type: String, trim: true, required: [true, 'Father name is required'] },
    fatherOccupation: { type: String, trim: true, required: [true, 'Father occupation is required'] },
    fatherContactNo: { type: String, trim: true, required: [true, 'Father contact number is required'] },
    motherName: { type: String, trim: true, required: [true, 'Mother name is required'] },
    motherOccupation: { type: String, trim: true, required: [true, 'Mother occupation is required'] },
    motherContactNo: { type: String, trim: true, required: [true, 'Mother contact number is required'] },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: [true, 'Local guardian name is required'] },
    occupation: { type: String, required: [true, 'Local guardian occupation is required'] },
    contactNo: { type: String, required: [true, 'Local guardian contact number is required'] },
    address: { type: String, required: [true, 'Local guardian address is required'] },
});

const studentSchema = new Schema<TStudent, StudentModel>({
    id: { type: String, unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    name: {
        type: nameSchema,
        required: [true, 'Student name is required'],
        // maxlength: [20, 'Name can"t be more than 20 ']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported for gender',
        },
    },
    dateOfBirth: { type: String },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactsNo: { type: String, required: [true, 'Emergency contact number is required'] },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: {
            values: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
            message: '{VALUE} is not supported for blood group',
        },
    },
    presentAddress: { type: String, required: [true, 'Present address is required'] },
    permanentAddress: { type: String, required: [true, 'Permanent address is required'] },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required'],
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian information is required'],
    },
    profileImg: { type: String },
    isActive: {
        type: String,
        required: [true, 'Active status is required'],
        enum: {
            values: ['active', 'blocked'],
            message: '{VALUE} is not supported for active status',
            default: 'active',
        },
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

studentSchema.pre('save', async function (next) {
    // console.log(this, 'before save student data PRE')
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
    next()
})
studentSchema.post('save', function (doc, next) {
    doc.password = ''
    next()
})

studentSchema.pre('find', function (next) {
    console.log(this)
})










studentSchema.static('isStudentExists', async function isStudentExists(id: string) {
    const studentAreadyExists = await Student.findOne({ id })
    return studentAreadyExists
});
/* 
creating a custom instance method
studentSchema.methods.isStudentExists = async function (id: string) {
    const studentAreadyExists = await Student.findOne({ id })
    return studentAreadyExists
}
studentSchema.method('isStudentExists', async function isStudentExists(id: string) {
    const studentAreadyExists = await Student.findOne({ id })
    return studentAreadyExists
});
*/
export const Student = model<TStudent, StudentModel>('Student', studentSchema) 