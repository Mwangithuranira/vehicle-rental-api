// AuthService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../config';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/mail';
import { Authentications, Users } from '../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { changePassword } from './authcontroller';

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Load JWT secret from environment

export class AuthService {
  constructor(private db = client) {}
  

  async registerUser(user: { full_name: string; email: string; password:
     string; address: string; phone_number: string; role: string; image_url: string }): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const result = await this.db.query(
      'INSERT INTO Users (full_name, email, address, phone_number, role, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.full_name, user.email, user.address, user.phone_number, user.role, user.image_url]
    );
  
    const newUser = result.rows[0];
  
    await this.db.query(
      'INSERT INTO Authentications (user_id, password) VALUES ($1, $2)',
      [newUser.id, hashedPassword]
    );

    sendWelcomeEmail(user.email);
  
    return {
      
      fullName: newUser.full_name,
      address: newUser.address,
      phoneNumber: newUser.phone_number,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image_url
    };
  }

  async loginUser(email: string, password: string): Promise<{token:string, user:string []}> {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    const authResult = await this.db.query('SELECT * FROM Authentications WHERE user_id = $1', [user.id]);
    const auth = authResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, auth.password);
    if (!passwordMatch) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '336h' });
    return {token, user: [user.id, user.full_name, user.email, user.address, user.phone_number, user.role, user.image_url]};
  }

  async forgotPassword(email: string) {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });

    await this.db.query(
      'UPDATE Users SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3',
      [resetToken, new Date(Date.now() + 15 * 60 * 1000), email]
    );

    return resetToken;
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.reset_token || new Date() > new Date(user.reset_token_expiration)) {
      throw new Error('Invalid or expired token');
    }
    

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.db.query(
      'UPDATE Authentications SET password = $1 WHERE user_id = $2',
      [hashedPassword, user.id]
    );

    await this.db.query('UPDATE Users SET reset_token = NULL, reset_token_expiration = NULL WHERE id = $1', [user.id]);

    return true;
  }

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    const authResult = await this.db.query('SELECT * FROM Authentications WHERE user_id = $1', [user.id]);
    const auth = authResult.rows[0];

    const passwordMatch = await bcrypt.compare(oldPassword, auth.password);
    if (!passwordMatch) throw new Error('Invalid old password');

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.db.query(
      'UPDATE Authentications SET password = $1 WHERE user_id = $2',
      [hashedPassword, user.id]
    );

    return true;
  }

  async verifyEmail(email: string, token: string) {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await this.db.query('UPDATE Users SET email_verified = TRUE WHERE id = $1', [user.id]);

    return true;
  }

  async resendVerificationEmail(email: string) {
    const result = await this.db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error('User not found');

    const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    sendPasswordResetEmail(email, verificationToken);

    return true;
  }

  async logoutUser(email: string) {
    // Implement logout logic if needed, such as invalidating the token
    // In a stateless JWT setup, logout is typically handled client-side by discarding the token.
    // Server-side, you may choose to do nothing or implement additional logic as needed.
    return true;
  }
}
