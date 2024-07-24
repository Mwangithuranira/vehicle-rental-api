import db from "../drizzle/db"
import { Bookings } from "../drizzle/schema"
import {TIBookings,TSBookings } from "../drizzle/schema"
import {   eq } from "drizzle-orm";



export const reviewsService = async (limit?: number): Promise<TSBookings[] | null> => {
    if (limit) {
        return await db.query.Bookings .findMany({
            limit: limit,
            with:{
                user:true,
                vehicle:true,
                location:true,
                payments:true,
            }
        });
    }
    return await db.query.Bookings .findMany({
        with:{
            user:true,
            vehicle:true,
            location:true,
            payments:true,
        }
    });
}
export const getreviewService = async (id: number): Promise<TIBookings | undefined>=> {
    return await db.query.Bookings .findFirst({
        where: eq(Bookings .id, id),
        with:{
            user:true,
            vehicle:true,
            location:true,
            payments:true,
        }
    })
}


export const createreviewService = async (review: TIBookings) => {
    const [createdBooking] = await db.insert(Bookings ).values(review).returning();
    return createdBooking;
};


export const updatereviewService = async (id: number, review: TIBookings) => {
    await db.update(Bookings ).set(review).where(eq(Bookings .id, id))
    return "Booking updated successfully";
}

export const deletereviewService = async (id: number) => {
    await db.delete(Bookings ).where(eq(Bookings .id, id))
    return "Booking deleted successfully";
}