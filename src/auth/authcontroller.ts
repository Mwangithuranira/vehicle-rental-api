// authController.ts

import { Context } from 'hono';
import { AuthService } from './authservice';
import client from '../config';

const authService = new AuthService(client);

export const registerUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    const registeredUser = await authService.registerUser(user);
    if (!registeredUser) return c.text('User not registered', 500);

    return c.json({ msg: registeredUser }, 201); // Return the created user with status 201
  } catch (error: any) {
    return c.json({ error: error?.message }, 400); // Return an error with status 400
  }
};

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const token = await authService.loginUser(email, password);

    if (!token) return c.text('Invalid email or password', 401);

    return c.json({ token }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const forgotPassword = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const resetToken = await authService.forgotPassword(email);

    if (!resetToken) return c.text('User not found', 404);

    return c.text('Password reset email sent', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const resetPassword = async (c: Context) => {
  try {
    const { email, token, newPassword } = await c.req.json();
    const passwordReset = await authService.resetPassword(email, token, newPassword);

    if (!passwordReset) return c.text('Invalid or expired token', 400);

    return c.text('Password reset successfully', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const changePassword = async (c: Context) => {
  try {
    const { email, oldPassword, newPassword } = await c.req.json();
    const passwordChanged = await authService.changePassword(email, oldPassword, newPassword);

    if (!passwordChanged) return c.text('Invalid old password', 400);

    return c.text('Password changed successfully', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const verifyEmail = async (c: Context) => {
  try {
    const { email, token } = await c.req.json();
    const emailVerified = await authService.verifyEmail(email, token);

    if (!emailVerified) return c.text('Invalid or expired token', 400);

    return c.text('Email verified successfully', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const resendVerificationEmail = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const verificationEmailResent = await authService.resendVerificationEmail(email);

    if (!verificationEmailResent) return c.text('User not found', 404);

    return c.text('Verification email resent', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const logoutUser = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const logout = await authService.logoutUser(email);

    if (!logout) return c.text('Logout failed', 500);

    return c.text('Logged out successfully', 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
