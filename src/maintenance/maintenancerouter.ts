// maintenanceRouter.ts

import { Hono } from "hono";
import { listMaintenances, getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } from "../maintenance/maintenancecontroller";
import { VehicleMaintenanceValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

 const maintenanceRouter = new Hono();

maintenanceRouter.post("/maintenances", zValidator('json', VehicleMaintenanceValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createMaintenance);

maintenanceRouter.get("/maintenances", listMaintenances);

maintenanceRouter.get("/maintenances/:id", getMaintenance);

maintenanceRouter.put("/maintenances/:id", zValidator('json', VehicleMaintenanceValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateMaintenance);

maintenanceRouter.delete("/maintenances/:id", deleteMaintenance);


export default maintenanceRouter;
