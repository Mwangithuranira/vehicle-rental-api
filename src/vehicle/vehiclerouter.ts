// vehicleRouter.ts

import { Hono } from "hono";
import { listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from "../vehicle/vehiclecontroller";
import { VehiclesValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";
import e from "express";

 const vehicleRouter = new Hono();

vehicleRouter.post("/vehicles", zValidator('json', VehiclesValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}),
 createVehicle);

vehicleRouter.get("/vehicles", listVehicles);

vehicleRouter.get("/vehicles/:id", getVehicle);

vehicleRouter.put("/vehicles/:id", zValidator('json',VehiclesValidator , (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateVehicle);

vehicleRouter.delete("/vehicles/:id", deleteVehicle);


export default vehicleRouter;
