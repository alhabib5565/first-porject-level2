import httpStatus from "http-status"
import AppError from "../../errors/appErrors"
import { AcademicSemester } from "../academicSemester/academicSemesterModel"
import { TSemesterRegistration } from "./semesterRegistration.interface"
import { SemesterRegistration } from "./semesterRegistration.model"
import { QueryBuilder } from "../../builder/QueryBuilder"
import { RegistrationStatus } from "./semesterRegistration.constant"
import mongoose from "mongoose"
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model"

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload.academicSemester
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [{ status: { $in: ["UPCOMING", "ONGOING"] } }]
    })

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !`,
        );
    }


    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester)
    if (!isAcademicSemesterExists) {
        throw new AppError(404, 'this Academic semester does"t exist')
    }

    // check if the semester is already registered!
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester,
    });

    if (isSemesterRegistrationExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This semester is already registered!',
        );
    }

    const result = await SemesterRegistration.create(payload);
    return result;
}

const getAllSemesterRegistrationsFromDB = async (
    query: Record<string, unknown>,
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);

    return result;
};

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const newStatus = payload.status
    const isAcademicSemesterExists = await SemesterRegistration.findById(id)
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'this Academic semester is not found')
    }

    const currentSemesterStatus = isAcademicSemesterExists?.status
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is already ${currentSemesterStatus}`,
        );
    }

    if (currentSemesterStatus === RegistrationStatus.UPCOMING && newStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${newStatus}`,
        );
    }

    if (
        currentSemesterStatus === RegistrationStatus.ONGOING &&
        newStatus === RegistrationStatus.UPCOMING
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${newStatus}`,
        );
    }


    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true })
    return result

}

const deleteSemesterRegistrationFromDB = async (id: string) => {
    const isSemesterRegistrationExist = await SemesterRegistration.findById(id)

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'this semester registration not fund')
    }

    const semesterRegistrationStatus = isSemesterRegistrationExist.status

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not delete ${semesterRegistrationStatus} semester registration `)
    }


    const session = await mongoose.startSession()


    try {
        session.startTransaction()
        const deleteSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id, { session })


        if (!deleteSemesterRegistration) {
            throw new AppError(httpStatus.BAD_REQUEST, 'semester registration delete failed')
        }


        const deleteOffererCourses = await OfferedCourse.deleteMany({ semesterRegistration: id }, { session })

        if (!deleteOffererCourses) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Offered courses delete failed on the semester')
        }


        await session.commitTransaction()
        await session.endSession()

        return deleteSemesterRegistration

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message || '')

    }
}

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
};