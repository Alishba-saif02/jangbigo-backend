# JangbiGO Backend

A robust Node.js backend API built with Express.js, TypeScript, PostgreSQL, Prisma ORM, and Kakao OAuth authentication.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript development
- **PostgreSQL** - Relational database with Prisma ORM
- **Kakao OAuth** - Social authentication with Kakao
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Request validation using express-validator
- **Security Middleware** - Helmet, CORS, rate limiting
- **Error Handling** - Comprehensive error handling middleware
- **Swagger Documentation** - Interactive API documentation
- **Code Quality** - ESLint configuration with TypeScript support
- **Environment Configuration** - Environment-based configuration
- **Logging** - Structured logging utility

## 📁 Project Structure

```
JangbiGO-backend/
├── src/
│   ├── config/             # Configuration files
│   │   ├── database.ts     # PostgreSQL connection
│   │   ├── passport.ts     # Passport OAuth configuration
│   │   └── swagger.ts      # Swagger documentation config
│   ├── lib/                # Library files
│   │   └── prisma.ts       # Prisma client instance
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── errorHandler.ts # Error handling
│   │   └── notFound.ts     # 404 handler
│   ├── prisma/             # Prisma schema and migrations
│   │   └── schema.prisma   # Database schema
│   ├── routes/             # API routes
│   │   ├── auth.ts         # Authentication routes
│   │   ├── users.ts        # User management routes
│   │   └── health.ts       # Health check route
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts        # Type definitions
│   ├── utils/              # Utility functions
│   │   └── logger.ts       # Logging utility
│   └── app.ts              # Main application file
├── .env.example            # Environment variables template
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore rules
├── nodemon.json           # Nodemon configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd JangbiGO-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration values.

4. **Set up PostgreSQL**

   - Install PostgreSQL locally or use a cloud service
   - Create a database named `jangbigo_db`
   - Update `DATABASE_URL` in your `.env` file

5. **Set up Prisma**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database (for development)
   npm run db:push

   # Or run migrations (for production)
   npm run db:migrate
   ```

6. **Set up Kakao OAuth**

   - Go to [Kakao Developers](https://developers.kakao.com/)
   - Create a new application
   - Get your Client ID and Client Secret
   - Set the redirect URI to `http://localhost:3000/api/auth/kakao/callback`
   - Update `KAKAO_CLIENT_ID` and `KAKAO_CLIENT_SECRET` in your `.env` file

7. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

- `npm start` - Start production server (requires build)
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/jangbigo_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Kakao OAuth Configuration
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_CALLBACK_URL=http://localhost:3000/api/auth/kakao/callback

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

Visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
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

#### Kakao OAuth Login

```http
GET /api/auth/kakao
```

Redirects to Kakao OAuth page.

#### Kakao OAuth Callback

```http
GET /api/auth/kakao/callback
```

Handles OAuth callback and returns JWT token.

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin only)

```http
GET /api/users
Authorization: Bearer <token>
```

#### Get Single User

```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User

```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Delete User (Admin only)

```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Health Check

#### Get API Status

```http
GET /api/health
```

## 🗄️ Database

This project uses PostgreSQL with Prisma ORM. The database schema includes:

### Models

- **User** - User accounts with Kakao OAuth integration
- **Post** - User posts with content and images
- **Comment** - Comments on posts
- **Like** - Post likes with unique constraints

### Features

- Relational database with proper foreign key constraints
- Automatic timestamps (createdAt, updatedAt)
- Unique constraints for data integrity
- Cascade deletes for related data
- Kakao OAuth integration (kakaoId)

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request data validation
- **JWT Authentication** - Token-based authentication
- **Password Hashing** - bcrypt password hashing
- **OAuth 2.0** - Kakao social authentication

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure environment variables
3. Set up a production PostgreSQL instance
4. Build the TypeScript code:
   ```bash
   npm run build
   ```
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/app.js --name "jangbigo-backend"
   ```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.
