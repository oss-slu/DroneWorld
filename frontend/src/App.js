import { Provider } from 'react-redux';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wizard from './pages/Wizard';
//import Dashboard from './components/Dashboard';
import FuzzyDashboard from './components/FuzzyDashboard';
import ReportDashboard from './components/ReportDashboard';
import LandingPage from './LandingPage';
import AboutUs from './components/AboutUs';
import NavigationBar from './pages/NavigationBar';
import './styles.css';
import NotFound from './pages/NotFound';

function App() {
  return (
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
