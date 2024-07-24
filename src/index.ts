import "dotenv/config";
import { serve } from '@hono/node-server';
import { Hono, Context } from 'hono';
import { cors } from 'hono/cors';
import { Client } from 'pg';
import { AuthService } from './auth/authservice';
import AuthRouter from './auth/authrouter';
import userRouter from './users/userrouter';
import bookingRouter from './booking/bookingrouter';
import insuranceRouter from './insurance/insurancerouter';
import fleetManagementRouter from './fleetmanagement/fleetrouter';
import paymentRouter from './payment/paymentrouter';
import ticketRouter from './ticket/ticketrouter';
import maintenanceRouter from './maintenance/maintenancerouter';

import vehicleSpecificationRouter from './vehiclespec/vehiclespecrouter';
import vehicleRouter from './vehicle/vehiclerouter';
import locationRouter from './location/locationrouter';
import jwt from 'jsonwebtoken';








const app = new Hono();
const client = new Client({
    connectionString: process.env.Database_URL,  
});


async function startServer() {

    try {
        
        await client.connect();
        console.log('Connected to PostgreSQL database');

        const authService = new AuthService(client);

        // Middleware functions
        const authenticate = async (c: Context, next: () => Promise<void>) => {
            const authorization = c.req.header('Authorization'); // Capitalize 'Authorization'
            const token = authorization?.replace('Bearer ', '');

            if (!token) {
                return c.json({ message: 'Unauthorized' }, 401);
            }


            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, role: 'user' | 'admin' | 'super_user' };
                c.set('userId', decoded.userId);
                c.set('role', decoded.role);
                await next();
            } catch (error) {
                return c.json({ message: 'Invalid token' }, 401);
            }
        };


        const errorHandler = async (c: Context, next: () => Promise<void>) => {
            try {
                await next();
            } catch (err) {
                console.error(err);
                c.json({ message: 'Internal server error' }, 500);
            }
        };

        const authorize = (roles: string[]) => {
            return async (c: Context, next: () => Promise<void>) => {
                const role = c.get('role');
                if (!roles.includes(role)) {
                    return c.json({ message: 'Forbidden' }, 403);
                    
                }
                await next();
            };
        };


        // CORS Middleware

        app.use('/*', cors());

        app.use('*', errorHandler);

        
        // Apply authentication middleware to routes
       
        app.use('/api/*', authenticate);

        app.route('/auth', AuthRouter); // Mount auth routes
        app.route('/api/users', userRouter); // Mount user routes

        // Apply authorization middleware to routes for both user and admin
        app.route('/api', bookingRouter).use(authorize(['user', 'admin'])); // Mount booking routes
        app.route('/api', paymentRouter).use(authorize(['user', 'admin'])); // Mount payment routes
        app.route('/api', locationRouter).use(authorize(['user', 'admin'])); // Mount location routes
        app.route('/api', vehicleRouter).use(authorize(['user', 'admin'])); // Mount vehicle routes

    


        

        // Routes accessible only to 'admin'
        app.route('/api', insuranceRouter).use(authorize(['admin'])); // Mount insurance routes
        app.route('/api', fleetManagementRouter).use(authorize(['admin'])); // Mount fleet management routes
        app.route('/api', ticketRouter).use(authorize(['admin'])); // Mount ticket routes
        app.route('/api', maintenanceRouter).use(authorize(['admin'])); // Mount maintenance routes
        // Mount vehicle image routes
        app.route('/api', vehicleSpecificationRouter).use(authorize(['admin'])); // Mount vehicle specification routes

        console.log(`Server is running on port ${process.env.PORT}`);
        const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;
        serve({



            fetch: app.fetch,
            port: port
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

startServer();
