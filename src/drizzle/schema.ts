import { integer, text, varchar, timestamp, boolean, decimal, serial, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


// Define tables


export const Users = pgTable('users', {
    id: serial('id').primaryKey(),
    full_name: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    address: varchar('address', { length: 255 }).notNull(),
    phone_number: varchar('phone_number', { length: 255 }).notNull(),
    image_url: varchar('image_url', { length: 10485750 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('user'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});






export const Authentications = pgTable('authentications', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => Users.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});


export const vehiclespecifications = pgTable('vehiclespecifications', {
    id: serial('id').primaryKey(),
    manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    year: integer('year').notNull(),
    price: decimal('price').notNull(),
    image: varchar('image', { length: 10485750 }).notNull(),
    fuel_type: varchar('fuel_type', { length: 50 }).notNull(),
    engine_capacity: decimal('engine_capacity').notNull(),
    transmission: varchar('transmission', { length: 50 }).notNull(),
    seating_capacity: integer('seating_capacity').notNull(),
    color: varchar('color', { length: 255 }).notNull(),
    features: text('features').notNull(),
});


export const Vehicles = pgTable('vehicles', {
    id: serial('id').primaryKey(),
    insurance_id: integer('insurance_id').notNull().references(() => VehicleInsurance.id),
    vehiclespecification_id: integer('vehiclespecification_id').notNull().references(() => vehiclespecifications.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    rental_rate: decimal('rental_rate').notNull(),
    availability: varchar('availability', { length: 50 }).default("available").notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});



export const Bookings = pgTable('bookings', {
    id: serial('id').primaryKey(),
    user_id:integer('user_id').references(() => Users.id, {onDelete:'cascade'}).notNull(),
    vehicle_id: integer('vehicle_id').notNull().references(() => Vehicles.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    location_id: integer('location_id').notNull().references(() => Locations.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    booking_date: varchar('booking_date').notNull(),
    return_date: varchar('return_date').notNull(),
    total_amount: decimal('total_amount').notNull(),
    booking_status: varchar('booking_status', { length: 50 }).default("booked").notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});


export const Payments = pgTable('payments',{
    id:serial('id').primaryKey().notNull(),
    booking_id: integer('booking_id')
    .notNull()
    .references(() => Bookings.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    amount:decimal('amount',{precision:10,scale:2}).notNull(),
    payment_status:varchar('payment_status',{length:20}).default('paid').notNull(),
    payment_date:varchar('payment_date').notNull(),
    payment_method:varchar('payment_method',{length:20}).notNull(),
    transaction_id:varchar('transaction_id',{length:100}).notNull(),
    created_at:timestamp('created_at').defaultNow(),
    updated_at:timestamp('updated_at').defaultNow()
})


  
  
export const CustomerSupportTickets = pgTable('customer_support_tickets', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => Users.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    ticket_subject: varchar('ticket_subject', { length: 255 }).notNull(),
    ticket_description: text('ticket_description').notNull(),
    
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});


export const Locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    location_name: varchar('location_name', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    contact_phone: varchar('contact_phone', { length: 255 }).notNull(),
   
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const fleetmanagement = pgTable('fleetmanagement', {
    id: serial('id').primaryKey(),
    vehicle_id: integer('vehicle_id').notNull().references(() => Vehicles.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    acquisition_date: timestamp('acquisition_date').notNull(),
    depreciation_rate: decimal('depreciation_rate').notNull(),
    current_value: decimal('current_value').notNull(),
    maintenance_cost: decimal('maintenance_cost').notNull(),
    status: varchar('status', { length: 50 }).default("active").notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});


export const VehicleMaintenance = pgTable('vehicle_maintenance', {
    id: serial('id').primaryKey(),
    vehicle_id: integer('vehicle_id').notNull().references(() => Vehicles.id,{ onDelete: 'cascade', onUpdate: 'cascade' }),
    maintenance_type: varchar('maintenance_type', { length: 255 }).notNull(),
    maintenance_description: text('maintenance_description').notNull(),
    maintenance_cost: decimal('maintenance_cost').notNull(),
    maintenance_date: timestamp('maintenance_date').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const VehicleInsurance = pgTable('vehicle_insurance', {
    id: serial('id').primaryKey(),
  
    provider: varchar('provider', { length: 255 }).notNull(),
    policy_number: varchar('policy_number', { length: 255 }).notNull(),
    coverage: text('coverage').notNull(),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});



// Relationships
export const userRelations = relations(Users, ({ one, many }) => ({
    authentications: one(Authentications, {
        fields: [Users.id],
        references: [Authentications.user_id]
    }),
    bookings: many(Bookings),
    payments: many(Payments),
    customerSupportTickets: many(CustomerSupportTickets)
}));

export const vehicleSpecificationRelations = relations(vehiclespecifications, ({ many }) => ({
    vehicles: many(Vehicles)
}));

export const vehicleRelations = relations(Vehicles, ({ one, many }) => ({
    vehicleSpecification: one(vehiclespecifications, {
        fields: [Vehicles.vehiclespecification_id],
        references: [vehiclespecifications.id]
    }),
    insurance: one(VehicleInsurance, {
        fields: [Vehicles.insurance_id],
        references: [VehicleInsurance.id]
    }),
    bookings: many(Bookings),
    fleetManagements: one(fleetmanagement,{
        fields:[Vehicles.id],
        references:[fleetmanagement.vehicle_id]
    }),
    vehicleMaintenances: many(VehicleMaintenance),
    vehicleInsurances: many(VehicleInsurance),
  
}));



export const bookingRelations = relations(Bookings, ({ one }) => ({
    user: one(Users, {
        fields: [Bookings.user_id],
        references: [Users.id]
    }),
    vehicle: one(Vehicles, {
        fields: [Bookings.vehicle_id],
        references: [Vehicles.id]
    }),
    
    location: one(Locations, {
        fields: [Bookings.location_id],
        references: [Locations.id]
    }),
    payments: one(Payments, {
        fields: [Bookings.id],
        references: [Payments.booking_id]
    })
}));

export const paymentRelations = relations(Payments, ({ one }) => ({
    booking: one(Bookings, {
        fields: [Payments.booking_id],
        references: [Bookings.id]
    })
}));

export const customerSupportTicketRelations = relations(CustomerSupportTickets, ({ one }) => ({
    user: one(Users, {
        fields: [CustomerSupportTickets.user_id],
        references: [Users.id]
    })
}));

export const locationRelations = relations(Locations, ({ many }) => ({
    bookings: many(Bookings)
}));

export const fleetManagementRelations = relations(fleetmanagement, ({ one }) => ({
    vehicle: one(Vehicles, {
        fields: [fleetmanagement.vehicle_id],
        references: [Vehicles.id]
    })
}));

export const vehicleMaintenanceRelations = relations(VehicleMaintenance, ({ one }) => ({
    vehicle: one(Vehicles, {
        fields: [VehicleMaintenance.vehicle_id],
        references: [Vehicles.id]
    })
}));

export const vehicleInsuranceRelations = relations(VehicleInsurance, ({ one }) => ({
    vehicle: one(Vehicles, {
        fields: [VehicleInsurance.id],
        references: [Vehicles.insurance_id]
    })
}));






// types

    export type TIUser = typeof Users.$inferInsert; //1
    export type TUUser = typeof Users.$inferSelect;

    export type TIVehicleSpecification = typeof vehiclespecifications.$inferInsert; //2
    export type TUVehicleSpecification = typeof vehiclespecifications.$inferSelect;

    export type TIVehicle = typeof Vehicles.$inferInsert; //3
    export type TUVehicle = typeof Vehicles.$inferSelect;

    export type TIBookings = typeof Bookings.$inferInsert;  //4
    export type TSBookings = typeof Bookings.$inferSelect;

    export type TIPayments = typeof Payments.$inferInsert;  //5
    export type TSPayments= typeof Payments.$inferSelect;

    export type TICustomerSupportTicket = typeof CustomerSupportTickets.$inferInsert;  //6
    export type TUCustomerSupportTicket = typeof CustomerSupportTickets.$inferSelect;

    export type TILocation = typeof Locations.$inferInsert;  //7
    export type TULocation = typeof Locations.$inferSelect;

    export type TIFleetManagement = typeof fleetmanagement.$inferInsert;   //8
    export type TUFleetManagement = typeof fleetmanagement.$inferSelect;

    export type TIVehicleMaintenance = typeof VehicleMaintenance.$inferInsert;  //9
    export type TUVehicleMaintenance = typeof VehicleMaintenance.$inferSelect;

    export type TIVehicleInsurance = typeof VehicleInsurance.$inferInsert;   //10
    export type TUVehicleInsurance = typeof VehicleInsurance.$inferSelect;

   

    export type TIAuthentication = typeof Authentications.$inferInsert;   //12
    export type TUAuthentication = typeof Authentications.$inferSelect;










