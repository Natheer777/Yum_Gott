"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    constructor(userRepository, authRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.authRepository = authRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        // Find user by email or mobile number
        let user = null;
        if (request.email) {
            user = await this.userRepository.findByEmail(request.email);
        }
        else if (request.mobileNumber) {
            user = await this.userRepository.findByMobileNumber(request.mobileNumber);
        }
        if (!user) {
            throw new Error("Invalid credentials");
        }
        if (!user.isActive) {
            throw new Error("Account is deactivated");
        }
        // Check password
        const isPasswordValid = await this.passwordHasher.compare(request.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate Token
        const jwtPayload = {
            userId: user.id,
            userType: user.userType,
            mobileNumber: user.mobileNumber
        };
        const authToken = await this.authRepository.generateToken(jwtPayload);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            authToken
        };
    }
}
exports.LoginUseCase = LoginUseCase;
