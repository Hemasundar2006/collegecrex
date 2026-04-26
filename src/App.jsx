import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Polycet from './pages/Polycet';
import DreamCollege from './pages/DreamCollege';
import Eamcet from './pages/Eamcet';
import Ecet from './pages/Ecet';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/polycet" element={<Polycet />} />
            <Route path="/dream-college" element={<DreamCollege />} />
            <Route path="/eamcet" element={<Eamcet />} />
            <Route path="/ecet" element={<Ecet />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
