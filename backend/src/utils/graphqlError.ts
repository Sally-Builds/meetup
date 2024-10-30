import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from './customError';


export const formatError = (
    formattedError: GraphQLFormattedError,
    error: unknown
): GraphQLFormattedError => {
    // Check if it's our CustomError
    if (error instanceof GraphQLError && error.originalError instanceof CustomError) {
        const customError = error.originalError;
        return {
            message: customError.message,
            extensions: {
                code: customError.statusCode,
                context: customError.error.ctx,
                logging: customError.logging
            }
        };
    }

    // Return the formatted error as is for other cases
    return formattedError;
};