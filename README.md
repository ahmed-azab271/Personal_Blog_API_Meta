# Personal Blogging Platform API

A robust RESTful API for a Personal Blogging Platform, built with Node.js, Express, and MySQL.

**GitHub Repository:** [https://github.com/ahmed-azab271/Personal_Blog_API_Meta](https://github.com/ahmed-azab271/Personal_Blog_API_Meta)

## The Database Choice and Why
**MySQL** was chosen for this project for the following reasons:
1. **Relational Data Modeling:** A blogging platform naturally requires strict relationships (specifically, a One-to-Many relationship between Users and Posts). MySQL is perfectly suited to enforce these foreign key constraints and ensure data integrity.
2. **Raw SQL Implementation:** Instead of relying on an ORM, I chose to use the `mysql2` library with raw SQL queries and prepared statements. This demonstrates a deep, fundamental understanding of database interactions, SQL JOINs (used for fetching author details with posts), and protection against SQL injection.

## Features
- **User Authentication:** Register and Login with JWT and bcrypt password hashing.
- **Blog Posts:** CRUD operations for blog posts.
- **Validation:** Input validation using Zod.
- **Database:** Raw MySQL queries using `mysql2`.
- **Postman Collection:** Included `Blog_API.postman_collection.json` for easy endpoint testing.

## Prerequisites
- Node.js (v14 or higher)
- npm
- MySQL Server

## Setup & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmed-azab271/Personal_Blog_API_Meta.git
   cd Personal_Blog_API_Meta
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the Database in MySQL:
   Make sure your MySQL server is running, then open your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or terminal) and run:
   ```sql
   CREATE DATABASE blog_db;
   ```

4. Set up the environment variables:
   Ensure your `.env` file contains your MySQL connection string. Create a `.env` file in the root if it doesn't exist:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/blog_db"
   JWT_SECRET="8f9b3a4c5e6d7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a"
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm run dev
   ```
   *Note: The server will automatically create the required `Users` and `Posts` tables if they don't exist.*

## Implemented Endpoints

### Authentication
- `POST /auth/register` - Create a new user.
- `POST /auth/login` - Authenticate user and return a JWT.

### Blog Posts
- `GET /posts` - Public route to view all blog posts.
- `POST /posts` - Protected route to create a new post (requires Bearer Token).
- `PUT /posts/:id` - Protected route to update a post (only owner).
- `DELETE /posts/:id` - Protected route to delete a post (only owner).

*Note: For protected routes, include the JWT token in the `Authorization` header as `Bearer <token>`.*

## Postman Collection

A Postman collection is included in the root directory: `Blog_API.postman_collection.json`. 
You can import this file directly into Postman to easily test all implemented endpoints. The collection includes a script that automatically captures your JWT on login and uses it for protected routes!
