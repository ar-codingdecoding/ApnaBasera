import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";

const Notification = ({ message, type, onClear }) => {
  if (!message) return null;

  const baseClasses =
    "p-4 rounded-lg mb-4 text-center text-white shadow-lg transition-opacity duration-300";
  const typeClasses = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onClear} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
};

// Loading spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- Main LoginPage Component ---

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setNotification({ message: "", type: "" });

    try {
      if (isLogin) {
        // --- Login ---
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotification({ message: data.message, type: "success" });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setNotification({
            message: data.message || "An unknown error occurred.",
            type: "error",
          });
        }
      } else {
        // --- Registration ---
        if (formData.password !== formData.confirmPassword) {
          setNotification({
            message: "Passwords do not match!",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotification({ message: data.message, type: "success" });
          setTimeout(() => {
            setIsLogin(true);
            setFormData({
              name: "",
              email: formData.email,
              password: "",
              confirmPassword: "",
            });
          }, 2000);
        } else {
          setNotification({
            message: data.message || "An unknown error occurred.",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error(
        `${isLogin ? "Login" : "Registration"} request failed:`,
        error
      );
      setNotification({
        message: "A network error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      return setNotification({
        message: "Please enter your email to reset your password.",
        type: "error",
      });
    }
    setIsLoading(true);
    setNotification({ message: "", type: "" });
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({ message: data.message, type: "success" });
      } else {
        setNotification({ message: data.message, type: "error" });
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---Google Login ---
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setNotification({ message: "", type: "" });
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: "Google sign-in successful!",
          type: "success",
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setNotification({
          message: data.message || "Google sign-in failed.",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "A network error occurred with Google Sign-In.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setNotification({
      message: "Google login failed. Please try again.",
      type: "error",
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setNotification({ message: "", type: "" });
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 font-sans">
      {/* Left Column: Image Section */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800')",
        }}
      >
        <div className="h-full bg-black bg-opacity-50 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            {isLogin ? "Welcome Back to ApnaBasera" : "Join ApnaBasera Today"}
          </h1>
          <p className="text-lg opacity-90">
            {isLogin
              ? "Your next home is just a click away. Find the perfect place to stay."
              : "Discover amazing places to stay and create unforgettable memories."}
          </p>
        </div>
      </div>

      {/* Right Column: Form Section */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-12 bg-gray-100">
        <div className="bg-gradient-to-br from-purple-600 to-blue-800 p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </h2>

          <Notification
            message={notification.message}
            type={notification.type}
            onClear={() => setNotification({ message: "", type: "" })}
          />

          <form onSubmit={handleFormSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-3 border border-gray-300 bg-white bg-opacity-80 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full p-3 border border-gray-300 bg-white bg-opacity-80 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full p-3 border border-gray-300 bg-white bg-opacity-80 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 border border-gray-300 bg-white bg-opacity-80 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-white hover:underline focus:outline-none"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center"
            >
              {isLoading && <Spinner />}
              {isLoading
                ? isLogin
                  ? "Logging in..."
                  : "Creating Account..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-200 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="rectangular"
            />
          </div>

          <div className="text-center">
            <p className="text-gray-200 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-white font-semibold hover:underline focus:outline-none"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;