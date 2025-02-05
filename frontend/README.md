```md
# Food Health Frontend - Next.js 14

This frontend is built with Next.js 14 using the app router, shadcn/ui components, Clerk for authentication, React Query for data fetching, and Zod for schema validation.

## Technologies Used

-   **Frontend Framework**: Next.js 14 (App Router)
-   **UI Components**: shadcn/ui
-   **Authentication**: Clerk
-   **Data Fetching & Caching**: React Query
-   **Form Validation**: Zod
-   **Styling**: Tailwind CSS
-   **Code Formatting**: Prettier
-   **Linting**: ESLint

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    -   Create a `.env.local` file in the root directory of the `frontend` app.
    -   Add the following environment variables, replacing placeholders with your actual values:

        ```env
        NEXT_PUBLIC_API_URL=http://localhost:8080/api
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_api
        CLERK_SECRET_KEY=your_clerk_backend_api
        ```

        *Note*:  `CLERK_SECRET_KEY` is generally used for backend operations in a Next.js application if you were to use Next.js API routes for server-side Clerk interactions. For a purely frontend authenticated app, you might primarily need `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.  Always handle `CLERK_SECRET_KEY` securely and avoid exposing it in frontend code.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Key Components and Structure

-   **`app/` directory**:  Next.js App Router for routing and page structure.
-   **`components/ui/`**:  Reusable UI components built with shadcn/ui and Radix UI.
-   **`lib/api.ts`**:  React Query hooks and API interaction functions.
-   **`types/`**: TypeScript type definitions for data models.
-   **`contexts/AuthContext.tsx`**:  Authentication context to manage user auth state (using Clerk).

## Authentication with Clerk

-   Clerk is used for user authentication and management.
-   `ClerkProvider` wraps the application in `_app.tsx` to provide authentication context.
-   `useUser` hook from `@clerk/nextjs` is used to access user and session data within components.
-   Environment variables for Clerk are set in `.env.local`.

## Data Fetching with React Query

-   `@tanstack/react-query` is used for efficient data fetching, caching, and state management.
-   Custom hooks in `lib/api.ts` (e.g., `useFoodDetails`, `useSearchFoods`) encapsulate data fetching logic.
-   Queries are defined using `useQuery` and managed by React Query's caching and invalidation strategies.

## Code Style and Formatting

-   **Prettier**:  Code formatting to maintain a consistent style. Run `npm run format` to format code.
-   **ESLint**:  Linting to catch code quality issues and enforce best practices. Run `npm run lint` to check for linting errors.

---

This README provides a basic guide to setting up and understanding the frontend application. For more detailed information, refer to the comments in the code and the documentation for each technology used.
```
