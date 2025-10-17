Job Hunt Platform 🚀

A full-stack job portal designed to seamlessly connect companies with talented job seekers. Built with a modern MERN stack, it offers a secure, scalable, and intuitive solution for job postings, applications, and applicant management.

Live Demo: [https://job-hunt-portal-omega.vercel.app/]

✨ Key Features

    🏢 Company Portal: Companies can register, create a profile, and manage their job listings from a dedicated dashboard.

    👨‍💻 Job Seeker Accounts: Applicants can create profiles, browse jobs, and apply with ease.

    📄 Dynamic Job Postings: Create, read, update, and delete job listings with detailed descriptions and requirements.

    📈 Applicant Tracking: Efficiently view and manage applications for each job posting.

    🔐 Secure Authentication: Implemented with JSON Web Tokens (JWT) for secure user sessions.

    🔄 Centralized State Management: Uses Redux Toolkit for predictable and smooth state management across the application.

    ☁️ Cloud Media Storage: Integrated with Multer and Cloudinary for handling file uploads like company logos and resumes.

    🚀 Optimized for Deployment: Frontend hosted on Vercel and backend on Render for high availability and performance.

🛠️ Tech Stack

Category	Technology
Frontend	React.js, Redux Toolkit, React Router, Tailwind CSS
Backend	Node.js, Express.js
Database	MongoDB with Mongoose ODM
Authentication	JSON Web Token (JWT), bcrypt.js
File Handling	Multer, Cloudinary
Deployment	Vercel (Frontend), Render (Backend)

🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

    Node.js (v18 or later)

    npm or yarn

    MongoDB Atlas account or a local MongoDB installation

    Cloudinary account

Installation

    Clone the repository:
    Bash

git clone https://github.com/your-username/job-hunt-platform.git
cd job-hunt-platform

Install backend dependencies:
Bash

cd server
npm install

Install frontend dependencies:
Bash

    cd ../client
    npm install

Environment Variables

To run the application, you need to set up your environment variables.

    Create a .env file in the /server directory.

    Add the following variables, replacing the placeholder values with your actual credentials:
    Code snippet

    # MongoDB Connection
    MONGO_URI=your_mongodb_connection_string

    # JWT Authentication
    JWT_SECRET=your_super_secret_jwt_key
    JWT_LIFETIME=30d

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Server Port
    PORT=8800

Running the Application

    Start the backend server (from the /server directory):
    Bash

npm start

The server will be running on http://localhost:8800.

Start the frontend development server (from the /client directory):
Bash

    npm run dev

    The application will open in your browser at http://localhost:5173 (or another port if 5173 is busy).

🚀 Deployment

This project is configured for easy deployment:

    Frontend (Vercel): Connect your GitHub repository to Vercel. It will automatically detect the React (Vite) setup and deploy the /client directory.

    Backend (Render): Create a new "Web Service" on Render and connect it to your repository. Set the build command to npm install and the start command to npm start. Add the necessary environment variables in the Render dashboard.
