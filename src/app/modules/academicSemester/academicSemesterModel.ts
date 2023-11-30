import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemster.interface";
import { AcademicSemesterCode, AcademicSemesterMonths, AcademicSemesterName, } from "./academicSemster.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        enum: AcademicSemesterName,
        required: [true, 'name is required']
    },
    year: {
        type: String,
        required: [true, 'year is required']
    },
    code: {
        type: String,
        enum: AcademicSemesterCode,
        required: [true, 'name is required']
    },
    startMonth: {
        type: String,
        enum: AcademicSemesterMonths,
        required: [true, 'startMonth is required']
    },
    endMonth: {
        type: String,
        enum: AcademicSemesterMonths,
        required: [true, 'endMonth is required']
    }
})

academicSemesterSchema.pre('save', async function () {
    const isSemesterExists = await AcademicSemester.findOne({
        name: this.name,
        year: this.year
    })
    if (isSemesterExists) {
        throw Error('semester already exists')
    }
})

export const AcademicSemester = model<TAcademicSemester>('academicSemester', academicSemesterSchema)