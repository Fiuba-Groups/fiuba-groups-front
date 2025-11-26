import { ProtectedRoute } from './components/protectedRoute';
import GroupOffers from './screens/GroupOffers/index';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import PrivacyScreen from './screens/PrivacyScreen/PrivacyScreen';
import SecurityScreen from './screens/SecurityScreen/SecurityScreen';
import HelpScreen from './screens/HelpScreen/HelpScreen';
import CareerScreen from './screens/CareerScreen/CareerScreen';
import CreateGroupOffer from './screens/CreateGroupOffer/CreateGroupOffer';
import UserGroup from './screens/UserGroups/UserGroup';
import { useAuth } from './hooks';
import UserRequests from './screens/UserRequests/UserRequests';
import UserFriends from './screens/UserFriends/UserFriends';
import OtherUserProfile from './screens/OtherUserProfile/OtherUserProfile';
import UserSearches from './screens/UserSearches/UserSearches';
import AcademicScreen from './screens/AcademicHistoryScreen/AcademicScreen';

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
        path="/profile/privacy"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PrivacyScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/security"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SecurityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/help"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HelpScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/career"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CareerScreen />
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
            <UserSearches />
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
      <Route
        path="/academic-history"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AcademicScreen />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
