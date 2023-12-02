import { z } from 'zod';

// Define a Zod schema for the Student's name
const createNameValidationSchema = z.object({
    firstName: z.string().min(1, { message: 'First name must not be empty' }).max(15, { message: 'First name cannot exceed 15 characters' }),
    middleName: z.string().optional(),
    lastName: z.string()
        .min(1, { message: 'Last name must not be empty' })
        .refine((val) => /^[a-zA-Z]+$/.test(val), { message: 'Last name must contain only alphabetic characters' }),
});



// Define a Zod schema for Guardian
const createGuardianValidationSchema = z.object({
    fatherName: z.string().min(1, { message: 'Father name must not be empty' }),
    fatherOccupation: z.string().min(1, { message: 'Father occupation must not be empty' }),
    fatherContactNo: z.string().min(1, { message: 'Father contact number must not be empty' }),
    motherName: z.string().min(1, { message: 'Mother name must not be empty' }),
    motherOccupation: z.string().min(1, { message: 'Mother occupation must not be empty' }),
    motherContactNo: z.string().min(1, { message: 'Mother contact number must not be empty' }),
});

// Define a Zod schema for LocalGuardian
const createLocalGuardianSchema = z.object({
    name: z.string().min(1, { message: 'Local guardian name must not be empty' }),
    occupation: z.string().min(1, { message: 'Local guardian occupation must not be empty' }),
    contactNo: z.string().min(1, { message: 'Local guardian contact number must not be empty' }),
    address: z.string().min(1, { message: 'Local guardian address must not be empty' }),
});

// Define a Zod schema for the Student
const createStudentValidationSchema = z.object({
    // id: z.string().length(6, { message: 'id must be 6 characters' }),
    password: z.string().max(20),
    student: z.object({
        name: createNameValidationSchema,
        gender: z.enum(['male', 'female', 'other']),
        dateOfBirth: z.string().optional(),
        email: z.string().email({ message: 'Invalid email format' }),
        contactNo: z.string().min(1, { message: 'Contact number must not be empty' }),
        emergencyContactsNo: z.string().min(1, { message: 'Emergency contact number must not be empty' }),
        bloodGroup: z.enum(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
        presentAddress: z.string().min(1, { message: 'Present address must not be empty' }),
        permanentAddress: z.string().min(1, { message: 'Permanent address must not be empty' }),
        guardian: createGuardianValidationSchema,
        localGuardian: createLocalGuardianSchema,
        profileImg: z.string().optional(),
        admissionSemester: z.string(),
        academicDepartment: z.string(),
    })
});


const updateNameValidationSchema = z.object({
    firstName: z.string().min(1, { message: 'First name must not be empty' }).max(15, { message: 'First name cannot exceed 15 characters' }).optional(),
    middleName: z.string().optional(),
    lastName: z.string()
        .min(1, { message: 'Last name must not be empty' })
        .refine((val) => /^[a-zA-Z]+$/.test(val), { message: 'Last name must contain only alphabetic characters' }).optional(),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().min(1, { message: 'Father name can not be empty' }).optional(),
    fatherOccupation: z.string().min(1, { message: 'Father occupation can not be empty' }).optional(),
    fatherContactNo: z.string().min(1, { message: 'Father contact number can not be empty' }).optional(),
    motherName: z.string().min(1, { message: 'Mother name can not be empty' }).optional(),
    motherOccupation: z.string().min(1, { message: 'Mother occupation can not be empty' }).optional(),
    motherContactNo: z.string().min(1, { message: 'Mother contact number can not be empty' }).optional(),
});

// Define a Zod schema for LocalGuardian
const updateLocalGuardianSchema = z.object({
    name: z.string().min(1, { message: 'Local guardian name must not be empty' }).optional(),
    occupation: z.string().min(1, { message: 'Local guardian occupation must not be empty' }).optional(),
    contactNo: z.string().min(1, { message: 'Local guardian contact number must not be empty' }).optional(),
    address: z.string().min(1, { message: 'Local guardian address must not be empty' }).optional(),
})

export const updateStudentValidationSchema = z.object({
    // id: z.string().length(6, { message: 'id must be 6 characters' }),
    student: z.object({
        name: updateNameValidationSchema.optional(),
        gender: z.enum(['male', 'female', 'other']).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email({ message: 'Invalid email format' }).optional(),
        contactNo: z.string().min(1, { message: 'Contact number must not be empty' }).optional(),
        emergencyContactsNo: z.string().min(1, { message: 'Emergency contact number must not be empty' }).optional(),
        bloodGroup: z.enum(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']).optional(),
        presentAddress: z.string().min(1, { message: 'Present address must not be empty' }).optional(),
        permanentAddress: z.string().min(1, { message: 'Permanent address must not be empty' }).optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGuardian: updateLocalGuardianSchema.optional(),
        profileImg: z.string().optional(),
        admissionSemester: z.string().optional(),
        academicDepartment: z.string().optional(),
    })
});

export const studentValidations = {
    createStudentValidationSchema,
    updateGuardianValidationSchema
};
