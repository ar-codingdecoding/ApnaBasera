import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ListingsPage from "./Pages/ListingsPage.jsx";
import ServicesPage from "./Pages/ServicesPage.jsx";
import MarketplacePage from "./Pages/MarketplacePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import Chatbot from "./components/Chatbot.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="admin/dashboard" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;