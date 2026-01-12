import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';

import MyBids from './pages/MyBids';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-gig" element={<CreateGig />} />
          <Route path="/gigs/:id" element={<GigDetails />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
