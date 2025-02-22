# Complaint, NSTU

**"Complaint, NSTU"** is a web application designed to streamline the process of submitting and managing complaints within the NSTU community. It allows students to submit complaints, while admins can efficiently manage and resolve them. The project uses React JS for the frontend and Node.js with Express and MySQL for the backend.

## Features

### Two User Roles (Admin and Student):

#### Admin:

- Manages and views all submitted complaints.
- Can resolve or reject complaints after reviewing them.
- Can track the status of each complaint.
- Can communicate with students about the status of their complaints.
- Manage registered users/students.

#### Student:

- Submits complaints related to university issues.
- Can view the status of their complaints.
- Receives updates and notifications regarding their complaint's status.
- Can communicate with admins about the status of their complaints.

### Google Authentication for Login

- Students log in via Sign Up with Google with their institutional email
- No need for email/password-based login or sign-up.
- Users' full names, departments, batches and email addresses are extracted from Google accounts during authentication.

## Technologies Used:

- Frontend: React JS, Material-UI
- Backend: Node.js, Express
- Database: MySQL
