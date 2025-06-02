"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const AuthValidators_1 = require("../validators/AuthValidators");
const ValidationMiddleware_1 = require("../middleware/ValidationMiddleware");
class AuthRouter {
    constructor(authController) {
        this.authController = authController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Customer registration
        this.router.post('/register/customer', AuthValidators_1.AuthValidators.registerCustomer(), ValidationMiddleware_1.ValidationMiddleware.handleValidationErrors(), this.authController.registerCustomer);
        // Restaurant owner registration
        this.router.post('/register/restaurant-owner', AuthValidators_1.AuthValidators.registerRestaurantOwner(), ValidationMiddleware_1.ValidationMiddleware.handleValidationErrors(), this.authController.registerRestaurantOwner);
        // Login - supports both email and mobile number
        this.router.post('/login', AuthValidators_1.AuthValidators.login(), ValidationMiddleware_1.ValidationMiddleware.handleValidationErrors(), this.authController.login);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
