// src/core/infrastructure/database/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper para las transacciones de la base de datos
  async executeTransaction<T>(fn: (tx: Pick<PrismaClient, 'customer' | 'transaction' >) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }
  
}