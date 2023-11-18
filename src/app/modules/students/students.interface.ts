// import { Schema, model, connect } from 'mongoose';

export type StudentName = {
    firstName: string;
    middleName: string;
    lastName: string;
}
export type Guardian = {
    fatherName: string,
    fatherOccupation: string,
    fatherContactNo: string
    motherName: string,
    motherOccupation: string,
    motherContactNo: string
}

export type LocalGuardian = {
    name: string,
    occupation: string,
    contactNo: string,
    addres: string
}


export type Student = {
    id: string;
    name: StudentName;
    gender: 'male' | 'female',
    dateOfBirth: string,
    email: string,
    contactNo: string,
    emergencyContactsNo: string,
    bloodGroup?: 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
    presentAddress: string,
    permanentAddres: string,
    guardian: Guardian,
    localGuardian: LocalGuardian,
    profileImg: string,
    isActive: 'active' | 'blocked'
}