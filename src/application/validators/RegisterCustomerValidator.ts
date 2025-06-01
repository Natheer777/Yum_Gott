import { IValidator } from '../interface/IValidator';
import { RegisterCustomerRequest } from '../use-cases/auth/RegisterCustomerUseCase';

export class RegisterCustomerValidator implements IValidator<RegisterCustomerRequest> {
    async validate(request: RegisterCustomerRequest): Promise<void> {
        this.validateName(request.name);
        this.validateEmail(request.email);
        this.validateMobileNumber(request.mobileNumber);
        this.validatePassword(request.password);
    }

    private validateName(name: string): void {
        if (!name || name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    private validateMobileNumber(mobile: string): void {
        const mobileRegex = /^[0-9]{10,15}$/;
        if (!mobileRegex.test(mobile)) {
            throw new Error('Invalid mobile number format');
        }
    }

    private validatePassword(password: string): void {
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }
} 