// maintenanceService.ts

import { TIVehicleMaintenance, TUVehicleMaintenance, VehicleMaintenance } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

// Get all maintenance records
export const getAllVehicleMaintenanceService = async (): Promise<TIVehicleMaintenance[]> => {
    return await db.query.VehicleMaintenance.findMany(
        
    );
}

// Get maintenance record by ID
export const getVehicleMaintenanceByIdService = async (id: number)=> {
    return await db.query.VehicleMaintenance.findFirst({
        where: eq(VehicleMaintenance.id, id),
        columns:{
            maintenance_type:true,
            maintenance_cost:true,
            maintenance_date:true
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

// Create maintenance record
export const createVehicleMaintenanceService = async (maintenance: TIVehicleMaintenance): Promise<string> => {
    await db.insert(VehicleMaintenance).values(maintenance);
    return "Vehicle maintenance record created successfully";
}

// Update maintenance record by ID
export const updateVehicleMaintenanceByIdService = async (id: number, maintenance: TIVehicleMaintenance): Promise<string> => {
    await db.update(VehicleMaintenance).set(maintenance).where(eq(VehicleMaintenance.id, id));
    return "Vehicle maintenance record updated successfully";
}

// Delete maintenance record by ID
export const deleteVehicleMaintenanceByIdService = async (id: number): Promise<string> => {
    await db.delete(VehicleMaintenance).where(eq(VehicleMaintenance.id, id));
    return "Vehicle maintenance record deleted successfully";
}
