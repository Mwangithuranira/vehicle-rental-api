import { z } from 'zod';

export const UsersValidator = z.object({
    
    full_name: z.string().nonempty({ message: "Required" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    address: z.string().nonempty({ message: "Required" }),
    phone_number: z.string().nonempty({ message: "Required" }),
    role: z.enum(['user', 'super_user', 'admin']).optional(),
    image_url: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    
});




export const VehiclesValidator = z.object({
   rental_rate: z.string(),
    manufacturer: z.string(),
    model: z.string(),
    image: z.string(),
    year: z.string(),
    fuel_type: z.string(),
    engine_capacity: z.string(),
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string(),
    


    price:z.number(),
    coverage: z.string(),
    policy_number: z.string(),
    provider: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    acquisition_date: z.string(),
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),

});





export const VehicleSpecificationsValidator = z.object({
    vehicle_id: z.number(),
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.number(), // Corrected spelling from `egine_capacity`
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string(),
});


export const BookingsValidator = z.object({
    user_id: z.string(), // Assuming user_id is a string in your database
    vehicle_id: z.number(),
    booking_date: z.string(), // Adjust as per your database date format
    return_date: z.string(), // Adjust as per your database date format
    total_amount: z.number(),
    location_id: z.string(),
   
   
    
    
   
  
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const PaymentsValidator = z.object({
    bookingId: z.number(),
    amount: z.number(),
   
  
   
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const AuthenticationsValidator = z.object({
    user_id: z.string().nonempty({ message: "Required" }), // Assuming user_id is a string in your database
    password: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const CustomerSupportTicketsValidator = z.object({
    user_id: z.string().nonempty({ message: "Required" }), // Assuming user_id is a string in your database
    full_name: z.string(),
    subject: z.string(),
    ticket_id: z.number(),
    description: z.string(), // Corrected spelling from `describtion`
    status: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const LocationsValidator = z.object({
    location_id: z.number(),
    location_name: z.string(),
    address: z.string(),
    contact_phone: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const FleetManagementValidator = z.object({
    vehicle_id: z.number(),
    acquisition_date: z.date(), // Corrected spelling from `aquisition_date`
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    status: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const VehicleImagesValidator = z.object({
    vehicle_id: z.number(),
    image_url: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const VehicleInsuranceValidator = z.object({
    vehicle_id: z.number(),
    insurance_provider: z.string(),
    insurance_type: z.string(),
    insurance_amount: z.number(),
    insurance_start_date: z.date(),
    insurance_end_date: z.date(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const VehicleMaintenanceValidator = z.object({
    vehicle_id: z.number(),
    maintenance_date: z.date(),
    maintenance_type: z.string(),
    maintenance_cost: z.number(),
    maintenance_description: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export const LoginValidator = z.object({
    emailOrUsername: z.string().min(1, 'Email or username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const ForgotPasswordValidator = z.object({
    email: z.string().email('Invalid email address'),
});

export const ResetPasswordValidator = z.object({
    resetToken: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});
