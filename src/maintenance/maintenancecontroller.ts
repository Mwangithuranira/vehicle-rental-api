import { Context } from "hono";
import { getAllVehicleMaintenanceService,getVehicleMaintenanceByIdService , createVehicleMaintenanceService,deleteVehicleMaintenanceByIdService, updateVehicleMaintenanceByIdService } from "../maintenance/maintenanceservice";

// List all maintenance records
export const listMaintenances = async (c: Context) => {
    try {
        const data = await getAllVehicleMaintenanceService(); // Call service function to fetch maintenance records
        if (!data || data.length === 0) {
            return c.text("Maintenance records not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get maintenance record by ID
export const getMaintenance = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const maintenance = await getVehicleMaintenanceByIdService(id); // Call service function to get maintenance record by ID
    if (!maintenance) {
        return c.text("Maintenance record not found", 404);
    }
    return c.json(maintenance, 200);
}

// Create a new maintenance record
export const createMaintenance = async (c: Context) => {
    try {
        const maintenance = await c.req.json(); // Get maintenance record data from request body

        const maintenances=new Date(maintenance.maintenance_date);
        maintenance.maintenance_date=maintenances;

        const createdMaintenance = await createVehicleMaintenanceService(maintenance); // Call service function to create maintenance record
        if (!createdMaintenance) return c.text("Maintenance record not created", 404);

        return c.json({ msg: "Maintenance record created successfully", maintenance: createdMaintenance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update maintenance record by ID
export const updateMaintenance = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const maintenanceData = await c.req.json(); // Get updated maintenance record data from request body
    try {
        const updatedMaintenance = await updateVehicleMaintenanceByIdService(id, maintenanceData); // Call service function to update maintenance record
        if (!updatedMaintenance) return c.text("Maintenance record not updated", 404);

        return c.json({ msg: "Maintenance record updated successfully", maintenance: updatedMaintenance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete maintenance record by ID
export const deleteMaintenance = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedMaintenance = await deleteVehicleMaintenanceByIdService(id); // Call service function to delete maintenance record
        if (!deletedMaintenance) return c.text("Maintenance record not deleted", 404);

        return c.json({ msg: "Maintenance record deleted successfully", maintenance: deletedMaintenance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
