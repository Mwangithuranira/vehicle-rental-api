import { Context } from "hono";
import { getAllVehiclesService, getVehicleByIdService, VehicleService, updateVehicleByIdService, deleteVehicleByIdService } from "../vehicle/vehicleservice";
import client from "../config";
// List all vehicles
export const listVehicles = async (c: Context) => {
    try {
        const data = await getAllVehiclesService(); // Call service function to fetch vehicles
        if (!data || data.length === 0) {
            return c.text("Vehicles not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        
        return c.json({ error: error?.message }, 400);
    }
}


// Get vehicle by ID
export const getVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicle = await getVehicleByIdService(id); // Call service function to get vehicle by ID
    if (!vehicle) {
        return c.text("Vehicle not found", 404);
    }
    return c.json(vehicle, 200);
}

// Create a new vehicle
const vehicleService = new VehicleService(client);

export const createVehicle = async (c: Context) => {
    try {
        const vehicles = await c.req.json(); // Expecting a structured JSON input

        // Ensure vehicleSpecs is not undefined
        if (!vehicles) {
            throw new Error('vehicle is undefined');
        }

        const createdVehicle = await vehicleService.createVehicle(vehicles); // Create a vehicle with the provided data

        if (!createdVehicle) return c.text("Vehicle not created", 404);
        return c.json({ msg: createdVehicle }, 201); // Return the created vehicle with status 201

    } catch (error: any) {
        return c.json({ error: error?.message }, 400); // Return an error with status 400
    }
};



// Update vehicle by ID
export const updateVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicleData = await c.req.json(); // Get updated vehicle data from request body
    try {
        const updatedVehicle = await updateVehicleByIdService(id, vehicleData); // Call service function to update vehicle
        if (!updatedVehicle) return c.text("Vehicle not updated", 404);

        return c.json({ msg: "Vehicle updated successfully", vehicle: updatedVehicle }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete vehicle by ID
export const deleteVehicle = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedVehicle = await deleteVehicleByIdService(id); // Call service function to delete vehicle
        if (!deletedVehicle) return c.text("Vehicle not deleted", 404);

        return c.json({ msg: "Vehicle deleted successfully", vehicle: deletedVehicle }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
