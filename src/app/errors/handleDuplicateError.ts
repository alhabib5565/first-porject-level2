import { TGenericErrorResponse, TerrorSources } from "../interface/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);

    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];

    const errorSource: TerrorSources = [
        {
            path: '',
            message: `${extractedMessage} is already exists`,
        },
    ];

    const statusCode = 400;

    return {
        statusCode,
        message: 'Invalid ID',
        errorSource,
    };
};