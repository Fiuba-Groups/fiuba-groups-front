import { useState } from 'react';
import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
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
          <ProtectedRoute isAuthenticated={isLoggedIn}>
            <GroupOffers />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
