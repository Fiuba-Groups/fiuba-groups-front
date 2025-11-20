import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import CreateGroupOffer from './screens/CreateGroupOffer/CreateGroupOffer';
import { useAuth } from './hooks';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginScreen onLogin={() => window.location.reload()} />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <RegisterScreen onRegister={() => window.location.href = '/login'} />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <GroupOffers />
          </ProtectedRoute> 
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-group-search"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateGroupOffer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
