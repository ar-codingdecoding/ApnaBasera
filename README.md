# 🏡 ApnaBasera - Full-Stack Student Housing Platform
#### Live Link--- https://apnabasera-frontend.onrender.com
ApnaBasera is a modern, full-stack web application designed to help students and professionals find verified PGs, hostels, and flats. The platform also includes a student marketplace, service listings, and an integrated AI chatbot for user assistance.

## ✨ Key Features

  * **Authentication**: Secure user registration and login with email/password, including password hashing (`bcrypt`) and JWT for session management.
  * **Social Login**: Seamless "Continue with Google" option for both login and registration (OAuth 2.0).
  * **Admin Dashboard**: A protected admin route with full CRUD (Create, Read, Update, Delete) functionality to manage property listings.
  * **Dynamic Listings**: Users can browse and filter property listings by type, location, beds, and baths.
  * **Secure Payments**: Integrated **Razorpay** payment gateway on property cards to simulate a booking flow.
  * **AI-Powered Chatbot**: A site-wide chatbot powered by the **Groq AI** API to answer user queries in real-time.
  * **Secure Password Reset**: Fully functional "Forgot Password" feature that sends a secure, time-limited reset link to the user's email using **Nodemailer**.
  * **Student Services & Marketplace**: Dedicated pages to display available student services and a marketplace for second-hand goods.
  * **Fully Responsive**: Modern and responsive design using Tailwind CSS, ensuring a great user experience on all devices.

## 🚀 Tech Stack

### Frontend

  * **Framework**: React (with Vite)
  * **Styling**: Tailwind CSS
  * **Routing**: React Router DOM
  * **Icons**: Lucide React
  * **Authentication**: Google OAuth Library

### Backend

  * **Runtime**: Node.js
  * **Framework**: Express.js
  * **Database**: MongoDB (with Mongoose)
  * **Authentication**: JSON Web Tokens (JWT), bcrypt
  * **APIs**:
      * Groq AI API for the chatbot
      * Razorpay API for payments
      * Cloudinary for image uploads (via Multer)
      * Nodemailer for sending emails

## 🛠️ Local Setup and Installation

### Prerequisites

  * Node.js (v18 or higher)
  * npm
  * A code editor (e.g., VS Code)
