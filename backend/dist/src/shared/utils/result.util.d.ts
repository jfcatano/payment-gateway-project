import { Result, Ok, Err, ResultAsync, ok, err } from 'neverthrow';
export { Result, Ok, Err, ResultAsync, ok, err };
export declare abstract class AppError extends Error {
    readonly code: string;
    readonly metadata?: Record<string, any> | undefined;
    constructor(code: string, message: string, metadata?: Record<string, any> | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(entity: string, id?: string);
}
export declare class ValidationError extends AppError {
    constructor(message: string, metadata?: Record<string, any>);
}
export declare class ExternalServiceError extends AppError {
    constructor(service: string, message: string, metadata?: Record<string, any>);
}
export declare class DatabaseError extends AppError {
    constructor(message: string, metadata?: Record<string, any>);
}
export declare class BusinessError extends AppError {
    constructor(message: string, metadata?: Record<string, any>);
}
