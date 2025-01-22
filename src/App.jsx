import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Jobs from './components/Jobs';
import EmptyRoute from './components/EmptyRoute'; // Consider renaming this to something meaningful
import JobItem from './components/JobItem';
import NotFound from './components/FailureView'; // Fallback 404 component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<EmptyRoute />} />
      <Route path="/home" element={<Home />} />
      <Route 
        path="/jobs" 
        element={
          
            <Jobs />
          
        } 
      />
      <Route 
        path="/jobs/:id" 
        element={
          
            <JobItem />
          
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
