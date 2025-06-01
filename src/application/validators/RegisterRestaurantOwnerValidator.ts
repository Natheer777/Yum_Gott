import { IValidator } from '../interface/IValidator';
import { RegisterRestaurantOwnerRequest } from '../use-cases/auth/RegisterResturantOwnerUseCases';

export class RegisterRestaurantOwnerValidator implements IValidator<RegisterRestaurantOwnerRequest> {
    async validate(request: RegisterRestaurantOwnerRequest): Promise<void> {
        this.validateRestaurantName(request.restaurantName);
        this.validateOrganizationNumber(request.organizationNumber);
        this.validateMobileNumber(request.mobileNumber);
        this.validatePassword(request.password);
    }

    private validateRestaurantName(name: string): void {
        if (!name || name.trim().length < 2) {
            throw new Error('Restaurant name must be at least 2 characters long');
        }
    }

    private validateOrganizationNumber(orgNumber: string): void {
        if (!orgNumber || orgNumber.trim().length < 5) {
            throw new Error('Organization number must be at least 5 characters long');
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