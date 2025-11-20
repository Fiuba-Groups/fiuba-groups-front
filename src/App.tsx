import { useState } from 'react';
import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import CreateGroupOffer from './screens/GroupOffers/CreateOfferGroup';
import { isAuthenticated, logout } from "./services/authService";

function App() {
  const [logged, setLogged] = useState(isAuthenticated());

  if (!logged) return <LoginScreen onLogin={() => setLogged(true)} />;

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={
          !logged ? (
            <LoginScreen onLogin={() => {
              sessionStorage.setItem('isLoggedIn', 'true');
              setLogged(true);
            }} />
          ) : (
            <Navigate to="/home" replace />
          )
        } 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute isAuthenticated={logged}>
            <GroupOffers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute isAuthenticated={logged}>
            <ProfileScreen />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/new-group-search"
        element={
          <ProtectedRoute isAuthenticated={logged}>
            <CreateGroupOffer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
