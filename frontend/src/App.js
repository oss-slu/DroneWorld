import React from "react";
import { MainJsonProvider } from './contexts/MainJsonContext';  // Make sure to import the provider
import CesiumMap from './CesiumMap';  // Your CesiumMap component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import FuzzyDashboard from './components/FuzzyDashboard';
import ReportDashboard from './components/ReportDashboard';
import LandingPage from './LandingPage';
import AboutUs from './components/AboutUs';
import NavigationBar from './pages/NavigationBar';
import './styles.css';
import NotFound from './pages/NotFound';

function App() {
  return (
    <MainJsonProvider>  {/* Wrap everything inside MainJsonProvider */}
      <div>
        <NavigationBar />
        <Router>
          <Routes>
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/simulation' element={<Wizard />} />
            <Route exact path='/dashboard' element={<FuzzyDashboard />} />
            <Route exact path='/report-dashboard' element={<ReportDashboard />} />
            <Route exact path='/' element={<LandingPage />} />
            <Route exact path='/about-us' element={<AboutUs />} />
            <Route exact path='*' element={<NotFound />} />
            <Route exact path='/cesium-map' element={<CesiumMap />} />
          </Routes>
        </Router>
      </div>
    </MainJsonProvider>
  );
}

export default App;
