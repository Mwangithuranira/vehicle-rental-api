import { Context } from "hono";
import { getAllFleetManagementService, getFleetManagementByIdService, createFleetManagementService, updateFleetManagementByIdService, deleteFleetManagementByIdService } from "../fleetmanagement/fleetservice";

// List all fleet management entries
export const listFleetManagement = async (c: Context) => {
    try {
        const data = await getAllFleetManagementService(); // Call service function to fetch fleet management entries
        if (!data || data.length === 0) {
            return c.text("Fleet management entries not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get fleet management entry by ID
export const getFleetManagement = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const fleetManagement = await getFleetManagementByIdService(id); // Call service function to get fleet management entry by ID
    if (!fleetManagement) {
        return c.text("Fleet management entry not found", 404);
    }
    return c.json(fleetManagement, 200);
}

// Create a new fleet management entry
export const createFleetManagement = async (c: Context) => {
    try {
        const fleetManagement = await c.req.json(); // Get fleet management data from request body

        const fleetManagements=new Date(fleetManagement.acquisition_date);
        fleetManagement.acquisition_date=fleetManagements;
        
     

        const createdFleetManagement = await createFleetManagementService(fleetManagement); // Call service function to create fleet management entry
        if (!createdFleetManagement) return c.text("Fleet management entry not created", 404);

        return c.json({ msg: "Fleet management entry created successfully", fleetManagement: createdFleetManagement }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update fleet management entry by ID
export const updateFleetManagement = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const fleetManagementData = await c.req.json(); // Get updated fleet management data from request body
    try {
        const updatedFleetManagement = await updateFleetManagementByIdService(id, fleetManagementData); // Call service function to update fleet management entry
        if (!updatedFleetManagement) return c.text("Fleet management entry not updated", 404);

        return c.json({ msg: "Fleet management entry updated successfully", fleetManagement: updatedFleetManagement }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete fleet management entry by ID
export const deleteFleetManagement = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedFleetManagement = await deleteFleetManagementByIdService(id); // Call service function to delete fleet management entry
        if (!deletedFleetManagement) return c.text("Fleet management entry not deleted", 404);

        return c.json({ msg: "Fleet management entry deleted successfully", fleetManagement: deletedFleetManagement }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
