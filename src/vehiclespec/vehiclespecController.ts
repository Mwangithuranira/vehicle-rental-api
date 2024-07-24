import { Context } from "hono";
import { getAllVehicleSpecificationsService, getVehicleSpecificationByIdService, createVehicleSpecificationService,
     updateVehicleSpecificationByIdService, deleteVehicleSpecificationByIdService } from "../vehiclespec/vehiclespecservice";

// List all vehicle specifications
export const listVehicleSpecifications = async (c: Context) => {
    try {
        const data = await getAllVehicleSpecificationsService(); // Call service function to fetch vehicle specifications
        if (!data || data.length === 0) {
            return c.text("Vehicle specifications not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get vehicle specification by ID
export const getVehicleSpecification = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicleSpecification = await getVehicleSpecificationByIdService(id); // Call service function to get vehicle specification by ID
    if (!vehicleSpecification) {
        return c.text("Vehicle specification not found", 404);
    }
    return c.json(vehicleSpecification, 200);
}

// Create a new vehicle specification
export const createVehicleSpecification = async (c: Context) => {
    try {
        const vehicleSpecification = await c.req.json(); // Get vehicle specification data from request body

        const createdVehicleSpecification = await createVehicleSpecificationService(vehicleSpecification); // Call service function to create vehicle specification
        if (!createdVehicleSpecification) return c.text("Vehicle specification not created", 404);

        return c.json({ msg: "Vehicle specification created successfully", vehicleSpecification: createdVehicleSpecification }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update vehicle specification by ID
export const updateVehicleSpecification = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicleSpecificationData = await c.req.json(); // Get updated vehicle specification data from request body
    try {
        const updatedVehicleSpecification = await updateVehicleSpecificationByIdService(id, vehicleSpecificationData); // Call service function to update vehicle specification
        if (!updatedVehicleSpecification) return c.text("Vehicle specification not updated", 404);

        return c.json({ msg: "Vehicle specification updated successfully", vehicleSpecification: updatedVehicleSpecification }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete vehicle specification by ID
export const deleteVehicleSpecification = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedVehicleSpecification = await deleteVehicleSpecificationByIdService(id); // Call service function to delete vehicle specification
        if (!deletedVehicleSpecification) return c.text("Vehicle specification not deleted", 404);

        return c.json({ msg: "Vehicle specification deleted successfully", vehicleSpecification: deletedVehicleSpecification }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
