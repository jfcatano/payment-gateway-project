import { CustomerRepositoryPort } from "src/domain/ports/customer.repository.port";
import { Customer } from "src/domain/entities/customer.entity";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCustomerDto } from "src/interfaces/dtos/create-customer.dto";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerPrismaRepository implements CustomerRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<Customer | null> {
        const customer = await this.prisma.customer.findUnique({ where: { email } });
        if (!customer) return null;

        return new Customer(
            customer.id,
            customer.name,
            customer.email,
            customer.addressLine1,
        );
    }
    
    async create(data: CreateCustomerDto): Promise<void> {
        await this.prisma.customer.create({ data });
    }

}