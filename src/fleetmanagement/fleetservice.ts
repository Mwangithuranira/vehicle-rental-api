// fleetManagementService.ts

import { TIFleetManagement, TUFleetManagement, fleetmanagement, } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

// Get all fleet management entries
export const getAllFleetManagementService = async () => {
    return await db.query.fleetmanagement.findMany(
        {
            columns:{
                acquisition_date:true,
                depreciation_rate:true,
                maintenance_cost:true,
                current_value:true
            },
            with:{
                vehicle:{
                    columns:{
                        rental_rate:true,
                        availability:true
                    },
                },
            }
        }
    );
}

// Get fleet management by ID
export const getFleetManagementByIdService = async (id: number)=> {
    return await db.query.fleetmanagement.findFirst({
        where: eq(fleetmanagement.id, id),

        columns:{
            acquisition_date:true,
            depreciation_rate:true,
            maintenance_cost:true,
            current_value:true
        
        },
        with:{
            vehicle:{
                columns:{
                    rental_rate:true,
                    availability:true
                },
              
            },
            
            
        }
       
  
    });
}

// Create fleet management entry
export const createFleetManagementService = async (fleetManagement: TIFleetManagement): Promise<string> => {
    await db.insert(fleetmanagement).values(fleetManagement);
    return "Fleet management entry created successfully";
}

// Update fleet management by ID
export const updateFleetManagementByIdService = async (id: number, fleetManagement: TIFleetManagement): Promise<string> => {
    await db.update(fleetmanagement).set(fleetManagement).where(eq(fleetmanagement.id, id));
    return "Fleet management entry updated successfully";
}

// Delete fleet management by ID
export const deleteFleetManagementByIdService = async (id: number): Promise<string> => {
    await db.delete(fleetmanagement).where(eq(fleetmanagement.id, id));
    return "Fleet management entry deleted successfully";
}
