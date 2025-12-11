# Architecture & Tech Stack

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **UI Components**: Radix UI (via dependencies) and Lucide React for icons.
- **Containerization**: Docker (Alpine-based Node.js image)

## Directory Structure

- `app/`: Next.js app router pages and layouts.
- `components/`: Reusable React components.
- `lib/`: Utility libraries and shared code.
- `prisma/`: Prisma schema and database configuration.
- `public/`: Static assets (images, uploads).
- `styles/`: Global styles and CSS configurations.
- `Dockerfile`: Multi-stage Docker build configuration.
- `docker-compose.yml`: Docker Compose configuration for defining services.

## Database

The project uses Prisma to interact with a MySQL database. The schema is defined in `prisma/schema.prisma` (assumed based on `prisma` folder presence).
Basic operations are handled via Prisma Client.
