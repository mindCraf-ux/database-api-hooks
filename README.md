# Backend API Source Code

This repository contains the backend source code for the application, built with **Node.js**, **Express.js**, and **MongoDB** (via Mongoose). It appears to be a backend for a comprehensive video streaming or social media platform (similar to YouTube/Twitter), based on the presence of models like `video`, `tweet`, `playlist`, `subscription`, `like`, and `comment`.

## 📂 Folder Structure & Architecture 

The codebase follows a clear separation of concerns, typical of MVC (Model-View-Controller) architecture.

### Root Files
- **`index.js`**: The application's main entry point. It loads environment variables, connects to the database via `db/index.js`, and starts the Express server.
- **`app.js`**: Configures the Express application. It sets up essential middlewares like `cors` (Cross-Origin Resource Sharing), `cookie-parser` (for secure cookies), `express.json` & `express.urlencoded` (to parse incoming requests), and mounts the main API route handlers.
- **`constants.js`**: Stores application-wide constants, such as the database name.

### Sub-Directories
- **`controllers/`**: Contains the core business logic. Controllers process incoming API requests, interact with models (database), and return responses. E.g., `user.controller.js` handles user registration, login, and secure sessions.
- **`db/`**: Contains the database connection logic to establish a connection with MongoDB.
- **`middlewares/`**: Contains custom middlewares for request interception:
  - `auth.middleware.js`: Verifies JSON Web Tokens (JWT) to authenticate specific API endpoints.
  - `multer.middleware.js`: Handles file uploads locally before they are eventually synced to remote storage.
- **`models/`**: Defines the data structures using Mongoose Schemas. It includes files like `user.models.js`, `video.model.js`, `tweet.model.js`, `subscription.model.js`, etc., detailing database fields and validations.
- **`routes/`**: Handles the mapping of URL endpoints to their respective controller functions. For instance, `user.routes.js` routes all `/api/users/*` requests.
- **`utils/`**: Reusable helper functions and classes:
  - `ApiError.js` / `ApiResponse.js`: Standardized classes for formatting HTTP success responses and errors consistently across the entire app.
  - `asyncHandler.js`: A wrapper utility to cleanly bypass `try...catch` blocks inside async controllers and pass any errors down to our global error handling middleware.
  - `cloudinary.js`: Handles uploading files (like avatars or videos) automatically directly to Cloudinary servers.

## 🛠️ Technology Stack
- **Node.js & Express.js**: The core runtime and web framework.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JWT (JSON Web Tokens)**: Used for secure and stateless user authentication.
- **Bcrypt**: Used for hashing and securely storing user passwords in the database.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).
- **Cloudinary**: Cloud service to store and deliver user-uploaded media (images/videos).

## 🚀 How It Works
1. When a request hits the server (e.g., `POST /api/users/register`), `app.js` directs it to `user.routes.js`.
2. Any required middlewares (like `multer` for avatar uploads) run first.
3. The request reaches `user.controller.js`, which then validates the input, uses the Mongoose schema (`user.models.js`) to interact with the database, and perhaps hashes a password (`bcrypt`) or handles file uploads.
4. Finally, the controller sends a clean JSON response using `ApiResponse.js`, and if any errors occur, they are caught gracefully and returned via `ApiError.js`.
