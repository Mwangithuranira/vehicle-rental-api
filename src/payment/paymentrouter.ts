// paymentRouter.ts

import { Hono } from "hono";
import { listpayments, getpayment, createPayment, updatepayment, deletepayment } from "../payment/paymentcontroller";
import { PaymentsValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

 const paymentRouter = new Hono();

paymentRouter.post("/payments", createPayment.createCheckoutSession);

paymentRouter.get("/payments",listpayments);

paymentRouter.get("/payments/:id", getpayment);

paymentRouter.put("/payments/:id", zValidator('json', PaymentsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updatepayment);

paymentRouter.delete("/payments/:id", deletepayment);


export default paymentRouter;
