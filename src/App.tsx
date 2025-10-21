import React from 'react';
import logo from './logo.svg';
import GroupAdd from './components/group_add';
import { useState } from 'react';
import './App.css';
import Header from './components/header/header';
import LandingPage from './Screens/landingPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
