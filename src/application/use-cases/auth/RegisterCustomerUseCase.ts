import { Customer, UserType } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/interface/IPasswordHasher';
import { IValidator } from '@/application/interface/IValidator';
export interface RegisterCustomerRequest {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
}
//data inter by normal user
export class RegisterCustomerUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private validator: IValidator<RegisterCustomerRequest>
  ) { }

  async execute(request: RegisterCustomerRequest): Promise<Customer> {
    await this.validator.validate(request);
    await this.checkExistingUser(request);

    const hashedPassword = await this.passwordHasher.hash(request.password);
    const customer = this.createCustomer(request, hashedPassword);

    return await this.userRepository.create(customer);
  }

  private async checkExistingUser(request: RegisterCustomerRequest): Promise<void> {
    const existingUser = await this.userRepository.findByMobileNumber(request.mobileNumber);
    if (existingUser) {
      throw new Error('User already exists with this mobile number');
    }

    const emailExists = await this.userRepository.existsByEmail(request.email);
    if (emailExists) {
      throw new Error('User already exists with this email');
    }
  }

  private createCustomer(request: RegisterCustomerRequest, hashedPassword: string): Customer {
    return {
      name: request.name,
      email: request.email,
      mobileNumber: request.mobileNumber,
      password: hashedPassword,
      userType: UserType.CUSTOMER,
      isActive: true
    };
  }
}