import { useState } from 'react';
import LandingPage from './Screens/landingPage/index';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={
          !isLoggedIn ? (
            <LoginScreen onLogin={() => setIsLoggedIn(true)} />
          ) : (
            <Navigate to="/home" replace />
          )
        } 
      />
      <Route 
        path="/home" 
        element={
          isLoggedIn ? (
            <LandingPage />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;
