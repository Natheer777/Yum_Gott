import { Router } from 'express';
import { AuthController } from '../controller/AuthController';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';

export class AuthRouter {
  private router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Customer registration
    this.router.post(
      '/register/customer',
      ValidationMiddleware.validate({
        name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        email: { required: true, type: 'email', maxLength: 255 },
        mobileNumber: { required: true, type: 'mobile' },
        password: { required: true, type: 'string', minLength: 6, maxLength: 100 }
      }),
      this.authController.registerCustomer
    );

    // Restaurant owner registration
    this.router.post(
      '/register/restaurant-owner',
      ValidationMiddleware.validate({
        restaurantName: { required: true, type: 'string', minLength: 2, maxLength: 255 },
        organizationNumber: { required: true, type: 'string', minLength: 5, maxLength: 50 },
        mobileNumber: { required: true, type: 'mobile' },
        password: { required: true, type: 'string', minLength: 6, maxLength: 100 }
      }),
      this.authController.registerRestaurantOwner
    );

    // Login
    this.router.post(
      '/login',
      ValidationMiddleware.validate({
        mobileNumber: { required: true, type: 'mobile' },
        password: { required: true, type: 'string', minLength: 1 }
      }),
      this.authController.login
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}