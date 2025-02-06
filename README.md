# Food Health Web App

A modern, scalable content management system for food health information, built with a modern stack for performance, security, and scalability.

## 🚀 Features

### Frontend
- **Food Search & Discovery**: Advanced search functionality for finding foods
- **Detailed Food Information**: Comprehensive view of food details including nutrition, allergens, etc.
- **User Authentication**: Secure user registration, login, and session management
- **Responsive UI**: Modern, responsive interface built with reusable components using `shadcn/ui` and Tailwind CSS
- **Real-time Updates**: Dynamic content updates using React Query for efficient data fetching and caching
- **Type Safety**: Full TypeScript implementation with Zod for schema validation
- **CRUD Functionality**: Create, Read, Update, and Delete operations for managing food items

### Backend
- **RESTful API**: Well-structured and performant Go backend using `go-chi` router
- **Type-safe SQL**: SQLC for type-safe database interactions, ensuring data integrity and reducing runtime errors
- **Database Migrations**: `golang-migrate` for efficient and reliable database schema management
- **Authentication**: JWT (JSON Web Tokens) for secure API authentication and `bcrypt` for password hashing
- **Hot Reload**: `Air` for rapid development with live code reloading
- **API Documentation**: Swagger documentation integrated for API discoverability and ease of use
- **CORS Support**: Properly configured Cross-Origin Resource Sharing for secure frontend-backend communication

### DevOps
- **Containerization**: Docker support for consistent development and deployment environments
- **Local Development**: Docker Compose setup for easy local development with all services
- **Deployment**: Designed for easy deployment on platforms like Railway.app
- **Database**: PostgreSQL for robust and reliable data persistence

## 🏗 Architecture

```
├── Frontend (Next.js 14)
│   ├── App Router (app/)
│   ├── UI Components (shadcn/ui)
│   ├── Authentication (Clerk)
│   ├── Data Fetching (React Query)
│   └── Form Validation (Zod)
├── Backend (Golang)
│   ├── go-chi Router
│   ├── SQLC (Type-safe SQL)
│   ├── golang-migrate (DB Migrations)
│   ├── JWT + bcrypt (Auth)
│   └── Air (Hot Reload)
└── Database
    └── PostgreSQL (Supabase - Managed Postgres option)
└── DevOps
    ├── Docker Compose (Local Dev)
    └── Railway.app (Deployment)
```

## 🔧 Prerequisites

- Node.js 20.x or later
- Go 1.21+
- Docker & Docker Compose
- npm or yarn

## ⚙️ Installation and Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd foodHealth/backend
   ```

2. **Set up Environment Variables:**
   - Create a `.env` file in the `backend` directory
   - Configure the following environment variables:
   ```env
   PORT=8080
   ENVIRONMENT=development
   DATABASE_URL="postgres://<db_user>:<db_password>@localhost:5432/<db_name>?sslmode=disable"
   JWT_SECRET="your-secret-jwt-key"
   ```

3. **Run Database Migrations:**
   ```bash
   go run cmd/server/main.go migrate up
   ```

4. **Run Backend with Hot Reload:**
   ```bash
   air
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a `.env.local` file in the `frontend` directory
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_api
   CLERK_SECRET_KEY=your_clerk_backend_api
   ```

4. **Run the Frontend Development Server:**
   ```bash
   npm run dev
   ```

### Docker Compose Setup

1. **Create a root `.env` file:**
   ```env
   DATABASE_URL=postgres://food_user:food_password@db:5432/food_db?sslmode=disable
   JWT_SECRET=your-secret-jwt-key
   DB_USER=food_user
   DB_PASSWORD=food_password
   DB_NAME=food_db
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

## 🚀 Deployment to Railway.app

1. **Initialize Railway project:**
   ```bash
   railway init
   ```

2. **Set Environment Variables** in Railway dashboard

3. **Deploy:**
   ```bash
   railway up
   ```

## 🛡️ Security

- Authentication via Clerk (frontend) and JWT (backend API)
- Password hashing with `bcrypt`
- Type safety using TypeScript and SQLC
- Configured CORS protection
- Secure environment variable management

## 📚 API Documentation

Backend API documentation available at `/swagger/index.html` when the server is running.

## 💻 Development

- Backend hot reloading with Air
- Frontend development server with Next.js hot reloading
- Follow project branch structure and contributing guidelines

## 📄 License

This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE. See the `LICENSE` file for details.

## 📬 Contact
Maksim - myemail@mail.com

Project link: https://github.com/maksimKarakulin/foodHealth

## 🙏 Acknowledgments

- Thanks to all libraries and frameworks used in this project
- Special thanks to the open-source community for their contributions
