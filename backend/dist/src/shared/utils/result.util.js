"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessError = exports.DatabaseError = exports.ExternalServiceError = exports.ValidationError = exports.NotFoundError = exports.AppError = exports.err = exports.ok = exports.ResultAsync = exports.Err = exports.Ok = exports.Result = void 0;
const neverthrow_1 = require("neverthrow");
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return neverthrow_1.Result; } });
Object.defineProperty(exports, "Ok", { enumerable: true, get: function () { return neverthrow_1.Ok; } });
Object.defineProperty(exports, "Err", { enumerable: true, get: function () { return neverthrow_1.Err; } });
Object.defineProperty(exports, "ResultAsync", { enumerable: true, get: function () { return neverthrow_1.ResultAsync; } });
Object.defineProperty(exports, "ok", { enumerable: true, get: function () { return neverthrow_1.ok; } });
Object.defineProperty(exports, "err", { enumerable: true, get: function () { return neverthrow_1.err; } });
class AppError extends Error {
    code;
    metadata;
    constructor(code, message, metadata) {
        super(message);
        this.code = code;
        this.metadata = metadata;
        this.name = new.target.name;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(entity, id) {
        super('NOT_FOUND', `${entity}${id ? ` with ID ${id}` : ''} not found`, { entity, id });
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message, metadata) {
        super('VALIDATION_ERROR', message, metadata);
    }
}
exports.ValidationError = ValidationError;
class ExternalServiceError extends AppError {
    constructor(service, message, metadata) {
        super('EXTERNAL_SERVICE_ERROR', `Error in ${service}: ${message}`, {
            service,
            ...metadata,
        });
    }
}
exports.ExternalServiceError = ExternalServiceError;
class DatabaseError extends AppError {
    constructor(message, metadata) {
        super('DATABASE_ERROR', message, metadata);
    }
}
exports.DatabaseError = DatabaseError;
class BusinessError extends AppError {
    constructor(message, metadata) {
        super('BUSINESS_ERROR', message, metadata);
    }
}
exports.BusinessError = BusinessError;
//# sourceMappingURL=result.util.js.map