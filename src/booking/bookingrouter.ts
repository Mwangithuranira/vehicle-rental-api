// bookingRouter.ts

import { Hono } from "hono";
import { listBooks, getBook, createBook, updateBook, deleteBook } from "../booking/bookingcontroller";
import { BookingsValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

 const bookingRouter = new Hono();

bookingRouter.post("/bookings", zValidator('json', BookingsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createBook);

bookingRouter.get("/bookings", listBooks);

bookingRouter.get("/bookings/:id", getBook);

bookingRouter.put("/bookings/:id", zValidator('json', BookingsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateBook);

bookingRouter.delete("/bookings/:id",deleteBook);


export default bookingRouter;
