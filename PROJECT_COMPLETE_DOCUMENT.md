# DIGITAL E-SEVAI SERVICE PORTAL

## PROJECT REPORT

Academic Year: 2025-2026  
Department: UG Computer Science (SF)  
Batch: 2023-2026 (A and B Section)

---

## SYNOPSIS

The Digital e-Sevai Service Portal is a web-based application developed to simplify and digitize citizen service request processing. In many manual systems, users must repeatedly visit offices, submit physical documents, and wait without clear status updates. This project solves those issues by providing a complete online request lifecycle from request creation to final certificate delivery.

The system is built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Customers can register, log in, choose a service, submit requests, upload documents, and track status updates. Administrators can review requests, ask for missing documents, update progress, and upload final processed certificates. The platform also includes a notification center so users are informed at every stage.

This project improves transparency, reduces processing delay, minimizes paperwork, and provides a scalable structure for future government and institutional service automation.

---

## CHAPTER 1: INTRODUCTION

### 1.1 Overview of the Project

Digital services are now essential for efficient public service delivery. The Digital e-Sevai Service Portal is designed to handle service applications digitally with clear tracking and secure file management. The portal provides a user-friendly interface for both citizens and administrators and removes repetitive manual operations.

### 1.2 Description of the Module

The system is divided into the following modules:

1. User Authentication Module
- Customer registration and login
- JWT-based secure authentication
- Role-based access control for customer and admin

2. Service Request Module
- Service selection and request submission
- Request details and status tracking
- Request history for each user

3. Document Management Module
- Admin requests specific documents
- Customer uploads required documents
- Admin reviews uploaded files

4. Admin Management Module
- Request queue management
- Status updates and admin notes
- Final document upload and completion handling

5. Notification Module
- In-app notifications for status changes
- Read and unread tracking
- Optional email notification integration

### 1.3 System Specification

#### 1.3.1 Hardware Specification
- Processor: Intel Core i3 or above
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 20 GB free space minimum
- Network: Stable internet connectivity

#### 1.3.2 Software Specification
- Operating System: Windows 10/11 or Linux
- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- API Testing Tool: Postman
- Code Editor: Visual Studio Code
- Browser: Chrome/Edge/Firefox

### 1.4 Software Features

#### 1.4.1 Front End
- Responsive user interface with React and Tailwind CSS
- Separate pages for customer and admin workflows
- Form validation and clean UI components
- Notification drawer for real-time updates

#### 1.4.2 Back End
- RESTful APIs with Express.js
- Authentication and authorization middleware
- File upload support using Multer
- MongoDB schema models for users, requests, and notifications
- Error handling middleware for reliable API responses

---

## CHAPTER 2: SYSTEM STUDY

### 2.1 Existing System

The traditional service request system is mostly manual and paper-based. Citizens submit forms physically, provide photocopies of documents, and repeatedly visit offices for follow-up. Request progress is often unknown, causing confusion and delay.

### 2.1.1 Drawbacks of Existing System

- Time-consuming manual processing
- Lack of transparency in request status
- Document misplacement risk
- High dependency on office visits
- Poor communication between users and officials
- Difficulty in tracking request history

### 2.2 Proposed System

The proposed digital portal automates request processing through a centralized web application. Users can apply online, upload documents, receive notifications, and download final output documents. Administrators can manage all requests through a dedicated dashboard.

### 2.2.1 Advantages of Proposed System

- Faster and structured processing
- Transparent request lifecycle tracking
- Reduced paperwork and office visits
- Secure digital storage of documents
- Better communication through notifications
- Scalable architecture for additional services

---

## CHAPTER 3: SYSTEM DESIGN AND DEVELOPMENT

### 3.1 Input Design

Input forms are designed with clear labels and required validations:
- User registration form
- Login form
- Service request submission form
- Document upload form
- Admin request update form

Validation checks include required fields, email format, and controlled file handling.

### 3.2 Database Design

The application uses MongoDB with the following collections:

#### 3.2.1 Table Design (Collections)

1. Users
- name
- email
- password
- phone
- role

2. ServiceRequests
- userId
- serviceName
- description
- status
- verificationState
- requestedDocuments
- uploadedDocuments
- adminNotes
- completedFile
- timeline
- createdAt

3. Notifications
- userId
- title
- message
- type
- isRead
- metadata.requestId

#### 3.2.2 E-R Diagram (Textual Representation)

- One User can create many ServiceRequests (1:M)
- One User can receive many Notifications (1:M)
- One ServiceRequest belongs to one User (M:1)
- Notifications may refer to one ServiceRequest through metadata

#### 3.2.3 Dataflow Diagram (Level-0 Description)

1. Customer submits request data to portal
2. Portal stores request in database
3. Admin reviews and updates status
4. Portal sends notification to customer
5. Customer uploads required documents
6. Admin verifies and uploads final document
7. Customer downloads completed certificate

### 3.3 Code Design

The project follows a modular structure:

- client/src/api: API integration methods
- client/src/components: reusable UI components
- client/src/pages: page-level views for admin and customer
- server/src/controllers: request handling logic
- server/src/routes: API route definitions
- server/src/models: Mongoose schemas
- server/src/middleware: auth, error, upload middlewares
- server/src/services: notification and email services

This structure improves maintainability and team collaboration.

### 3.4 Output Design

Major outputs:
- Request ID and submission confirmation
- Real-time request status updates
- Document request notifications
- Final certificate file for download
- Admin analytics summary

---

## CHAPTER 4: SYSTEM TESTING AND IMPLEMENTATION

### 4.1 System Testing

Testing methods used:

1. Unit-level API testing
- Authentication endpoints
- Request creation and update endpoints
- Notification endpoints

2. Integration testing
- Customer to admin workflow validation
- Status update and notification flow checks

3. UI testing
- Form validations
- Navigation between pages
- Mobile responsiveness checks

### 4.2 Test Case

1. Customer Registration Test
- Input: Valid name, email, phone, password
- Expected: Account created successfully
- Result: Pass

2. Customer Login Test
- Input: Correct credentials
- Expected: Login success and token generation
- Result: Pass

3. Request Submission Test
- Input: Service and description
- Expected: Request created with initial status
- Result: Pass

4. Document Upload Test
- Input: Valid file format and size
- Expected: File uploaded and linked to request
- Result: Pass

5. Admin Status Update Test
- Input: Change status to Documents Required or Completed
- Expected: Status updated and notification sent
- Result: Pass

6. Final Document Delivery Test
- Input: Admin uploads completed file
- Expected: User can view/download final document
- Result: Pass

### 4.3 System Implementation

Implementation steps:

1. Initialize frontend and backend projects
2. Configure MongoDB database connection
3. Develop authentication and role-based access control
4. Build service request and document upload APIs
5. Build customer and admin UI pages
6. Integrate notifications and optional email service
7. Test complete lifecycle and fix defects
8. Deploy in local environment for demonstration

### 4.4 System Maintenance

- Routine dependency updates
- Security patch updates
- Backup of uploaded documents and database
- Log monitoring and issue resolution
- Feature enhancements based on user feedback

---

## CHAPTER 5: CONCLUSION

The Digital e-Sevai Service Portal successfully replaces manual processing with an organized digital platform. It enables customers to submit and track service requests online and allows administrators to process requests efficiently. The system improves transparency, reduces processing delay, and ensures better document management. The project meets the intended objectives and demonstrates the practical benefits of web-based service automation.

---

## CHAPTER 6: SCOPE FOR FUTURE ENHANCEMENT

1. OTP-based and multi-factor authentication
2. SMS and WhatsApp notification support
3. Online payment gateway integration
4. Digital signature integration for certificates
5. AI-based document verification support
6. Multi-language user interface
7. Cloud storage integration for scalable file handling
8. Advanced analytics with downloadable reports

---

## CHAPTER 7: BIBLIOGRAPHY

1. React Documentation - https://react.dev/
2. Node.js Documentation - https://nodejs.org/
3. Express.js Documentation - https://expressjs.com/
4. MongoDB Documentation - https://www.mongodb.com/docs/
5. Mongoose Documentation - https://mongoosejs.com/docs/
6. Tailwind CSS Documentation - https://tailwindcss.com/docs
7. JWT Introduction - https://jwt.io/introduction

---

## CHAPTER 8: APPENDIX

### A. Sample Screens and Reports

Include screenshots for:
- Home page
- Customer login/register pages
- Customer dashboard
- Request submission page
- Upload documents page
- Admin dashboard
- Admin request details page
- Notification drawer

### B. Sample Coding

Include key code snippets from:
- Authentication controller
- Request controller
- Notification service
- File upload middleware
- React pages for customer and admin workflow

---

## REVIEW SCHEDULE (AS PROVIDED)

- Review I: 15.12.2025
- Review II: 12.01.2026
- Review III: 25.02.2026
- Rough Copy Submission: 03.03.2026
- Final Submission: 09.03.2026

---

## DECLARATION (OPTIONAL FORMAT)

I hereby declare that this project report titled "Digital e-Sevai Service Portal" is the original work carried out by me/us under the guidance of the faculty guide and has not been submitted to any other institution for the award of any degree or diploma.

Student Signature: ____________________  
Guide Signature: ____________________  
HOD Signature: ____________________
