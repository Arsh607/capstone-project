# Inventory Management API

## Project Overview

The Inventory Management API is a RESTful backend service built with Node.js, Express, and TypeScript. It allows users to manage products, suppliers, and inventory transactions efficiently through a structured and secure system.

The API supports core operations such as creating, retrieving, updating, and deleting resources. It also includes advanced features like filtering, authentication, authorization, rate limiting, and API documentation.

This system is designed for small to medium-sized businesses to track inventory, manage suppliers, and maintain accurate stock levels. Firebase Firestore is used as the database, and Firebase Authentication is used for secure user management.

---

## Installation Instructions

### Prerequisites

Make sure the following are installed:

- Node.js (v18 or higher recommended)
- npm
- Git

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Arsh607/capstone-project
cd https://github.com/Arsh607/capstone-project

### Step 2: Install Dependencies

```bash
npm install

### Step 3: Environment Variables

Create a .env file in the root directory.

Example:
PORT=3000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
API_KEY=your_firebase_api_key
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:3000

Important:

Do NOT commit your .env file.
Ensure it is added to .gitignore.

### Step 4: Start the Application

```bash
npm start

API will run at - http://localhost:3000


##Core Features
###Product Management
Create, update, delete, and retrieve products
Includes fields like name, description, price, quantity, category, and supplierId

###Supplier Management
Manage supplier details
Includes name, email, phone number, and address

###Inventory Transactions
Track stock changes (add, remove, adjust)
Automatically updates product quantity

###Authentication & Authorization
Firebase Authentication integration
Token-based authentication
Role-based access control (admin, manager, employee)

###Filtering
Supports flexible query-based filtering.

Examples:
/products?category=Electronics
/products?minPrice=100&maxQuantity=20
/transactions?productId=prod_1&type=add

###Rate Limiting
Prevents abuse of API endpoints
Limits number of requests per user/IP
Stricter limits on authentication routes

###Validation
Joi-based validation for body, params, and query
Ensures clean and consistent data

###Error Handling
Centralized global error handler
Handles validation, authentication, and server errors

###API Documentation
Swagger (OpenAPI) documentation available

##Example Endpoints
###Get All Products

Method: GET
URL:

http://localhost:3000/api/v1/products

Example Response:

{
  "message": "Products retrieved successfully",
  "count": 10,
  "data": []
}
###Create Product

Method: POST
URL:

http://localhost:3000/api/v1/products

###Get Product by ID

Method: GET
URL:

http://localhost:3000/api/v1/products/prod_1

###Create Transaction
Method: POST
URL:

http://localhost:3000/api/v1/transactions

###Sign In
Method: POST
URL:

http://localhost:3000/api/v1/auth/signIn

##Public API Documentation
Link - https://arsh607.github.io/capstone-project/

##Local access to documentation
When running the application locally, the documentation can be accessed using http://localhost:3000/api-docs/


## Author
Arshdeep Singh Rishi