// locationController.ts

import { Context } from "hono";
import { LocationsService, getLocationService, createLocationService, 
    updateLocationService, deleteLocationService } from "../location/locationservice";

// List all locations
export const listLocations = async (c: Context) => {
    try {
        const data = await LocationsService(); // Call service function to fetch locations
        if (!data || data.length === 0) {
            return c.text("Locations not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get location by ID
export const getLocation = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const location = await getLocationService(id); // Call service function to get location by ID
    if (!location) {
        return c.text("Location not found", 404);
    }
    return c.json(location, 200);
}

// Create a new location
export const createLocation = async (c: Context) => {
    try {
        const location = await c.req.json(); // Get location data from request body

        const createdLocation = await createLocationService(location); // Call service function to create location
        if (!createdLocation) return c.text("Location not created", 404);

        return c.json({ msg: "Location created successfully", location: createdLocation }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update location by ID
export const updateLocation = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const locationData = await c.req.json(); // Get updated location data from request body
    try {
        const updatedLocation = await updateLocationService(id, locationData); // Call service function to update location
        if (!updatedLocation) return c.text("Location not updated", 404);

        return c.json({ msg: "Location updated successfully", location: updatedLocation }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete location by ID
export const deleteLocation = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedLocation = await deleteLocationService(id); // Call service function to delete location
        if (!deletedLocation) return c.text("Location not deleted", 404);

        return c.json({ msg: "Location deleted successfully", location: deletedLocation }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
