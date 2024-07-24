// insuranceService.ts

import { TIVehicleInsurance, TUVehicleInsurance, VehicleInsurance } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

// Get all insurances
export const getAllInsurancesService = async (): Promise<TIVehicleInsurance[]> => {
    return await db.query.VehicleInsurance.findMany(
        {
            columns:{
                id:true,
                provider:true,
                policy_number:true,
                coverage:true,
                start_date:true,
                end_date:true
            },
            with:{
                vehicle:{
                    columns:{
                        rental_rate:true,
                        availability:true
                    }
                }
                
            }
        }
    );
}

// Get insurance by ID
export const getInsuranceByIdService = async (id: number) => {
    return await db.query.VehicleInsurance.findFirst({
        where: eq(VehicleInsurance.id, id),

        columns:{
            id:true,
            provider:true,
            policy_number:true,
            coverage:true,
            start_date:true,
            end_date:true
        },
        with:{
            vehicle:{
                columns:{
                    rental_rate:true,
                    availability:true
                }
            }
            
        }

    });
}

// Create insurance
export const createInsuranceService = async (insurance: TIVehicleInsurance): Promise<string> => {
    await db.insert(VehicleInsurance).values(insurance);
    return "Insurance created successfully";
}

// Update insurance by ID
export const updateInsuranceByIdService = async (id: number, insurance: TIVehicleInsurance): Promise<string> => {
    await db.update(VehicleInsurance).set(insurance).where(eq(VehicleInsurance.id, id));
    return "Insurance updated successfully";
}

// Delete insurance by ID
export const deleteInsuranceByIdService = async (id: number): Promise<string> => {
    await db.delete(VehicleInsurance).where(eq(VehicleInsurance.id, id));
    return "Insurance deleted successfully";
}
