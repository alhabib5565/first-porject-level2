// import { Schema, model, connect } from 'mongoose';

import { Model } from "mongoose";

export type TStudentName = {
    firstName: string;
    middleName?: string | undefined;
    lastName: string;
}
export type TGuardian = {
    fatherName: string,
    fatherOccupation: string,
    fatherContactNo: string
    motherName: string,
    motherOccupation: string,
    motherContactNo: string
}

export type TLocalGuardian = {
    name: string,
    occupation: string,
    contactNo: string,
    address: string
}


export type TStudent = {
    id: string;
    password: string;
    name: TStudentName;
    gender: 'male' | 'female' | 'other',
    dateOfBirth?: string | undefined,
    email: string,
    contactNo: string,
    emergencyContactsNo: string,
    bloodGroup?: 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
    presentAddress: string,
    permanentAddress: string,
    guardian: TGuardian,
    localGuardian: TLocalGuardian,
    profileImg?: string | undefined,
    isActive: 'active' | 'blocked',
    isDeleted: boolean
}

export interface StudentModel extends Model<TStudent> {
    isStudentExists(id: string): Promise<TStudent | null>
}

/* 
create for custom instance methods
export type StudentMethods = {
    isStudentExists(id: string): Promise<TStudent | null>
}

export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods> */