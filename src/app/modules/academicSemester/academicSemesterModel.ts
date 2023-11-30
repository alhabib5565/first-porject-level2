import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemster.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemster.constant";

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
        enum: Months,
        required: [true, 'startMonth is required']
    },
    endMonth: {
        type: String,
        enum: Months,
        required: [true, 'endMonth is required']
    }
})

export const academicSemester = model('academicSemester', academicSemesterSchema)