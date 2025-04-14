"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const product_module_1 = require("./src/modules/product.module");
const prisma_module_1 = require("./src/infrastructure/prisma/prisma.module");
const transaction_module_1 = require("./src/modules/transaction.module");
const configuration_1 = require("./src/infrastructure/config/configuration");
const Joi = require("joi");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
                    PORT: Joi.number().default(3000),
                    DATABASE_URL: Joi.string().required(),
                    PAYMENT_GATEWAY_API_URL: Joi.string().required(),
                    PAYMENT_GATEWAY_PUBLIC_KEY: Joi.string().required(),
                    PAYMENT_GATEWAY_PRIVATE_KEY: Joi.string().required(),
                }),
            }),
            prisma_module_1.PrismaModule,
            product_module_1.ProductModule,
            transaction_module_1.TransactionModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map