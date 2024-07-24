// vehicleService.ts

import { TIVehicle, TUVehicle, Vehicles } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';
import client from '../config';

// Get all vehicles
export const getAllVehiclesService = async () => {
    return await db.query.Vehicles.findMany(
        {
            columns:{
                id:true,
                rental_rate:true,
                availability:true
            },
            with:{
                vehicleSpecification:{
                    columns:{
                        manufacturer:true,
                        model:true,
                        year:true,
                        fuel_type:true,
                        engine_capacity:true,
                        transmission:true,
                        seating_capacity:true,
                        color:true,
                        image:true,
                        price:true,
                        features:true
                    
                    }
                },
               vehicleInsurances:{
                    columns:{
                        provider:true,
                        policy_number:true,
                       
                        start_date:true,
                        end_date:true
                    }
               },
               vehicleMaintenances:{
                    columns:{
                        maintenance_type:true,
                        maintenance_cost:true,
                        maintenance_date:true
                    }
               },
             
            }
        }
    );
}

// Get vehicle by ID
export const getVehicleByIdService = async (id: number) => {
    return await db.query.Vehicles.findFirst({
        where: eq(Vehicles.id, id),

        columns:{
            rental_rate:true,
            availability:true
        },
        with:{
            vehicleSpecification:{
                columns:{
                    manufacturer:true,
                    model:true,
                    year:true,
                    fuel_type:true,
                    engine_capacity:true,
                    transmission:true,
                    seating_capacity:true,
                    color:true,
                
                }
            },
           vehicleInsurances:{
                columns:{
                    provider:true,
                    policy_number:true,
                 
                    start_date:true,
                   end_date:true
                
           }

        },
        vehicleMaintenances:{
            columns:{
                
                maintenance_type:true,
                maintenance_cost:true,
                maintenance_date:true
            }
        }
       
        
    }
    });
}

// Create vehicle
export class VehicleService {
    constructor(private db = client) { }

    async createVehicle(
        vehicle: {
            rental_rate: number; availability: boolean
            acquisition_date: string; depreciation_rate: number; 
            current_value: number; maintenance_cost: number; status: string
            policy_number: string; provider: string; start_date: string; end_date: string; coverage: string
            manufacturer: string;
            model: string;
            year: number;
            color: string;
            seating_capacity: number;
            fuel_type: string;
            engine_capacity: string;
            transmission: string;
            price: number;
            features: string;
            image: string;
        } // Ensure vehicleSpecs is required
    ): Promise<{ newVehicle: any }> {
        // Ensure vehicleSpecs is not undefined
        
        // Insert into Vehicle Specifications table
        const vehicleSpecResult = await this.db.query(
            'INSERT INTO Vehiclespecifications (manufacturer, model, year, color, seating_capacity, fuel_type, engine_capacity, transmission, price, features, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [
                vehicle.manufacturer,
                vehicle.model,
                vehicle.year,
                vehicle.color,
                vehicle.seating_capacity,
                vehicle.fuel_type,
                vehicle.engine_capacity,
                vehicle.transmission,
                vehicle.price,
                vehicle.features,
                vehicle.image
            ]
        );
        const newVehicleSpecification = vehicleSpecResult.rows[0];

        // Insert into Insurance table
        const insuranceResult = await this.db.query(
            'INSERT INTO Vehicle_insurance (policy_number, provider, start_date, end_date, coverage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
            vehicle.policy_number,
            vehicle.provider,
            vehicle.start_date,
            vehicle.end_date,
            vehicle.coverage
            ]
        );

        const newInsurance = insuranceResult.rows[0];

        // Insert into Vehicles table
        const vehicleResult = await this.db.query(
            'INSERT INTO Vehicles (vehiclespecification_id, insurance_id, rental_rate, availability) VALUES ($1, $2, $3, $4) RETURNING *',
            [newVehicleSpecification.id, newInsurance.id, vehicle.rental_rate, vehicle.availability]
        );

        const newVehicle = vehicleResult.rows[0];

        // Insert into Fleet Management table
        await this.db.query(
            'INSERT INTO FleetManagement (vehicle_id, acquisition_date, depreciation_rate, current_value, maintenance_cost, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [
                newVehicle.id,
                vehicle.acquisition_date,
                vehicle.depreciation_rate,
                vehicle.current_value,
                vehicle.maintenance_cost,
                vehicle.status
            ]
        );

        return {
            newVehicle: [
                newVehicle.id,
                newVehicle.vehiclespecification_id,
                newInsurance.id,
                newVehicle.rental_rate,
                newVehicle.availability
            ]
        };
    }
}


// Update vehicle by ID
export const updateVehicleByIdService = async (id: number, vehicle: TIVehicle): Promise<string> => {
    await db.update(Vehicles).set(vehicle).where(eq(Vehicles.id, id));
    return "Vehicle updated successfully";
}

// Delete vehicle by ID
export const deleteVehicleByIdService = async (id: number): Promise<string> => {
    await db.delete(Vehicles).where(eq(Vehicles.id, id));
    return "Vehicle deleted successfully";
}
