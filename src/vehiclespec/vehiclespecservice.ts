// vehicleSpecificationService.ts

import { TIVehicleSpecification, vehiclespecifications } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

// Get all vehicle specifications
export const getAllVehicleSpecificationsService = async (): Promise<TIVehicleSpecification[]> => {
    return await db.query.vehiclespecifications.findMany();
}

// Get vehicle specification by ID
export const getVehicleSpecificationByIdService = async (id: number) => {
    return await db.query.vehiclespecifications.findFirst({
        where: eq(vehiclespecifications.id, id),

        columns:{
            manufacturer:true,
            model:true,
            year:true,
            fuel_type:true,
            engine_capacity:true,
            transmission:true,
            seating_capacity:true,
            color:true,
            price:true
        },
        with:{
            vehicles:{
                columns:{
                  rental_rate:true,
                    availability:true,
                  
                }
            
            }
        }
    });
}

// Create vehicle specification
export const createVehicleSpecificationService = async (specification: TIVehicleSpecification): Promise<string> => {
    await db.insert(vehiclespecifications).values(specification);
    return "Vehicle specification created successfully";
}

// Update vehicle specification by ID
export const updateVehicleSpecificationByIdService = async (id: number, specification: TIVehicleSpecification): Promise<string> => {
    await db.update(vehiclespecifications).set(specification).where(eq(vehiclespecifications.id, id));
    return "Vehicle specification updated successfully";
}

// Delete vehicle specification by ID
export const deleteVehicleSpecificationByIdService = async (id: number): Promise<string> => {
    await db.delete(vehiclespecifications).where(eq(vehiclespecifications.id, id));
    return "Vehicle specification deleted successfully";
}
