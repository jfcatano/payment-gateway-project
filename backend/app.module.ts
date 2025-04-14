import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from 'src/modules/product.module';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { TransactionModule } from 'src/modules/transaction.module';

import configuration from 'src/infrastructure/config/configuration';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        PAYMENT_GATEWAY_API_URL: Joi.string().required(),
        PAYMENT_GATEWAY_PUBLIC_KEY: Joi.string().required(),
        PAYMENT_GATEWAY_PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    PrismaModule,
    ProductModule,
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }


// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
