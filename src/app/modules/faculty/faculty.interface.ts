import { Types } from "mongoose"
export type TFacultyName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};
export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup = 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-'

export type TFaculty = {
    id: string, //F-0001
    user: Types.ObjectId
    designation: string
    name: TFacultyName
    gender: TGender
    dateOfBirth?: Date
    email: string
    contactNo: string
    emergencyContactNo: string
    presentAddress: string
    permanentAddress: string
    bloodGroup?: TBloodGroup
    academicDepartment: Types.ObjectId
    profileImg?: string | undefined,
    isDeleted: boolean
}