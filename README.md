```markdown
# Food Health Web App

A modern, scalable content management system for food health information, built with a modern stack for performance, security, and scalability.

## 🚀 Features

### Frontend
- **Food Search & Discovery**: Advanced search functionality for finding foods.
- **Detailed Food Information**: Comprehensive view of food details including nutrition, allergens, etc.
- **User Authentication**: Secure user registration, login, and session management.
- **Responsive UI**: Modern, responsive interface built with reusable components using `shadcn/ui` and Tailwind CSS.
- **Real-time Updates**: Dynamic content updates using React Query for efficient data fetching and caching.
- **Type Safety**: Full TypeScript implementation with Zod for schema validation.
- **CRUD Functionality**: Create, Read, Update, and Delete operations for managing food items.

### Backend
- **RESTful API**: Well-structured and performant Go backend using `go-chi` router.
- **Type-safe SQL**:  SQLC for type-safe database interactions, ensuring data integrity and reducing runtime errors.
- **Database Migrations**: `golang-migrate` for efficient and reliable database schema management.
- **Authentication**: JWT (JSON Web Tokens) for secure API authentication and `bcrypt` for password hashing.
- **Hot Reload**:  `Air` for rapid development with live code reloading.
- **API Documentation**: Swagger documentation integrated for API discoverability and ease of use.
- **CORS Support**: Properly configured Cross-Origin Resource Sharing for secure frontend-backend communication.

### DevOps
- **Containerization**: Docker support for consistent development and deployment environments.
- **Local Development**: Docker Compose setup for easy local development with all services.
- **Deployment**:  Designed for easy deployment on platforms like Railway.app.
- **Database**: PostgreSQL for robust and reliable data persistence.

## 🚀 Making the Application Lightweight

To ensure the Food Health App is as lightweight and performant as possible, follow these guidelines:

### 1. Optimize Dependencies

- **Review `package.json`**:  Manually check your `package.json` file in the `frontend` directory. Ensure all listed dependencies are necessary for the current features. If you identify any dependencies that seem redundant or very large for their purpose, consider if they can be removed or replaced with lighter alternatives.
  ```json
  "dependencies": {
    "@clerk/nextjs": "^5.0.0",
    "@radix-ui/react-slot": "^1.0.3",
    "@tanstack/react-query": "^5.0.0",
    "autoprefixer": "10.4.17",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "1.0.4",
    "lucide-react": "^0.344.0",
    "next": "14.1.4",
    "postcss": "8.4.35",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss": "3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  ```
  In this project, the dependencies are generally well-chosen for a modern React application and are likely necessary for the current functionality.

### 2. Optimize Images

**For all images used in the application, apply the following optimizations:**

- **Compress Images**:
    - Before including any image in your project, compress it using tools like:
        - **TinyPNG** ([https://tinypng.com/](https://tinypng.com/)): For PNG and JPEG compression.
        - **ImageOptim** ([https://imageoptim.com/](https://imageoptim.com/)): A free, open-source tool for macOS for more advanced optimization.
        - Online image compression websites: Search for "image compressor online" for various web-based tools.
    - Aim to reduce file size as much as possible while maintaining acceptable visual quality.

- **Use WebP Format**:
    - Convert images to WebP format, especially for larger images like food item images. WebP provides superior compression and quality compared to JPEG and PNG.
    - Use online converters (search for "PNG to WebP converter" or "JPEG to WebP converter") or command-line tools like `cwebp` (part of the `libwebp` utilities).

- **Implement Responsive Images with `next/image`**:
    - Ensure you are using the `<Image>` component from `next/image` for all images in your application. This component automatically handles:
        - **Responsive Images**: Serving appropriately sized images based on the user's viewport, preventing loading of unnecessarily large images on smaller screens.
        - **Lazy Loading**: Images that are not immediately visible in the viewport are loaded only when they are about to come into view, improving initial page load performance.

    **Example Usage in Components:**

    ```jsx
    import Image from 'next/image';

    function FoodCard({ food }) {
      return (
        <CardContent className="aspect-video relative">
          <Image
            src={food.imageUrl || "/placeholder-food.png"}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw" // Example sizes attribute for responsiveness
            onError={(e) => {
              e.currentTarget.src = "/placeholder-food.png";
            }}
            className="object-cover rounded-md"
          />
        </CardContent>
      );
    }
    ```
    - **`sizes` Attribute**:  The `sizes` attribute in `<Image>` is crucial for responsive images. Adjust it based on your layout to ensure different image sizes are loaded for different screen widths.

- **Optimize Placeholder Images**:
    - Even placeholder images like `/placeholder-food.png` should be optimized and kept as small as possible. Use a very compressed format and minimal dimensions suitable for a placeholder.

### 3. Code Review and Optimization

- **Manual Code Review**:
    - Review your React components, especially those that are frequently rendered or involved in complex UI updates (e.g., `FoodCard`, lists of foods on the homepage, forms in `CreateFoodPages` and `EditFoodPage`).
    - Look for potential inefficiencies in rendering logic. Are components re-rendering unnecessarily? Could `React.memo`, `useCallback`, or `useMemo` be used to optimize performance (use judiciously, avoid premature optimization)?
    - Check for any unused components, functions, or styles that can be removed to reduce code size.

### 4. CSS Optimization with Tailwind CSS

- **Production Build for Purging**:
    - Tailwind CSS is configured to purge unused CSS classes in production builds. To ensure this is effective, always build your Next.js application for production using:
      ```bash
      npm run build
      ```
    - Running a production build is essential to see the benefits of Tailwind's CSS purging, which significantly reduces the final CSS bundle size by only including the CSS classes actually used in your components.

### 5. Further Optimization (Beyond WebContainer - For Real Deployments)

- **Bundle Analysis Tools**: In a real-world deployment, use bundle analysis tools (like `webpack-bundle-analyzer`) to get a detailed breakdown of your JavaScript and CSS bundle sizes. This will pinpoint exactly which dependencies or modules are contributing most to the bundle size, allowing for targeted optimization efforts.
- **Performance Monitoring**: Implement performance monitoring in a live environment to track page load times, identify slow components, and continuously optimize performance based on real user data.
- **Content Delivery Network (CDN)**: For production deployments, use a CDN to serve all static assets (images, JavaScript, CSS, fonts). CDNs distribute your content across multiple servers globally, so users download assets from a server geographically closer to them, reducing latency and improving load times significantly.
- **Server-Side Compression (gzip/Brotli)**: Configure your web server (e.g., Nginx, Apache, or your hosting provider's settings) to enable gzip or Brotli compression for serving text-based assets. This reduces the size of files transferred over the network, leading to faster page loads.

By following these guidelines, you can significantly reduce the weight of your Food Health App, leading to faster load times and a better user experience, especially for users on slower connections or devices. Remember that continuous monitoring and optimization are key to maintaining a lightweight and performant web application.

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

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd foodHealth/backend
    ```

2.  **Set up Environment Variables:**

    -   Create a `.env` file in the `backend` directory.
    -   Configure the following environment variables in `.env`:

        ```env
        PORT=8080
        ENVIRONMENT=development
        DATABASE_URL="postgres://<db_user>:<db_password>@localhost:5432/<db_name>?sslmode=disable"
        JWT_SECRET="your-secret-jwt-key"
        ```

        Replace placeholders with your PostgreSQL database credentials and a strong JWT secret key.

3.  **Run Database Migrations:**

    ```bash
    go run cmd/server/main.go migrate up
    ```

4.  **Run Backend with Hot Reload (Air):**

    ```bash
    air
    ```

    The backend server will start at `http://localhost:8080` and automatically reload on code changes.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install npm dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    -   Create a `.env.local` file in the `frontend` directory.
    -   Add frontend environment variables (API URL, Clerk keys, etc.):

        ```env
        NEXT_PUBLIC_API_URL=http://localhost:8080/api
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_api
        CLERK_SECRET_KEY=your_clerk_backend_api
        ```

        Get your Clerk API keys from the Clerk dashboard and set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

4.  **Run the Frontend Development Server:**

    ```bash
    npm run dev
    ```

    The frontend app will be available at `http://localhost:3000`.

### Docker Compose Setup (Local Development)

1.  **Ensure Docker and Docker Compose are installed.**

2.  **Navigate to the project root directory (where `docker-compose.yaml` is located).**

3.  **Create a root `.env` file.**

    -   Add shared environment variables used by both frontend and backend services in your `docker-compose.yaml`. For example:

        ```env
        DATABASE_URL=postgres://food_user:food_password@db:5432/food_db?sslmode=disable
        JWT_SECRET=your-secret-jwt-key
        DB_USER=food_user
        DB_PASSWORD=food_password
        DB_NAME=food_db
        ```

4.  **Start the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds and starts all services defined in `docker-compose.yaml` (backend and database). Access the frontend at `http://localhost:3000` and backend API at `http://localhost:8080`.

## 🚀 Deployment to Railway.app

1.  **Ensure you have a Railway.app account and the Railway CLI installed.**

2.  **Initialize a Railway project:**

    ```bash
    railway init
    ```

3.  **Deploy using Dockerfile:**

    Railway.app automatically detects the Dockerfile in your backend and frontend directories. Ensure your Dockerfile and `.dockerignore` files are correctly configured (as provided in this setup).

4.  **Set Environment Variables on Railway:**

    -   In your Railway project dashboard, configure the necessary environment variables ( `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` etc.).
    -   Railway will use these environment variables for your deployed application.

5.  **Push your code to Railway:**

    ```bash
    railway up
    ```

    Railway.app will build and deploy your application. Monitor the deployment logs in the Railway dashboard.

## 🛡️ Security

-   **Authentication**: Clerk for frontend and JWT for backend API authentication.
-   **Password Hashing**: `bcrypt` for secure password storage.
-   **Type Safety**: TypeScript and SQLC to minimize runtime errors and enhance security.
-   **CORS**:  Properly configured CORS to prevent unauthorized cross-origin requests.
-   **Environment Variables**: Securely manage secrets and configuration using environment variables, especially for deployment on Railway.app.

## 📚 API Documentation

-   Backend API documentation is available in Swagger format at `/swagger/index.html` when the backend server is running.

## 💻 Development

-   Use Air for hot reloading during backend development.
-   Frontend development server provided by Next.js for hot reloading and fast refresh.
-   Follow the branch structure and contributing guidelines outlined in the project documentation.

## 📄 License

This project is licensed under the [License Name]. See the `LICENSE` file for more details.

## 📬 Contact

[Your Name] - [Your Email]

Project Link: [Repository URL]

## 🙏 Acknowledgments

-   Thanks to all the libraries and frameworks used in this project.
-   Special thanks to the open-source community for their contributions.

---

**Next Steps for Lightweight Implementation:**

1.  **Manual Review**:
    - Carefully review `frontend/package.json` for any potentially unnecessary dependencies.
    - Manually review React components for rendering inefficiencies and consider optimization techniques (memoization, etc.).

2.  **Image Optimization**:
    - Ensure all images in `public/` and those used in components are compressed and in WebP format where possible.
    - Verify that `<Image>` components are used correctly with responsive `sizes` attributes.

3.  **Run Production Build**:
    - Execute `npm run build` in the `frontend` directory to create a production build. This will:
        - Trigger Tailwind CSS to purge unused styles, significantly reducing CSS bundle size.
        - Optimize JavaScript bundles using Next.js's production optimizations.

After these steps, your Food Health App will be more lightweight and optimized for better performance. For further in-depth analysis in a real deployment scenario, consider using bundle analysis tools and performance monitoring as outlined in the "Making the Application Lightweight" section above.
```
