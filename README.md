# Golden Legacy Homes - Backend API

Complete Express + MongoDB backend with JWT authentication using HTTP-only cookies.

## Features

- ✅ JWT Authentication with HTTP-only cookies
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes middleware
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled for frontend

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **express-validator** - Input validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string

3. Start the server:

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## Environment Variables

| Variable            | Description               | Default                                         |
| ------------------- | ------------------------- | ----------------------------------------------- |
| `PORT`              | Server port               | `5000`                                          |
| `NODE_ENV`          | Environment               | `development`                                   |
| `MONGODB_URI`       | MongoDB connection string | `mongodb://localhost:27017/golden-legacy-homes` |
| `JWT_SECRET`        | Secret key for JWT        | Required                                        |
| `JWT_EXPIRE`        | JWT expiration time       | `7d`                                            |
| `JWT_COOKIE_EXPIRE` | Cookie expiration (days)  | `7`                                             |
| `COOKIE_SECURE`     | HTTPS-only cookies        | `false`                                         |
| `COOKIE_SAME_SITE`  | Cookie SameSite policy    | `lax`                                           |
| `FRONTEND_URL`      | Frontend URL for CORS     | `http://localhost:5173`                         |

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Cookie: token=jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2025-10-27T12:00:00.000Z"
  }
}
```

#### Verify Token

```http
GET /api/auth/verify
Cookie: token=jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### Logout

```http
POST /api/auth/logout
Cookie: token=jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### User Routes (`/api/users`)

#### Get User Profile (Protected)

```http
GET /api/users/profile
Cookie: token=jwt_token_here
```

#### Update User Profile (Protected)

```http
PUT /api/users/profile
Cookie: token=jwt_token_here
Content-Type: application/json

{
  "fullName": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Change Password (Protected)

```http
PUT /api/users/change-password
Cookie: token=jwt_token_here
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Get All Users (Admin Only)

```http
GET /api/users
Cookie: token=admin_jwt_token_here
```

#### Get User by ID (Admin Only)

```http
GET /api/users/:id
Cookie: token=admin_jwt_token_here
```

#### Update User (Admin Only)

```http
PUT /api/users/:id
Cookie: token=admin_jwt_token_here
Content-Type: application/json

{
  "fullName": "Updated Name",
  "role": "admin",
  "isActive": true
}
```

#### Delete User (Admin Only)

```http
DELETE /api/users/:id
Cookie: token=admin_jwt_token_here
```

## User Model

```javascript
{
  fullName: String,      // Required
  email: String,         // Required, unique, validated
  password: String,      // Required, hashed, min 8 chars
  role: String,          // 'user' or 'admin', default: 'user'
  isActive: Boolean,     // Default: true
  lastLogin: Date,       // Updated on each login
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

## Authentication Flow

1. **Registration/Login**:

   - User submits credentials
   - Server validates input
   - Password is hashed (bcrypt)
   - User is saved to database
   - JWT token is generated
   - Token is sent in HTTP-only cookie
   - User data is returned (without password)

2. **Protected Routes**:

   - Client sends request with cookie
   - Middleware extracts token from cookie
   - Token is verified
   - User is attached to request object
   - Route handler executes

3. **Admin Routes**:

   - Same as protected routes
   - Additional check for admin role
   - Only admin users can access

4. **Logout**:
   - Server clears the cookie
   - Client redirects to home

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CORS configured for specific origin
- ✅ Input validation and sanitization
- ✅ Secure cookie options for production
- ✅ Password complexity requirements
- ✅ Account status tracking (isActive)
- ✅ Role-based access control

## Error Handling

All errors return in format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Creating Admin User

To create an admin user, you can:

1. **Manually in MongoDB**:

   ```javascript
   db.users.updateOne(
     { email: "admin@nicehomes.com" },
     { $set: { role: "admin" } }
   );
   ```

2. **Register normally, then update**:

   - Register a new user
   - Update the role in database to 'admin'

3. **Create a seed script** (recommended for production):

   ```javascript
   // scripts/createAdmin.js
   import User from "./models/User.js";

   const admin = await User.create({
     fullName: "Admin User",
     email: "admin@nicehomes.com",
     password: "AdminPassword123",
     role: "admin",
   });
   ```

## Testing the API

### Using curl:

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt
```

**Get Profile:**

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -b cookies.txt
```

### Using Postman/Thunder Client:

1. Make sure to enable "Send cookies"
2. The token will be automatically stored in cookies
3. Subsequent requests will include the cookie

## Deployment

### Production Checklist:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `COOKIE_SECURE=true` (requires HTTPS)
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or production database
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Add request logging
- [ ] Monitor error logs

### Environment Variables for Production:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/golden-legacy-homes
JWT_SECRET=very-long-random-string-change-this
COOKIE_SECURE=true
FRONTEND_URL=https://yourdomain.com
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── userController.js     # User CRUD operations
├── middleware/
│   ├── authMiddleware.js     # JWT verification & role check
│   ├── errorMiddleware.js    # Error handling
│   └── validationMiddleware.js # Input validation
├── models/
│   └── User.js              # User model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── userRoutes.js        # User endpoints
├── .env                      # Environment variables
├── .env.example             # Example env file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── README.md                # This file
└── server.js                # Entry point
```

## Support

For issues or questions, please check:

- MongoDB connection string format
- Environment variables are correctly set
- Frontend CORS origin matches
- Cookies are being sent with requests

## License

ISC
