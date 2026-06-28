# API Documentation

The server runs on `http://localhost:3000`.

## Authentication

### POST `/auth/register`
Registers a new user.
- **Body**: `{ "username": "string", "password": "string" }`

### POST `/auth/login`
Authenticates a user.
- **Body**: `{ "username": "string", "password": "string" }`

## Swings

### GET `/swings`
Retrieves all swings for a user.
- **Query**: `userId=string`

### POST `/swings/upload`
Uploads a swing video.
- **Body**: `{ "userId": "string", "videoUrl": "string" }`

### GET `/swings/analysis`
Retrieves analysis data.
- **Query**: `swingId=string` OR `userId=string`

### POST `/swings/analysis`
Saves analysis for a swing.
- **Body**: `{ "swingId": "string", "analysis": "object" }`

### POST `/swings/tips`
Generates AI-powered swing tips.
- **Body**: `{ "analysis": "object" }`
- **Requirement**: `CEREBRAS_API_KEY` must be set in the environment.
