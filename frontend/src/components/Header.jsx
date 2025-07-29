import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); 

  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // --- Logout Handler ---
  const handleLogout = () => {
    
    localStorage.removeItem("user");
    localStorage.removeItem("token");    
    setUser(null);   
    setIsMenuOpen(false);    
    navigate("/login");
  };

  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "Services", path: "/services" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const activeLinkClass = "font-semibold border-b-2 border-white";
  const activeMobileLinkClass = "font-bold bg-indigo-700";

  return (
    <header className="bg-custom-navy text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="ApnaBasera Logo"
            className="w-[60px] h-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/60x60/1A202C/FFFFFF?text=Logo";
            }}
          />
        </Link>

        {/* Hamburger Menu Button (for mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-indigo-200 transition ${
                location.pathname === link.path ? activeLinkClass : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user && user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Admin Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition ${
                location.pathname === "/login" ? "ring-2 ring-white" : ""
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu (collapsible) */}
      <div className={`md:hidden mt-4 ${isMenuOpen ? "block" : "hidden"}`}>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${
                location.pathname === link.path ? activeMobileLinkClass : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-gray-500 mt-4 pt-4">
            {user ? (
              <div className="flex flex-col items-start space-y-3 px-4">
                <span className="text-md font-semibold">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded hover:bg-indigo-700 transition ${
                  location.pathname === "/login" ? activeMobileLinkClass : ""
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
