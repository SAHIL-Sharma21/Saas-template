# Next.js SaaS Template with Clerk Authentication

A modern, subscription-based Todo application built with Next.js 14+, featuring Clerk authentication, Prisma + Drizzle ORM, and shadcn/UI components.

## Features
- 🔐 Authentication with Clerk
- 💳 Subscription management
- 🎯 Todo management system
- 🎨 Modern UI with shadcn/UI
- 🔄 Real-time updates with webhooks
- 📱 Responsive design
- 🔍 TypeScript support
- 🗄️ Prisma ORM for database management 

## Tech Stack
- **Framework:** Next.js 14+ (App router)
- **Authentication:** Clerk
- **Database:** postgresql (Prisma + Drizzle ORM)
- **UI Components:** shadcn/UI
- **Styling:** Tailwind CSS
- **language:**: Typescript + Javascript


## Prerequisites

 Before you begin, ensure you have the following installed:
 - Node 16.0+ or latest
 - Npm or Yarn
 - Git

 ## Getting Started
 1. Clone the repository:
 ```bash
git clone https://github.com/SAHIL-Sharma21/Saas-template.git
cd Saas-template
 ``` 

 2. Install dependencies:
 ```bash
npm install
#or
yarn install
 ```

 3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```bash
DATABASE_URL="your_database_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
WEBHOOK_SECRET="your_webhook_secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
# if you are facing error in prism then visit the prisma official docs. 
```
- [prisma docs](https://www.prisma.io/docs)

5. Run the development server
```bash
npm run dev
#or 
yarn dev
```

## Project structure
```bash
├── app/                 # Next.js 13 app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets
└── types/              # TypeScript type definitions
```


## Authentication
This template uses Clerk for authentication. The following features are implemented:
- User sign up and sign in
- OAuth providers
- Protected routes
- Authentication webhooks

## Database Schema
The database schema is defined in the `prisma/schema.prisma` file. It includes the following tables:
- Users (managed by clerk)
- Todos
- Subscriptions

## API Routes
The API routes for the application are defined in the `app/api` directory. These routes are protected by Clerk authentication and are used to manage the Todo list and subscriptions.

- `/api/admin/todos` - Admin route for managing todos
- `/api/admin` - Admin routes
- `/api/admin/subscriptions` - Admin route for managing subscriptions
- `/api/todos` - Route for managing todos
- `/api/admin/users` - Admin route for managing users


## Webhook Integrations
Clerk webhooks are configured to:
1. Sync user data with your database
2. Handle subscription events
3. Manage user deletion


## Acknowledgments
- [Next.js](https://nextjs.org/docs)
- [clerk](https://clerk.com/docs)
- [shadcn/UI](https://ui.shadcn.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Neon](https://neon.tech/docs/introduction)

## License
This project is licensed under the [MIT License](LICENSE).
