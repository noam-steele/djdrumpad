import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Board from './pages/Board';
import Config from './pages/Config';
import Samples from './pages/Samples';
import './App.css';

const Navigation = () => {
  const location = useLocation();
  return (
    <Navbar bg="transparent" variant="dark" expand="lg" className="mb-4 glass-nav">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">DJ Board</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Play</Nav.Link>
          <Nav.Link as={Link} to="/config" active={location.pathname === '/config'}>Config</Nav.Link>
          <Nav.Link as={Link} to="/samples" active={location.pathname === '/samples'}>Samples</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

function App() {
  return (
    <SoundProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <Container>
            <Routes>
              <Route path="/" element={<Board />} />
              <Route path="/config" element={<Config />} />
              <Route path="/samples" element={<Samples />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </SoundProvider>
  );
}

export default App;
