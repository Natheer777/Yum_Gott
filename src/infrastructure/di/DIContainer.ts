import { DatabaseConnection } from '../database/DataBaseConnection';
import { UserRepository } from '../repositories/UserRepository';
import { AuthRepository } from '../repositories/AuthRepository';
import { PasswordHasher } from '../services/PasswordHasher';

import { RegisterCustomerUseCase } from '@/application/use-cases/auth/RegisterCustomerUseCase';
import { RegisterRestaurantOwnerUseCase } from '@/application/use-cases/auth/RegisterResturantOwnerUseCases';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';

import { AuthController } from '@/presentation/controller/AuthController';
import { AuthMiddleware } from '@/presentation/middleware/AuthMiddleware';

export class DIContainer {
  private static instance: DIContainer;

  // Infrastructure
  private _databaseConnection: DatabaseConnection;
  private _userRepository: UserRepository;
  private _authRepository: AuthRepository;
  private _passwordHasher: PasswordHasher;

  // Use Cases
  private _registerCustomerUseCase: RegisterCustomerUseCase;
  private _registerRestaurantOwnerUseCase: RegisterRestaurantOwnerUseCase;
  private loginUseCase: LoginUseCase;

  // Controllers
  private authController: AuthController;

  // Middleware
  private authMiddleware: AuthMiddleware;

  private constructor() {
    this.initializeDependencies();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeDependencies(): void {
    // Infrastructure
    this._databaseConnection = DatabaseConnection.getInstance();
    this._userRepository = new UserRepository(this._databaseConnection);
    this._authRepository = new AuthRepository();
    this._passwordHasher = new PasswordHasher();

    // Use Cases
    this._registerCustomerUseCase = new RegisterCustomerUseCase(
      this._userRepository,
      this._passwordHasher
    );

    this._registerRestaurantOwnerUseCase = new RegisterRestaurantOwnerUseCase(
      this._userRepository,
      this._passwordHasher
    );

    this._loginUseCase = new LoginUseCase(
      this._userRepository,
      this._authRepository,
      this._passwordHasher
    );

    // Controllers
    this._authController = new AuthController(
      this._registerCustomerUseCase,
      this._registerRestaurantOwnerUseCase,
      this._loginUseCase
    );

    // Middleware
    this._authMiddleware = new AuthMiddleware(this._authRepository);
  }

  // Getters
  public get databaseConnection(): DatabaseConnection {
    return this._databaseConnection;
  }

  public get userRepository(): UserRepository {
    return this._userRepository;
  }

  public get authRepository(): AuthRepository {
    return this._authRepository;
  }

  public get passwordHasher(): PasswordHasher {
    return this._passwordHasher;
  }

  public get registerCustomerUseCase(): RegisterCustomerUseCase {
    return this._registerCustomerUseCase;
  }

  public get registerRestaurantOwnerUseCase(): RegisterRestaurantOwnerUseCase {
    return this._registerRestaurantOwnerUseCase;
  }

  public get loginUseCase(): LoginUseCase {
    return this._loginUseCase;
  }

  public get authController(): AuthController {
    return this._authController;
  }

  public get authMiddleware(): AuthMiddleware {
    return this._authMiddleware;
  }
}
