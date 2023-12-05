import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/appErrors";
import httpStatus from "http-status";


const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: "AcademicFaculty"
    }
}, { timestamps: true })


academicDepartmentSchema.pre('save', async function (next) {
    const isDepartmentExists = await AcademicDepartment.findOne({
        name: this.name
    })

    if (isDepartmentExists) {
        throw new AppError(404, "this department already exists")
    }
    next()
})

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery();
    const isDepartmentExist = await AcademicDepartment.findOne(query);
    if (!isDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'this department dose not exists')
    }
    next()
})
export const AcademicDepartment = model<TAcademicDepartment>("AcademicDepartment", academicDepartmentSchema)