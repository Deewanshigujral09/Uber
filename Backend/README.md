# Users API — POST /users/register

This document describes the POST /users/register endpoint in this project.

## Endpoint
- URL: `/users/register`
- Method: POST
- Purpose: Register a new user, store the hashed password, and return a JWT token and the created user (without the password).

## Request headers
- Content-Type: `application/json`

## Request body (JSON)
The endpoint expects a JSON body with the following shape:

{
  "fullname": {
    "firstname": "string",      // required, min length: 3
    "lastname": "string"        // optional, min length: 3 (if provided)
  },
  "email": "user@example.com", // required, must be a valid email
  "password": "yourPass123"    // required, min length: 6
}



### Field details and validation rules
- `fullname.firstname` (string) — required. Minimum length 3 characters.
- `fullname.lastname` (string) — optional. If provided, minimum length 3 characters.
- `email` (string) — required. Must be a valid email address.
- `password` (string) — required. Minimum length 6 characters.
-`token` (String): JWT Token

Validation is performed using `express-validator`. If validation fails the endpoint returns HTTP 400 with details (see responses below).

## Responses

### 201 Created — Success
Returned when a user is successfully created.

Response body example:

{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user-id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}

Notes:
- The `password` field is not returned. The model is configured with `select: false` for password.
- The token is a JWT signed with `process.env.JWT_SECRET`.

### 400 Bad Request — Validation errors
If the request body fails validation, a 400 is returned with an `errors` array (from express-validator).

Example response:

HTTP 400

{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body",
      "value": "not-an-email"
    }
  ]
}

### 500 Internal Server Error
Returned for unexpected server errors (DB errors, missing env variables, etc.). The exact shape may vary depending on error handling middleware.

Example response:

HTTP 500

{
  "error": "Internal Server Error"
}

---

## Users API — POST /users/login

This document describes the POST `/users/login` endpoint used for authenticating existing users and returning a JWT token.

### Endpoint
- URL: `/users/login`
- Method: POST
- Purpose: Authenticate a user using email and password and return a JWT token and the user object (password not returned).

### Request headers
- Content-Type: `application/json`

### Request body (JSON)
The endpoint expects a JSON body with the following shape:

{
  "email": "user@example.com", // required, must be a valid email
  "password": "yourPass123"   // required, min length: 6
}

### Field details and validation rules
- `email` (string) — required. Must be a valid email address.
- `password` (string) — required. Minimum length 6 characters.

Validation is performed using `express-validator` (see `routes/user.routes.js`). If validation fails the endpoint returns HTTP 400 with details (see responses below).

### Responses

#### 200 OK — Success
Returned when credentials are valid and authentication succeeds.

Example response (200 OK):

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTNlOWYwMDAwMDAwMDAwMDAwIiwiaWF0IjoxNjAwMDAwMDAwfQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "_id": "653e9f000000000000000000",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "socketId": null
  }
}
```

Notes:
- The `password` field is never returned from the API (model sets `select: false`).
- The token is a JWT signed with `process.env.JWT_SECRET`.

#### 400 Bad Request — Validation errors
If the request body fails validation (e.g., invalid email format or short password), a 400 is returned with an `errors` array from `express-validator`.

Example response (400):

```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body",
      "value": "not-an-email"
    }
  ]
}
```

#### 401 Unauthorized — Invalid credentials
Returned when the email does not exist or the password does not match. The controller should respond with a 401 and a small error message.

Example response (401):

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "error": "Invalid email or password"
}
```

#### 500 Internal Server Error
Returned for unexpected server errors (DB errors, missing env variables, etc.).

Example response (500):

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{
  "error": "Internal Server Error"
}
```

### How the login works (notes)
- The route is defined in `routes/user.routes.js` and uses `express-validator` checks for `email` and `password`.
- The `User` model exposes a `comparePassword` instance method (bcrypt) used to verify the provided password against the hashed password stored in the database.
- On success, the server returns a JWT token generated by the user model's `generateAuthToken` method.

### How to test (examples)

PowerShell (Invoke-RestMethod):

$body = @{
  email = 'jane@example.com'
  password = 'strongPass1'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/users/login" -Body $body -ContentType 'application/json'

cURL (POSIX / Git Bash / WSL):

curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"strongPass1"}'


## How the data is handled server-side
- The server hashes the password using `bcrypt` before saving (see `user.model.js` static `hashedPassword` method).
- A new user document is created with `fullname`, `email`, and the hashed `password`.
- A JWT token is generated by the `generateAuthToken` instance method on the user model.

---

## Users API — GET /users/profile

This endpoint returns the authenticated user's profile. It requires authentication (JWT) and is typically protected by an `auth` middleware that verifies the token.

### Endpoint
- URL: `/users/profile`
- Method: GET
- Purpose: Return the currently authenticated user's public profile data.

### Authentication
- The endpoint requires a valid JWT. The token may be provided in either:
  - `Authorization` header using the `Bearer <token>` format, or
  - An authentication cookie named `token` (the server sets this cookie on login in the current app).

### Responses

#### 200 OK — Success
Returns the authenticated user's profile.

Example response (200 OK):

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "_id": "653e9f000000000000000000",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "socketId": null
}
```

#### 401 Unauthorized — Missing or invalid token
Returned when no token is provided or the token is invalid/expired or blacklisted.

Example response (401):

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "error": "Access denied. No token provided."
}
```

Notes:
- The `auth` middleware should also check that the token is not present in the `BlacklistToken` collection (see `models/blacklistToken.model.js`) to reject logged-out tokens.

---

## Users API — GET /users/logout

This endpoint logs out the authenticated user by clearing the authentication cookie and blacklisting the token so it cannot be used again.

### Endpoint
- URL: `/users/logout`
- Method: GET
- Purpose: Log the user out by clearing cookie and blacklisting the token.

### Authentication
- The endpoint requires the user to be authenticated (same rules as `/profile`).

### Behavior
- The controller clears the `token` cookie and records the token in the `BlacklistToken` collection so the token is treated as invalid for the next 24 hours (the blacklist uses a TTL index).

### Responses

#### 200 OK — Success
Returned when logout completes and the token is blacklisted.

Example response (200 OK):

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Logged out"
}
```

#### 401 Unauthorized — Missing or invalid token
Returned when no valid token is provided.

Example response (401):

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "error": "Access denied. No token provided."
}
```

Notes:
- Blacklisting only prevents reuse — the token remains valid until it expires, but auth middleware must check the blacklist to reject it.
- The `BlacklistToken` TTL is set to 24 hours; any blacklisted token older than that will be removed automatically.

## How to test (examples)

PowerShell (Invoke-RestMethod):

$body = @{
  fullname = @{ firstname = 'Jane'; lastname = 'Doe' }
  email = 'jane@example.com'
  password = 'strongPass1'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/users/register" -Body $body -ContentType 'application/json'

cURL (POSIX / Git Bash / WSL):

curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname": {"firstname": "Jane", "lastname": "Doe"}, "email": "jane@example.com", "password": "strongPass1"}'

## Environment notes
- Ensure `JWT_SECRET` is set in your environment before starting the server so token generation works.
- Make sure MongoDB is running and `process.env.MONGO_URI` (or whichever connection string the app uses) is set.

## Quick checklist for successful registration
- [ ] Body contains `fullname.firstname` (>=3 chars)
- [ ] Body contains `email` (valid email format)
- [ ] Body contains `password` (>=6 chars)
- [ ] Server has `JWT_SECRET` configured
- [ ] Database is reachable

---

If you want, I can also add an OpenAPI fragment or a Postman example collection for this endpoint.

---

## Captains API — POST /captains/register

This endpoint registers a new captain (driver) and creates a vehicle profile for them. It validates captain and vehicle fields, stores a hashed password, and returns a JWT token and the created captain object.

### Endpoint
- URL: `/captains/register`
- Method: POST
- Purpose: Create a new captain account and return an authentication token.

### Request headers
- Content-Type: `application/json`

### Request body (JSON)
The endpoint expects a JSON body with the following shape:

{
  "fullname": {
    "firstname": "string",   // required, min length: 3
    "lastname": "string"     // optional
  },
  "email": "captain@example.com", // required, valid email
  "password": "yourPass123",      // required, min length: 6
  "vehicle": {
    "color": "red",              // required, min length: 3
    "plate": "ABC123",           // required, min length: 3
    "capacity": 4,                 // required, integer >= 1
    "vehicleType": "car"         // required, one of: 'car','motorcycle','auto'
  }
}

### Validation rules (from `routes/captain.routes.js`)
- `email`: must be a valid email.
- `fullname.firstname`: min length 3.
- `password`: min length 6.
- `vehicle.color`: min length 3.
- `vehicle.plate`: min length 3.
- `vehicle.capacity`: integer, minimum 1.
- `vehicle.vehicleType`: must be one of `['car','motorcycle','auto']`.

### Responses

#### 201 Created — Success
Returned when a captain is successfully created.

Example response (201 Created):

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "token": "<jwt_token>",
  "captain": {
    "_id": "653e9f000000000000000001",
    "fullname": { "firstname": "Alice", "lastname": "Driver" },
    "email": "alice@example.com",
    "vehicle": { "color": "red", "plate": "ABC123", "capacity": 4, "vehicleType": "car" }
  }
}
```

Notes:
- The `password` field is not returned in the response.
- The token is a JWT signed with `process.env.JWT_SECRET`.

#### 400 Bad Request — Validation errors
If the request body fails validation, a 400 is returned with details from `express-validator`.

Example response (400):

```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### 500 Internal Server Error
Returned for unexpected server errors (DB errors, etc.).

Example response (500):

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{
  "error": "Internal Server Error"
}
```

### How to test (examples)

PowerShell (Invoke-RestMethod):

$body = @{
  fullname = @{ firstname = 'Alice'; lastname = 'Driver' }
  email = 'alice@example.com'
  password = 'strongPass1'
  vehicle = @{ color = 'red'; plate = 'ABC123'; capacity = 4; vehicleType = 'car' }
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/captains/register" -Body $body -ContentType 'application/json'

cURL (POSIX / Git Bash / WSL):

curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Alice","lastname":"Driver"},"email":"alice@example.com","password":"strongPass1","vehicle":{"color":"red","plate":"ABC123","capacity":4,"vehicleType":"car"}}'

---