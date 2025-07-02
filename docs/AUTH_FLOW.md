    # Authentication Flow

This document describes the complete sign-up and sign-in flow for the application, including file locations and implementation details.

---

## 1. Sign-Up Flow

- **Page:** `/auth/signup` (`app/auth/signup/page.tsx`)
  - Modern, accessible form for name (optional), email, and password.
  - On submit, sends a POST request to `/api/auth/signup`.

- **API Route:** `/api/auth/signup` (`app/api/auth/signup/route.ts`)
  - Accepts name, email, and password.
  - Checks if the email is already registered.
  - Hashes the password using `bcryptjs`.
  - Creates a new user in the database (Prisma `User` model).
  - Returns success or error message as JSON.

## 2. Sign-In Flow

- **Page:** `/auth/signin` (`app/auth/signin/page.tsx`)
  - Modern, accessible form for email and password.
  - On submit, calls NextAuth's `signIn` with the credentials provider.
  - Displays error messages from NextAuth.

- **API Route:** `/api/auth/[...nextauth]` (`app/api/auth/[...nextauth]/route.ts`)
  - Uses NextAuth.js with the credentials provider.
  - Looks up the user by email using Prisma.
  - Compares the provided password with the hashed password using `bcryptjs`.
  - If valid, returns the user object (excluding password) to NextAuth.
  - Handles JWT session strategy.

## 3. User Model

- **File:** `prisma/schema.prisma`
  - `User` model includes `id`, `email`, `name`, `password` (hashed), `isPro`, `stripeCustomerId`, etc.
  - Passwords are always stored hashed.

## 4. Key Packages
- `next-auth` for authentication
- `@prisma/client` for database access
- `bcryptjs` for password hashing

## 5. Testing the Flow
- Register a new user at `/auth/signup`.
- Log in at `/auth/signin`.
- Try invalid credentials and duplicate emails to confirm error handling.

## 6. Next Steps
- Add sign-out functionality and user session display.
- Create a user dashboard or account page.
- Protect Pro features and dashboard routes for authenticated users only.
- (Optional) Add OAuth providers (Google, GitHub, etc.).

---

_Keep this document updated as the authentication system evolves!_ 