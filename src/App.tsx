import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import CreateGroupOffer from './screens/CreateGroupOffer/CreateGroupOffer';
import UserGroup from './screens/UserGroups/UserGroup';
import { useAuth } from './hooks';
import UserRequests from './screens/UserRequests/UserRequests';
import UserFriends from './screens/UserFriends/UserFriends';
import OtherUserProfile from './screens/OtherUserProfile/OtherUserProfile';

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
      <Route
        path="/my-groups"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-searches"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div style={{ padding: '2rem' }}>
              <h2>Mis búsquedas</h2>
              <p>Esta funcionalidad estará disponible próximamente.</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-friends"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserFriends />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
