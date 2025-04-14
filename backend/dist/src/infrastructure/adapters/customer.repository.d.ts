import { CustomerRepositoryPort } from "src/domain/ports/customer.repository.port";
import { Customer } from "src/domain/entities/customer.entity";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCustomerDto } from "src/interfaces/dtos/create-customer.dto";
export declare class CustomerPrismaRepository implements CustomerRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<Customer | null>;
    create(data: CreateCustomerDto): Promise<void>;
}
