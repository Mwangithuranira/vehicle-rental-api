import { Hono } from "hono";
import { listUsers, getUser,registerUser, updateUser, deleteUser } from "./usercontroller";
import { UsersValidator } from "../validator";
import { zValidator } from "@hono/zod-validator";

const userRouter = new Hono();

// Create user with validation
userRouter.post("/", zValidator('json', UsersValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), registerUser);

// List all users
userRouter.get("/", listUsers);



// Get a user by ID
userRouter.get("/:id", getUser);

// Update a user by ID with validation
userRouter.put("/:id", zValidator('json', UsersValidator, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateUser);

// Delete a user by ID
userRouter.delete("/:id", deleteUser);

export default userRouter;
