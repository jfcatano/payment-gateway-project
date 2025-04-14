import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from 'src/interfaces/dtos/create-customer.dto';
export declare abstract class CustomerRepositoryPort {
    abstract findByEmail(email: string): Promise<Customer | null>;
    abstract create(data: CreateCustomerDto): Promise<void>;
}
