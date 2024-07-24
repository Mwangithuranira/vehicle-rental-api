// fleetManagementRouter.ts

import { Hono } from "hono";
import { listFleetManagement, getFleetManagement, createFleetManagement, updateFleetManagement, deleteFleetManagement } from "../fleetmanagement/fleetcontroller";
import { FleetManagementValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

const fleetManagementRouter = new Hono();

fleetManagementRouter.post("/fleetmanagements", zValidator('json', FleetManagementValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createFleetManagement);

fleetManagementRouter.get("/fleetmanagements", listFleetManagement);

fleetManagementRouter.get("/fleetmanagements/:id", getFleetManagement);

fleetManagementRouter.put("/fleetmanagements/:id", zValidator('json', FleetManagementValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateFleetManagement);

fleetManagementRouter.delete("/fleetmanagements/:id", deleteFleetManagement);


export default fleetManagementRouter;
