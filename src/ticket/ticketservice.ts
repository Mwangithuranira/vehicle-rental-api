// ticketService.ts

import { TICustomerSupportTicket, TUCustomerSupportTicket, CustomerSupportTickets } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

// Get all tickets
export const TicketsService = async (): Promise<TICustomerSupportTicket[]> => {
    return await db.query.CustomerSupportTickets.findMany();
}

// Get ticket by ID
export const getTicketByIdService = async (id: number) => {
    return await db.query.CustomerSupportTickets.findFirst({
        where: eq(CustomerSupportTickets.id, id),

        columns:{
            ticket_subject:true,
            ticket_description:true,
            ticket_status:true
        },
        with:{
            user:{
                columns:{
                    full_name:true,
                    phone_number:true,
                    address:true,
                    email:true
                }
            }
        }
    });
}

// Create ticket
export const createTicketService = async (ticket: TICustomerSupportTicket): Promise<string> => {
    await db.insert(CustomerSupportTickets).values(ticket);
    return "Ticket created successfully";
}

// Update ticket by ID
export const updateTicketByIdService = async (id: number, ticket: TICustomerSupportTicket): Promise<string> => {
    await db.update(CustomerSupportTickets).set(ticket).where(eq(CustomerSupportTickets.id, id));
    return "Ticket updated successfully";
}

// Delete ticket by ID
export const deleteTicketByIdService = async (id: number): Promise<string> => {
    await db.delete(CustomerSupportTickets).where(eq(CustomerSupportTickets.id, id));
    return "Ticket deleted successfully";
}
