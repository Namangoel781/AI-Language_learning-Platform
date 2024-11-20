import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import LanguageSelection from "./pages/LanguageLearningApp";
import axios from "axios";
import Home from "./pages/Home";
import { LessonList } from "./pages/LessonList";
import { VideoPlayer } from "./pages/LessonPlayer";
import AudioRecorder from "./pages/AudioRecorder";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/check-auth",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          setUser({
            ...response.data.user,
            needsLanguageSetup: response.data.user.needs_language_setup,
          });
        } else {
          setUser(null); // Clear user data when not authenticated
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-pulse space-y-4 w-1/2">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/select-language"
          element={
            isAuthenticated ? (
              <LanguageSelection />
            ) : (
              <Navigate to={isAuthenticated ? "/" : "/login"} />
            )
          }
        />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/practice-1"
          element={
            isAuthenticated ? <AudioRecorder /> : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
