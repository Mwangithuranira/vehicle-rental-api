// AuthRouter.ts

import { Hono } from 'hono';
import * as AuthController from './authcontroller'; // Adjust the path based on your project structure

 const AuthRouter = new Hono();
 

AuthRouter.post('/register', AuthController.registerUser);
AuthRouter.post('/login', AuthController.loginUser);
AuthRouter.post('/forgotpassword', AuthController.forgotPassword);
AuthRouter.post('/resetpassword', AuthController.resetPassword);
AuthRouter.post('/changepassword', AuthController.changePassword);
AuthRouter.post('/verifyemail', AuthController.verifyEmail);
AuthRouter.post('/resendverification-email', AuthController.resendVerificationEmail);
AuthRouter.post('/logout', AuthController.logoutUser);


export default AuthRouter;
