import Joi from 'joi';

const nameValidationSchema = Joi.object().keys({
    firstName: Joi.string()
        .required()
        .trim()
        .max(15)
        .messages({
            'string.base': 'First name must be a string',
            'string.empty': 'First name cannot be empty',
            'string.max': 'First name cannot exceed {#limit} characters',
            'string.pattern.base': 'First name must start with an uppercase letter and contain only letters',
            'any.required': 'First name is required',
        }),
    middleName: Joi.string().trim().allow('').optional(),
    lastName: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'Last name must be a string',
            'string.empty': 'Last name cannot be empty',
            'any.required': 'Last name is required',
            'string.pattern.base': 'Last name must contain only letters',
        }),
});

const guardianValidationSchema = Joi.object().keys({
    fatherName: Joi.string().required().trim().messages({
        'string.base': 'Father name must be a string',
        'string.empty': 'Father name cannot be empty',
        'any.required': 'Father name is required',
    }),
    fatherOccupation: Joi.string().required().trim().messages({
        'string.base': 'Father occupation must be a string',
        'string.empty': 'Father occupation cannot be empty',
        'any.required': 'Father occupation is required',
    }),
    fatherContactNo: Joi.string().required().trim().messages({
        'string.base': 'Father contact number must be a string',
        'string.empty': 'Father contact number cannot be empty',
        'any.required': 'Father contact number is required',
    }),
    motherName: Joi.string().required().trim().messages({
        'string.base': 'Mother name must be a string',
        'string.empty': 'Mother name cannot be empty',
        'any.required': 'Mother name is required',
    }),
    motherOccupation: Joi.string().required().trim().messages({
        'string.base': 'Mother occupation must be a string',
        'string.empty': 'Mother occupation cannot be empty',
        'any.required': 'Mother occupation is required',
    }),
    motherContactNo: Joi.string().required().trim().messages({
        'string.base': 'Mother contact number must be a string',
        'string.empty': 'Mother contact number cannot be empty',
        'any.required': 'Mother contact number is required',
    }),
});

const localGuardianValidationSchema = Joi.object().keys({
    name: Joi.string().required().trim().messages({
        'string.base': 'Local guardian name must be a string',
        'string.empty': 'Local guardian name cannot be empty',
        'any.required': 'Local guardian name is required',
    }),
    occupation: Joi.string().required().trim().messages({
        'string.base': 'Local guardian occupation must be a string',
        'string.empty': 'Local guardian occupation cannot be empty',
        'any.required': 'Local guardian occupation is required',
    }),
    contactNo: Joi.string().required().trim().messages({
        'string.base': 'Local guardian contact number must be a string',
        'string.empty': 'Local guardian contact number cannot be empty',
        'any.required': 'Local guardian contact number is required',
    }),
    address: Joi.string().required().trim().messages({
        'string.base': 'Local guardian address must be a string',
        'string.empty': 'Local guardian address cannot be empty',
        'any.required': 'Local guardian address is required',
    }),
});

const studentValidationSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: nameValidationSchema.required(),
    gender: Joi.string().required().valid('male', 'female').messages({
        'string.base': 'Gender must be a string',
        'string.empty': 'Gender cannot be empty',
        'any.required': 'Gender is required',
        'any.only': 'Gender must be either "male" or "female"',
    }),
    dateOfBirth: Joi.string().optional(),
    email: Joi.string().required().email().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    contactNo: Joi.string().required().messages({
        'string.base': 'Contact number must be a string',
        'string.empty': 'Contact number cannot be empty',
        'any.required': 'Contact number is required',
    }),
    emergencyContactsNo: Joi.string().required().messages({
        'string.base': 'Emergency contact number must be a string',
        'string.empty': 'Emergency contact number cannot be empty',
        'any.required': 'Emergency contact number is required',
    }),
    bloodGroup: Joi.string().required().valid('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-').messages({
        'string.base': 'Blood group must be a string',
        'string.empty': 'Blood group cannot be empty',
        'any.required': 'Blood group is required',
        'any.only': 'Blood group is not supported',
    }),
    presentAddress: Joi.string().required().trim().messages({
        'string.base': 'Present address must be a string',
        'string.empty': 'Present address cannot be empty',
        'any.required': 'Present address is required',
    }),
    permanentAddress: Joi.string().required().trim().messages({
        'string.base': 'Permanent address must be a string',
        'string.empty': 'Permanent address cannot be empty',
        'any.required': 'Permanent address is required',
    }),
    guardian: guardianValidationSchema.required(),
    localGuardian: localGuardianValidationSchema.required(),
    profileImg: Joi.string().optional(),
    isActive: Joi.string().required().valid('active', 'blocked').default('active').messages({
        'string.base': 'Active status must be a string',
        'string.empty': 'Active status cannot be empty',
        'any.required': 'Active status is required',
        'any.only': 'Active status must be either "active" or "blocked"',
    }),
});

export default studentValidationSchema
