Car Rental System Backend
This repository contains the backend code for a Car Rental System application by developer johnson mwangi. The application is built using the following technologies:

Hono: A lightweight microservices framework for building scalable and resilient applications.
Drizzle: A data management library for managing state in modern web applications.
TypeScript: A statically typed superset of JavaScript.
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js and npm: Installed on your machine. You can download and install them from the Node.js website.
Hono and Drizzle: Installed globally. You can install them via npm by running:
npm install -g hono drizzle

Java Development Kit (JDK): Installed on your machine. You can download and install it from Oracle’s website.
Apache Maven: Installed on your machine. You can download and install it from Maven’s website.
Running the Backend (Hono and Drizzle)
Clone this repository to your local machine.
Navigate to the backend directory:
cd backend

Build the project using Maven:
mvn clean install

Run the Java application:
java -jar target/car-rental-backend.jar
This will start the backend server on http://localhost:8080.
Additional Notes
The backend application is configured to run on port 8080 by default. If you need to change this port, modify the application.properties file located in the backend/src/main/resources directory.
The frontend application (if available) should be configured to proxy requests to http://localhost:8080, assuming the backend is running on the default port.
Feel free to explore the code and adapt it to your specific requirements! If you have any further questions, don’t hesitate to ask. 🚗🔧
