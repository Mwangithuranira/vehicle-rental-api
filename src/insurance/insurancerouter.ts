// insuranceRouter.ts

import { Hono } from "hono";
import { listInsurance, getInsurance, createInsurance, updateInsurance, deleteInsurance } from "../insurance/insurancecontroller";
import { VehicleInsuranceValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";
import e from "express";

const insuranceRouter = new Hono();

insuranceRouter.post("/insurances", zValidator('json', VehicleInsuranceValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createInsurance);

insuranceRouter.get("/insurances", listInsurance);

insuranceRouter.get("/insurances/:id", getInsurance);

insuranceRouter.put("/insurances/:id", zValidator('json', VehicleInsuranceValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateInsurance);

insuranceRouter.delete("/insurances/:id", deleteInsurance);


export default insuranceRouter;
