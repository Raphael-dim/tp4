import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';

import Header from './components/header';
import { AuthProvider } from './contexts/authContext';
import Annonce from './pages/annonce';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Navigation */}
          <Header />

          {/* Routes */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/annonce" element={<Annonce />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
