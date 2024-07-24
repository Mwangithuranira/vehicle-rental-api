// ticketRouter.ts

import { Hono } from "hono";
import { listTickets, getTicket, createTicket, updateTicket, deleteTicket } from "../ticket/ticketcontroller";
import { CustomerSupportTicketsValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

 const ticketRouter = new Hono();

ticketRouter.post("/tickets", zValidator('json', CustomerSupportTicketsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createTicket);

ticketRouter.get("/tickets", listTickets);

ticketRouter.get("/tickets/:id", getTicket);

ticketRouter.put("/tickets/:id", zValidator('json', CustomerSupportTicketsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateTicket);

ticketRouter.delete("/tickets/:id", deleteTicket);


export default ticketRouter;
