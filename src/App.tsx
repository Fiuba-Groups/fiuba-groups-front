import { useState } from 'react';
import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import CreateGroupOffer from './screens/GroupOffers/CreateOfferGroup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

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
            <LoginScreen onLogin={() => {
              localStorage.setItem('isLoggedIn', 'true');
              setIsLoggedIn(true);
            }} />
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
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute isAuthenticated={isLoggedIn}>
            <ProfileScreen />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/new-group-search"
        element={
          <ProtectedRoute isAuthenticated={isLoggedIn}>
            <CreateGroupOffer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
