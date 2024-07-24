

import { Context } from "hono";
import { UsersService, getUserService,AuthService ,getUserByNameService, updateUserService, 
    deleteUserService } from "../users/userservice";
import bycrpt from 'bcrypt';
import client from "../config";




const authService = new AuthService(client);

export const registerUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    const registeredUser = await authService.registerUser(user);
    if (!registeredUser) return c.text('User not registered', 500);

    return c.json({ msg: registeredUser }, 201); // Return the created user with status 201
  } catch (error: any) {
    return c.json({ error: error?.message }, 400); // Return an error with status 400
  }
};




export const listUsers = async (c: Context) => {
    try {
        //limit the number of users to be returned

        const limit = Number(c.req.query('limit'))

        const data = await UsersService(limit);
        if (data == null || data.length == 0) {
            return c.text("User not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getUser = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const user = await getUserService(id);
    if (user == undefined) {
        return c.text("User not found", 404);
    }
    return c.json(user, 200);
}

export const updateUser = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const user = await c.req.json();
    try {
        // search for the user
        const searchedUser = await getUserService(id);
        if (searchedUser == undefined) return c.text("User not found", 404);
        // get the data and update it
        const res = await updateUserService(id, user);
        // return a success message
        if (!res) return c.text("User not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

 // Adjust import based on your setup

export const deleteUser = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        // Search for the user
        const user = await getUserService(id);
        if (user === undefined) return c.text("User not found", 404);
        
        // Deleting the user (cascading deletes should handle related records)
        const res = await deleteUserService(id);
        if (!res) return c.text("User not deleted", 404);

        return c.json({ msg: "User deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};

// Get user by name
export const GetUser= async (c: Context) => {
    const name = c.req.param("name");
    if (!name) return c.text("Invalid name", 400);

    const user = await getUserByNameService(name);
    if (user == undefined) {
        return c.text("User not found", 404);
    }
    return c.json(user, 200);
};