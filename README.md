# Digital e-Sevai Service Portal

A complete MERN stack web application for managing citizen service requests, document collection, status updates, and final certificate delivery.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Uploads: Multer with local file storage
- Notifications: In-app notifications with optional email via Nodemailer

## Features

- Customer registration and login
- Service request submission
- Admin request queue and status management
- Requested document collection workflow
- Secure document uploads and final certificate upload
- Customer notification center
- Simple admin analytics dashboard
- File preview and responsive UI

## Main Workflow

1. Customer registers and logs in.
2. Customer selects a service and submits a request.
3. Admin reviews the request in the dashboard.
4. Admin marks the request as `Documents Required` and sends required document names.
5. Customer receives a notification and uploads the requested files.
6. Admin reviews uploads and updates the request status.
7. Admin uploads the final document and completes the request.
8. Customer downloads the completed certificate.

## Folder Structure

```text
digital-e-sevai-service-portal/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |   |-- common/
|   |   |   |-- dashboard/
|   |   |   `-- layout/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |   |-- admin/
|   |   |   `-- customer/
|   |   `-- utils/
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- constants/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- uploads/
|   `-- package.json
|-- package.json
`-- README.md
```

## Database Models

### Users

- `name`
- `email`
- `password`
- `phone`
- `role`

### ServiceRequests

- `userId`
- `serviceName`
- `description`
- `status`
- `verificationState`
- `requestedDocuments`
- `uploadedDocuments`
- `adminNotes`
- `completedFile`
- `timeline`
- `createdAt`

### Notifications

- `userId`
- `title`
- `message`
- `type`
- `isRead`
- `metadata.requestId`

## Backend API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Customer Requests

- `GET /api/requests/services`
- `POST /api/requests`
- `GET /api/requests/my`
- `GET /api/requests/:id`
- `POST /api/requests/:id/documents`

### Admin

- `GET /api/admin/requests`
- `GET /api/admin/requests/:id`
- `PATCH /api/admin/requests/:id/status`
- `PATCH /api/admin/requests/:id/request-documents`
- `POST /api/admin/requests/:id/final-document`
- `GET /api/admin/analytics`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:id/read`

## Local Setup

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Configure environment files

Default local `.env` files are already included for quick startup:

- `server/.env`
- `client/.env`

You can still update them any time using the `.env.example` files as references.

### 3. Start MongoDB

Make sure a local MongoDB instance is running at `mongodb://127.0.0.1:27017/digital-e-sevai` or update `server/.env`.

### 4. Run the application

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Default Local Admin Login

If no admin exists, the backend seeds one automatically from environment values:

- Email: `admin@esevai.local`
- Password: `Admin@123`

Change these values in `server/.env` for local development.

## Notes

- Uploaded files are stored in `server/uploads`.
- Email notifications fall back to a JSON preview logger when SMTP is not configured.
- The admin dashboard supports document requests, status changes, analytics, and final document uploads.
