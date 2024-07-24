// locationRouter.ts

import { Hono } from "hono";
import { listLocations, getLocation, createLocation, updateLocation, deleteLocation } from "../location/locationcontroller";
import { LocationsValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";
import e from "express";

 const locationRouter = new Hono();

locationRouter.post("/locations", zValidator('json', LocationsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createLocation);

locationRouter.get("/locations", listLocations);

locationRouter.get("/locations/:id", getLocation);

locationRouter.put("/locations/:id", zValidator('json', LocationsValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateLocation);

locationRouter.delete("/locations/:id", deleteLocation);


export default locationRouter;
