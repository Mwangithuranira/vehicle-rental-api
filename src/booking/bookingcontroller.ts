import { Context } from "hono";
import { reviewsService, getreviewService, createreviewService, updatereviewService, deletereviewService} from "./bookingservice";

export const listBooks = async (c: Context) => {
    try {
        //limit the number of Books to be returned

        const limit = Number(c.req.query('limit'))

        const data = await reviewsService(limit);
        if (data == null || data.length == 0) {
            return c.text("review not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const review = await getreviewService(id);
    if (review == undefined) {
        return c.text("review not found", 404);
    }
    return c.json(review, 200);
}

export const createBook = async (c: Context) => {
    try {
        const review = await c.req.json();
        const createdreview = await createreviewService(review);


        if (!createdreview) return c.text("review not created", 404);
        return c.json({ msg: createdreview }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const review = await c.req.json();
    try {
        // search for the Book
        const searchedreview = await getreviewService(id);
        if (searchedreview == undefined) return c.text("review not found", 404);
        // get the data and update it
        const res = await updatereviewService(id, review);
        // return a success message
        if (!res) return c.text("review not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteBook = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the review
        const review = await getreviewService(id);
        if(review == undefined) return c.text("review not found", 404);
        //deleting the review
        const res = await deletereviewService(id);
        if (!res) return c.text("review not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}