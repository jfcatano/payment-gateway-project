import { Result, Ok, Err, ResultAsync, ok, err } from 'neverthrow'

export { Result, Ok, Err, ResultAsync, ok, err }

// Base error class for the application
export abstract class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(message)
    this.name = new.target.name
  }
}

// Custom error for not found entities.
export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super(
      'NOT_FOUND',
      `${entity}${id ? ` with ID ${id}` : ''} not found`,
      { entity, id }
    )
  }
}

// Bussiness validation or data input errors
export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super('VALIDATION_ERROR', message, metadata)
  }
}

// External errores, from API or other services (If that were the case)
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, metadata?: Record<string, any>) {
    super('EXTERNAL_SERVICE_ERROR', `Error in ${service}: ${message}`, {
      service,
      ...metadata,
    })
  }
}

// Internal error or database error
export class DatabaseError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super('DATABASE_ERROR', message, metadata)
  }
}

// Business logic error (eg: insufficient stock, limits exceeded)
export class BusinessError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super('BUSINESS_ERROR', message, metadata)
  }
}