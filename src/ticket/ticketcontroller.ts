import { Context } from "hono";
import { TicketsService, getTicketByIdService, createTicketService, 
    updateTicketByIdService, deleteTicketByIdService } from "../ticket/ticketservice";

// List all tickets
export const listTickets = async (c: Context) => {
    try {
        const data = await TicketsService(); // Call service function to fetch tickets
        if (!data || data.length === 0) {
            return c.text("Tickets not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get ticket by ID
export const getTicket = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const ticket = await getTicketByIdService(id); // Call service function to get ticket by ID
    if (!ticket) {
        return c.text("Ticket not found", 404);
    }
    return c.json(ticket, 200);
}

// Create a new ticket
export const createTicket = async (c: Context) => {
    try {
        const ticket = await c.req.json(); // Get ticket data from request body

        const createdTicket = await createTicketService(ticket); // Call service function to create ticket
        if (!createdTicket) return c.text("Ticket not created", 404);

        return c.json({ msg: "Ticket created successfully", ticket: createdTicket }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update ticket by ID
export const updateTicket = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const ticketData = await c.req.json(); // Get updated ticket data from request body
    try {
        const updatedTicket = await updateTicketByIdService(id, ticketData); // Call service function to update ticket
        if (!updatedTicket) return c.text("Ticket not updated", 404);

        return c.json({ msg: "Ticket updated successfully", ticket: updatedTicket }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete ticket by ID
export const deleteTicket = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedTicket = await deleteTicketByIdService(id); // Call service function to delete ticket
        if (!deletedTicket) return c.text("Ticket not deleted", 404);

        return c.json({ msg: "Ticket deleted successfully", ticket: deletedTicket }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
