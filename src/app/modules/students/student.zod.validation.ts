import { z } from 'zod';

// Define a Zod schema for the Student's name
const NameValidationSchema = z.object({
    firstName: z.string().min(1, { message: 'First name must not be empty' }).max(15, { message: 'First name cannot exceed 15 characters' }),
    middleName: z.string().optional(),
    lastName: z.string()
        .min(1, { message: 'Last name must not be empty' })
        .refine((val) => /^[a-zA-Z]+$/.test(val), { message: 'Last name must contain only alphabetic characters' }),
});

// Define a Zod schema for Guardian
const GuardianValidationSchema = z.object({
    fatherName: z.string().min(1, { message: 'Father name must not be empty' }),
    fatherOccupation: z.string().min(1, { message: 'Father occupation must not be empty' }),
    fatherContactNo: z.string().min(1, { message: 'Father contact number must not be empty' }),
    motherName: z.string().min(1, { message: 'Mother name must not be empty' }),
    motherOccupation: z.string().min(1, { message: 'Mother occupation must not be empty' }),
    motherContactNo: z.string().min(1, { message: 'Mother contact number must not be empty' }),
});

// Define a Zod schema for LocalGuardian
const LocalGuardianSchema = z.object({
    name: z.string().min(1, { message: 'Local guardian name must not be empty' }),
    occupation: z.string().min(1, { message: 'Local guardian occupation must not be empty' }),
    contactNo: z.string().min(1, { message: 'Local guardian contact number must not be empty' }),
    address: z.string().min(1, { message: 'Local guardian address must not be empty' }),
});

// Define a Zod schema for the Student
export const createStudentValidationSchema = z.object({
    // id: z.string().length(6, { message: 'id must be 6 characters' }),
    password: z.string().max(20),
    student: z.object({
        name: NameValidationSchema,
        gender: z.enum(['male', 'female', 'other']),
        dateOfBirth: z.string().optional(),
        email: z.string().email({ message: 'Invalid email format' }),
        contactNo: z.string().min(1, { message: 'Contact number must not be empty' }),
        emergencyContactsNo: z.string().min(1, { message: 'Emergency contact number must not be empty' }),
        bloodGroup: z.enum(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
        presentAddress: z.string().min(1, { message: 'Present address must not be empty' }),
        permanentAddress: z.string().min(1, { message: 'Permanent address must not be empty' }),
        guardian: GuardianValidationSchema,
        localGuardian: LocalGuardianSchema,
        profileImg: z.string().optional(),
    })
});

// export const studentValidations = {
//     createStudentValidationSchema
// };
