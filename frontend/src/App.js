import { Provider } from 'react-redux';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wizard from './pages/Wizard';
//import Dashboard from './components/Dashboard';
import FuzzyDashboard from './components/FuzzyDashboard';
import ReportDashboard from './components/ReportDashboard'; 
import LandingPage from './LandingPage'; 
import AboutUs from './components/AboutUs'; 
import "./styles.css" 



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/simulation' element={<Wizard/>} />
        <Route exact path='/dashboard' element={<FuzzyDashboard />} /> 
        <Route exact path = '/report-dashboard' element = {<ReportDashboard/>} />  
        <Route exact path = '/landing-page' element = {<LandingPage/>} />  
        <Route exact path = '/about-us' element = {<AboutUs/>} />  
        
      </Routes>
    </Router>
  );
}

export default App;