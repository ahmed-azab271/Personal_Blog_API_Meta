# Personal Blogging Platform API

A robust RESTful API for a Personal Blogging Platform, built with Node.js, Express, and MySQL.

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
   git clone <repository-url>
   cd blog-api
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
   Ensure your `.env` file contains your MySQL connection string. For example, if you are using XAMPP (root with no password):
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/blog_db"
   JWT_SECRET="supersecretjwtkeythatshouldbechanged"
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
