// vehicleSpecificationRouter.ts

import { Hono } from "hono";
import { listVehicleSpecifications, getVehicleSpecification,
     createVehicleSpecification, updateVehicleSpecification, deleteVehicleSpecification } from "../vehiclespec/vehiclespecController";
import { VehicleSpecificationsValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

 const vehicleSpecificationRouter = new Hono();

vehicleSpecificationRouter.post("/vehiclespecifications", zValidator('json', VehicleSpecificationsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createVehicleSpecification);

vehicleSpecificationRouter.get("/vehiclespecifications", listVehicleSpecifications);

vehicleSpecificationRouter.get("/vehiclespecifications/:id", getVehicleSpecification);

vehicleSpecificationRouter.put("/vehiclespecifications/:id", zValidator('json', VehicleSpecificationsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateVehicleSpecification);

vehicleSpecificationRouter.delete("/vehiclespecifications/:id", deleteVehicleSpecification);



export default vehicleSpecificationRouter;
