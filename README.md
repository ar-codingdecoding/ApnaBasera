# 🏡 ApnaBasera - Full-Stack Student Housing Platform
# Live Link--- https://apnabasera-frontend.onrender.com
ApnaBasera is a modern, full-stack web application designed to help students and professionals find verified PGs, hostels, and flats. The platform also includes a student marketplace, service listings, and an integrated AI chatbot for user assistance.

## ✨ Key Features

  * **Authentication**: Secure user registration and login with email/password, including password hashing (`bcrypt`) and JWT for session management.
  * **Social Login**: Seamless "Continue with Google" option for both login and registration (OAuth 2.0).
  * **Admin Dashboard**: A protected admin route with full CRUD (Create, Read, Update, Delete) functionality to manage property listings.
  * **Dynamic Listings**: Users can browse and filter property listings by type, location, beds, and baths.
  * **Secure Payments**: Integrated **Razorpay** payment gateway on property cards to simulate a booking flow.
  * **AI-Powered Chatbot**: A site-wide chatbot powered by the **Google AI (Gemini)** API to answer user queries in real-time.
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
      * Google AI (Gemini) API for the chatbot
      * Razorpay API for payments
      * Cloudinary for image uploads (via Multer)
      * Nodemailer for sending emails

## 🛠️ Local Setup and Installation

### Prerequisites

  * Node.js (v18 or higher)
  * npm
  * A code editor (e.g., VS Code)

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/ApnaBasera.git
cd ApnaBasera
```

### 2\. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend folder and add your secret keys
# (Make sure to replace the placeholder values)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_HOST=your_smtp_host
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Start the backend server
npm run server
```

### 3\. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file in the /frontend folder
VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

Your application should now be running, with the frontend available at `http://localhost:5173` and the backend at `http://localhost:5000`.
