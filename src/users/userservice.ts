import { eq } from "drizzle-orm";
import  db  from "../drizzle/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/mail';
import { TIUser, TUUser, Users,} from '../drizzle/schema';
import client from "../config";


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
    
      id:true,
      fullName: newUser.full_name,
      address: newUser.address,
      phoneNumber: newUser.phone_number,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image_url
    };
  }}


//get all users

export const UsersService = async (limit?: number) => {
    if (limit)
    return await db.query.Users.findMany({
         limit: limit
    });
    return await db.query.Users.findMany(
        {

            
            columns:{
                id:true,
                full_name:true,
                phone_number:true,
                role:true,
                address:true,
                email:true
            },
         
        }
        
    );
}


export const getUserService = async (id: number) => {
    return await db.query.Users.findFirst({
        where: eq(Users.id, id  ),

        columns:{
            id:true,
            full_name:true,
            phone_number:true,
            address:true,
            email:true
        },
        
                
           
         
})};


//get user by name
export const getUserByNameService = async (full_name: string): Promise<TIUser | undefined> => {
    return await db.query.Users.findFirst({
        where: eq(Users.full_name,full_name)
    })
}





export const updateUserService = async (id: number, user: TIUser) => {
    await db.update(Users).set(user).where(eq(Users.id, id))
    return "User updated successfully";
}

export const deleteUserService = async (id: number) => {
    await db.delete(Users).where(eq(Users.id, id))
    return "User deleted successfully";
}

export const GetUserService = async (full_name:string): Promise<TIUser | undefined> => {
    return await db.query.Users.findFirst({
        where: eq(Users.full_name,full_name )
    })
}