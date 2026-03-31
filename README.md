# Todo API - Express + TypeScript + Prisma

A production-ready REST API for todo management with user authentication, built with modern backend technologies and best practices.

## Overview

### Why This Project?

Created to demonstrate backend development skills with TypeScript, ORM integration, and secure authentication patterns. This project showcases clean architecture and separation of concerns.

### What It Does

- User authentication with JWT tokens
- Full CRUD operations for todos
- User-Todo relationships with database constraints
- Type-safe database queries with Prisma ORM
- PostgreSQL database via Supabase

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2+
- **Language**: TypeScript 6.0+
- **ORM**: Prisma 7.6+ with PostgreSQL adapter
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Dev Tools**: nodemon, ts-node

## Key Technical Achievements

### Architecture & Design Patterns

- **MVC Pattern**: Clean separation of routes, controllers, and business logic
- **Prisma ORM Integration**: Type-safe database queries with automatic migration support
- **Middleware Architecture**: Reusable authentication middleware for route protection
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Design

- **Relational Schema**: User-Todo one-to-many relationship
- **Prisma 7.x Migration**: Successfully upgraded to latest Prisma with PostgreSQL adapter
- **Connection Pooling**: Optimized database connections via Prisma connection pool

### Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with expiration
- **Environment Variables**: Sensitive credentials isolated in .env
- **Input Validation**: Request validation for all endpoints

## Project Structure

```
src/
├── controllers/
│   └── todoController.ts    # Business logic for Todo CRUD
├── routes/
│   └── todos.ts             # API endpoint definitions
├── lib/
│   └── prisma.ts            # Prisma client singleton
├── middleware/
│   └── auth.ts              # JWT authentication middleware
└── index.ts                 # Express app entry point

prisma/
├── schema.prisma            # Database schema definition
└── migrations/              # Database migrations
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

## API Endpoints

### Authentication

```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login and receive JWT token
GET    /api/auth/me          Get current user info (protected)
```

### Todos

```
GET    /api/todos            Get all todos for current user
POST   /api/todos            Create new todo
GET    /api/todos/:id        Get specific todo
PUT    /api/todos/:id        Update todo
DELETE /api/todos/:id        Delete todo
```

### Example Requests

**Register User:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Create Todo (requires JWT token):**

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Learn Prisma",
    "description": "Complete Prisma ORM tutorial",
    "completed": false
  }'
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Supabase Setup

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your PostgreSQL connection string from Project Settings > Database
4. Note: The Prisma schema will automatically create tables on first migration

### Local Development

```bash
# Clone the repository
git clone https://github.com/takemura-sei/todo-api.git
cd todo-api

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials:
# DATABASE_URL="postgresql://user:password@host:5432/database"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

### Environment Variables

See `.env.example` for required environment variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
JWT_SECRET="your-secret-key-here"
```

Generate secure JWT secret:

```bash
openssl rand -base64 64
```

## Authentication Flow

1. User registers via `/api/auth/register`
2. Password hashed with bcrypt
3. User logs in via `/api/auth/login`
4. JWT token returned with user ID and expiration
5. Client includes token in `Authorization: Bearer <token>` header
6. Auth middleware validates token on protected routes
7. User ID extracted from token for database queries

## What I Learned

- **Prisma ORM**: Mastered schema design, migrations, and type-safe queries
- **TypeScript Backend**: Implemented full type safety across Express app
- **JWT Authentication**: Designed secure token-based auth system
- **Database Relationships**: Modeled one-to-many relationships with foreign keys
- **MVC Architecture**: Structured code for maintainability and scalability
- **Prisma 7.x Migration**: Successfully upgraded to latest Prisma with PostgreSQL adapter

## Future Improvements

- Add unit and integration tests (Jest)
- Implement rate limiting for API endpoints
- Add todo categories and tags
- Implement todo sharing between users
- Add todo due dates and reminders
- Create OpenAPI/Swagger documentation
- Add Docker containerization
- Implement caching with Redis
- Add GraphQL endpoint alternative

## License

MIT License
