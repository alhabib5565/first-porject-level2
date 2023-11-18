import { Schema, model } from 'mongoose';
import { Guardian, LocalGuardian, Student, StudentName } from './students/students.interface';

const nameSchema = new Schema<StudentName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true }
})

const guardianSchema = new Schema<Guardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
})

const localGuardianSchema = new Schema<LocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    addres: { type: String, required: true },
})

const studentSchema = new Schema<Student>({
    id: { type: String },
    name: nameSchema,
    gender: ['male', 'female'],
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactsNo: { type: String, required: true },
    bloodGroup: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
    presentAddress: { type: String, required: true },
    permanentAddres: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String },
    isActive: ['active', 'blocked']
})

export const StudentModel = model<Student>('Student', studentSchema)
