import { Context } from "hono";
import {getAllInsurancesService, getInsuranceByIdService, createInsuranceService, updateInsuranceByIdService, deleteInsuranceByIdService } from "../insurance/insuranceservice";

// List all insurance entries
export const listInsurance = async (c: Context) => {
    try {
        const data = await getAllInsurancesService(); // Call service function to fetch insurance entries
        if (!data || data.length === 0) {
            return c.text("Insurance entries not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Get insurance entry by ID
export const getInsurance = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const insurance = await getInsuranceByIdService(id); // Call service function to get insurance entry by ID
    if (!insurance) {
        return c.text("Insurance entry not found", 404);
    }
    return c.json(insurance, 200);
}

// Create a new insurance entry
export const createInsurance = async (c: Context) => {
    try {
        const insurance = await c.req.json(); // Get insurance data from request body

        const insurances=new Date(insurance.insurance_start_date);
        insurance.insurance_start_date=insurances;
        const insurancee=new Date(insurance.insurance_end_date);
        insurance.insurance_end_date=insurancee;

        const createdInsurance = await createInsuranceService(insurance); // Call service function to create insurance entry
        if (!createdInsurance) return c.text("Insurance entry not created", 404);

        return c.json({ msg: "Insurance entry created successfully", insurance: createdInsurance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Update insurance entry by ID
export const updateInsurance = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const insuranceData = await c.req.json(); // Get updated insurance data from request body
    try {
        const updatedInsurance = await updateInsuranceByIdService(id, insuranceData); // Call service function to update insurance entry
        if (!updatedInsurance) return c.text("Insurance entry not updated", 404);

        return c.json({ msg: "Insurance entry updated successfully", insurance: updatedInsurance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

// Delete insurance entry by ID
export const deleteInsurance = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedInsurance = await deleteInsuranceByIdService(id); // Call service function to delete insurance entry
        if (!deletedInsurance) return c.text("Insurance entry not deleted", 404);

        return c.json({ msg: "Insurance entry deleted successfully", insurance: deletedInsurance }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
