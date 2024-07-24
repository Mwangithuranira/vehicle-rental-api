import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TILocation, TULocation, Locations } from '../drizzle/schema';

// Get all locations
export const LocationsService = async (limit?: number): Promise<TILocation[]> => {
    if (limit)
        return await db.query.Locations.findMany({
            limit: limit
        });
    return await db.query.Locations.findMany(
        {
            columns:{
                id:true,
                location_name:true,
                
                address:true,
                contact_phone:true
            },
            with:{
                bookings:{
                    columns:{
                        booking_date:true,
                        return_date:true,
                        total_amount:true,
                        booking_status:true
                    }
                }
            }
        }
    );
}

// Get location by ID
export const getLocationService = async (id: number) => {
    return await db.query.Locations.findFirst({
        where: eq(Locations.id, id),
        columns:{
            location_name:true,
            address:true,
            contact_phone:true
        },
        with:{
            bookings:{
                columns:{
                    booking_date:true,
                    return_date:true,
                    total_amount:true,
                    booking_status:true
                }
            }
            }
        
      
        
    });
}

// Create a new location
export const createLocationService = async (location: TILocation) => {
    await db.insert(Locations).values(location);
    return "Location created successfully";
}

// Update a location by ID
export const updateLocationService = async (id: number, location: TILocation) => {
    await db.update(Locations).set(location).where(eq(Locations.id, id));
    return "Location updated successfully";
}

// Delete a location by ID
export const deleteLocationService = async (id: number) => {
    await db.delete(Locations).where(eq(Locations.id, id));
    return "Location deleted successfully";
}

