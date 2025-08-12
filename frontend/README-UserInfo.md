# User Information and Access Control

This document describes the user information display and role-based access control features implemented in the frontend.

## Features

### 1. User Information Display
- **UserInfo Component**: Detailed user information panel showing:
  - User name, username, and email
  - Email verification status
  - Assigned roles and permissions
  - Available actions based on roles
  - User avatar with initials

- **CompactUserInfo Component**: Compact user info for the main page header showing:
  - User name and email
  - Role badges
  - Admin access indicator

### 2. Role-Based Access Control
- **User Role**: Required for basic operations
  - View casts and movies
  - Create new casts
  - Create new movies
  - Delete movies

- **Admin Role**: Additional administrative privileges
  - All user permissions
  - Administrative operations (when implemented)

### 3. Keycloak Integration
The frontend now fetches user information directly from Keycloak using:
- `/api/auth/userinfo` endpoint for user profile data
- Token introspection for role information
- Real-time role validation

## API Endpoints

### `/api/auth/userinfo`
Fetches comprehensive user information from Keycloak:
- User profile data (name, email, etc.)
- Realm roles
- Resource-specific roles
- Token validation

## Components

### UserInfo.tsx
Full-featured user information component with:
- Loading states
- Error handling
- Role-based action indicators
- Responsive design

### CompactUserInfo.tsx
Lightweight user info for headers with:
- Essential user data
- Role badges
- Admin indicators

## Usage

The components are automatically integrated into:
- Main page (`page.tsx`)
- Casts section (`sections/casts.tsx`)
- Movies section (`sections/movies.tsx`)

## Environment Variables

Required environment variables for Keycloak integration:
```env
KEYCLOAK_URL=http://host.docker.internal:7070
KEYCLOAK_REALM=FastAPIRealm
KEYCLOAK_CLIENT_ID=FastAPIClient
KEYCLOAK_CLIENT_SECRET=your_client_secret
```

## Security Features

1. **Token Validation**: All requests validate JWT tokens
2. **Role Checking**: UI elements are conditionally rendered based on user roles
3. **Access Control**: Operations are disabled for users without required roles
4. **Error Handling**: Graceful fallbacks when user information is unavailable

## Future Enhancements

- Admin panel for user management
- Role assignment interface
- Permission management
- Audit logging
- Session management
