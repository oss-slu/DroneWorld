import React from "react";
import { MainJsonProvider } from './contexts/MainJsonContext';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import FuzzyDashboard from './components/FuzzyDashboard';
import ReportDashboard from './components/ReportDashboard';
import LandingPage from './LandingPage';
import AboutUs from './pages/AboutUs';
import NavigationBar from './pages/NavigationBar';
import Footer from './pages/Footer';
import './styles.css';
import NotFound from './pages/NotFound';

function App() {
  return (
    <MainJsonProvider>
      <Router>
        <div>
          <NavigationBar />
          <Routes>
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/simulation' element={<Wizard />} />
            <Route exact path='/dashboard' element={<FuzzyDashboard />} />
            <Route exact path='/report-dashboard' element={<ReportDashboard />} />
            <Route exact path='/' element={<><LandingPage /></>} />
            <Route exact path='/about-us' element={<AboutUs />} />
            <Route exact path='*' element={<NotFound />} />
            
          </Routes>
          <Footer />
        </div>
      </Router>
    </MainJsonProvider>
  );
}


export default App;

