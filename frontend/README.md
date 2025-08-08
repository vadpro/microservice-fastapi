# Microservice Frontend

This is a Next.js frontend application for the microservice architecture with Keycloak authentication.

## Features

- **Conditional Logout Button**: The logout button is only displayed when the user is authenticated
- **Authentication Flow**: Login/logout functionality with Keycloak integration
- **Protected Routes**: Middleware handles authentication checks and redirects
- **Responsive Design**: Built with Tailwind CSS

## Key Implementation

### Authentication State Management

The application uses server-side authentication checking:

1. **Layout Component** (`app/layout.tsx`): Checks for authentication cookies server-side and conditionally renders the logout button
2. **Middleware** (`middleware.ts`): Handles route protection and redirects unauthenticated users to login
3. **Login Page** (`app/login/page.tsx`): Only shows login form when user is not authenticated

### Logout Button Visibility

The logout button is conditionally displayed based on authentication status:

```tsx
// In layout.tsx
const cookieStore = cookies()
const accessToken = cookieStore.get('access_token')
const isAuthenticated = !!accessToken?.value

return (
  <header>
    <h1>Microservice App</h1>
    {isAuthenticated && <LogoutButton />}
  </header>
)
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

- `KEYCLOAK_URL`: The Keycloak server URL (default: http://localhost:7070)

## Authentication Flow

1. Unauthenticated users are redirected to `/login`
2. After successful login, access and refresh tokens are stored as HTTP-only cookies
3. The logout button only appears in the header when the user is authenticated
4. On logout, cookies are cleared and user is redirected to login page